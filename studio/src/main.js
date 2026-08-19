import {
  assertDeckSpec, clone, coerceSlots, createDeck, createDeckFromIntake, LAYOUTS,
  outlineFromText, PROPOSALS, proposalFor, splitSlide, touchDeck,
} from './core.js';
import { makeThumbnail, renderDeck, renderSlide } from './renderer.js';
import { buildPptx, downloadBlob } from './pptx.js';
import { commitVersion, listVersions, loadSession, restoreVersion, saveSession } from './store.js';
import { repairDeck, validateDeck } from './validator.js';

const elements = Object.fromEntries([...document.querySelectorAll('[id]')].map((element) => [element.id, element]));
let deck = loadSession();
const firstRun = !deck || assertDeckSpec(deck).length > 0;
if (firstRun) deck = createDeck();
let activeIndex = 0;
let pendingImageSlot = null;
let saveTimer = null;
let toastTimer = null;
let timerStartedAt = null;
let timerElapsed = 0;
let timerHandle = null;
let pendingIntake = null;

const DEMO_CONTENT = `# 让品牌演示从生成到交付保持一致
模型负责理解内容与组织叙事，确定性代码负责品牌、布局、检测和导出。

# 智能负责判断，规则负责守住边界
模型理解材料并组织故事线，规则系统固定品牌、布局和输出边界。

# 同一份结构驱动全部交付
同一份 DeckSpec 驱动网页、PDF 和可编辑 PPTX。

# 固定布局让验证成本可控
10 个注册布局覆盖封面、主张、图文、对照、数字、流程与结尾。

# 每一次输出都遵循同一套品牌规则
在线修改、自动检测、演讲备注与导出共享同一个事实源。`;

function currentSlide() {
  return deck.slides[activeIndex];
}

function showToast(message, duration = 2600) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = setTimeout(() => { elements.toast.hidden = true; }, duration);
}

function scheduleSave(label = '编辑内容') {
  clearTimeout(saveTimer);
  elements.saveState.textContent = '正在保存…';
  touchDeck(deck);
  const persisted = saveSession(deck);
  if (!persisted) showToast('浏览器存储空间不足；当前编辑仍保留在本页，请尽快导出 DeckSpec 或 PPTX', 5000);
  saveTimer = setTimeout(() => {
    commitVersion(deck, label);
    elements.saveState.textContent = '所有更改已保存';
    renderVersions();
  }, 650);
}

function render() {
  activeIndex = Math.max(0, Math.min(activeIndex, deck.slides.length - 1));
  renderDeck(elements.stage, deck, { activeIndex, interactive: true });
  renderSlides();
  renderInspector();
  renderPrintDeck();
  updateHeader();
  updateStageScale();
}

function updateHeader() {
  const proposal = proposalFor(deck);
  elements.proposalLabel.textContent = `${proposal.label} · ${proposal.name}`;
  elements.pageCounter.textContent = `${activeIndex + 1} / ${deck.slides.length}`;
  elements.slideCount.textContent = `${deck.slides.length} 页`;
}

function renderSlides() {
  elements.slideList.replaceChildren();
  deck.slides.forEach((slide, index) => {
    const item = document.createElement('li');
    item.className = `slide-item${index === activeIndex ? ' is-active' : ''}`;
    item.dataset.index = String(index);
    item.append(makeThumbnail(slide, deck, 60, index));
    const copy = document.createElement('div');
    copy.className = 'slide-copy';
    const title = document.createElement('strong');
    title.textContent = slide.slots.title?.text || LAYOUTS[slide.layoutId].name;
    const meta = document.createElement('span');
    meta.textContent = `${String(index + 1).padStart(2, '0')} · ${LAYOUTS[slide.layoutId].name}`;
    copy.append(title, meta);
    item.append(copy);
    item.addEventListener('click', () => { activeIndex = index; render(); });
    elements.slideList.append(item);
  });
}

function createField(labelText, control, hint = '') {
  const field = document.createElement('div');
  field.className = 'field';
  const label = document.createElement('label');
  label.textContent = labelText;
  label.append(control);
  field.append(label);
  if (hint) {
    const small = document.createElement('small');
    small.textContent = hint;
    field.append(small);
  }
  return field;
}

function renderInspector() {
  const slide = currentSlide();
  const inspector = elements.inspector;
  inspector.replaceChildren();

  const layoutSelect = document.createElement('select');
  for (const [id, layout] of Object.entries(LAYOUTS)) {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = layout.name;
    option.selected = id === slide.layoutId;
    layoutSelect.append(option);
  }
  layoutSelect.addEventListener('change', () => {
    coerceSlots(slide, layoutSelect.value);
    scheduleSave('切换布局');
    render();
  });
  inspector.append(createField('注册布局', layoutSelect, '只能切换到通过验证的布局。'));

  for (const [name, value] of Object.entries(slide.slots)) {
    const definition = LAYOUTS[slide.layoutId].slots[name];
    if (value.kind === 'text') {
      const input = document.createElement(value.text.length > 36 || name === 'body' ? 'textarea' : 'input');
      if (input.tagName === 'TEXTAREA') input.rows = Math.min(7, Math.max(3, Math.ceil(value.text.length / 24)));
      input.value = value.text;
      input.dataset.slot = name;
      input.addEventListener('input', () => {
        value.text = input.value;
        touchDeck(deck);
        renderDeck(elements.stage, deck, { activeIndex, interactive: true });
        renderPrintDeck();
        scheduleSave(`修改 ${name}`);
      });
      inspector.append(createField(name, input, `${value.text.length} / 建议 ${definition.maxCharacters} 字`));
    } else {
      inspector.append(renderImageField(name, value));
    }
  }

  const notes = document.createElement('textarea');
  notes.rows = 5;
  notes.value = slide.speakerNotes || '';
  notes.addEventListener('input', () => {
    slide.speakerNotes = notes.value;
    scheduleSave('修改演讲备注');
  });
  inspector.append(createField('演讲者备注', notes));

  const actions = document.createElement('div');
  actions.className = 'inspector-actions';
  actions.append(
    actionButton('拆分页面', () => {
      if (!splitSlide(deck, activeIndex)) return showToast('当前页面没有足够长的文字可拆分');
      scheduleSave('拆分页面');
      render();
    }),
    actionButton('复制页面', () => {
      const copy = clone(slide);
      copy.id = crypto.randomUUID();
      deck.slides.splice(activeIndex + 1, 0, copy);
      activeIndex += 1;
      scheduleSave('复制页面');
      render();
    }),
    actionButton('删除页面', () => {
      if (deck.slides.length === 1) return showToast('文稿至少保留一页');
      deck.slides.splice(activeIndex, 1);
      scheduleSave('删除页面');
      render();
    }, 'danger'),
  );
  inspector.append(actions);
}

function renderImageField(name, value) {
  const wrapper = document.createElement('section');
  wrapper.className = 'field';
  const label = document.createElement('span');
  label.className = 'field-label';
  label.textContent = name;
  wrapper.append(label);

  const preview = document.createElement('div');
  preview.className = 'image-preview';
  if (value.src) {
    const img = document.createElement('img');
    img.src = value.src;
    img.alt = value.alt || '';
    img.style.objectFit = value.fit;
    img.style.objectPosition = `${value.focalPoint.x * 100}% ${value.focalPoint.y * 100}%`;
    preview.append(img);
  }
  const choose = actionButton(value.src ? '替换图片' : '选择图片', () => {
    pendingImageSlot = name;
    elements.imagePicker.click();
  });
  const role = document.createElement('select');
  for (const item of ['photo', 'screenshot', 'illustration', 'logo']) {
    const option = document.createElement('option');
    option.value = item; option.textContent = item; option.selected = value.role === item;
    role.append(option);
  }
  role.addEventListener('change', () => {
    value.role = role.value;
    if (['screenshot', 'logo'].includes(value.role)) value.fit = 'contain';
    scheduleSave('修改图片角色'); render();
  });
  const fit = document.createElement('select');
  for (const item of ['cover', 'contain']) {
    const option = document.createElement('option');
    option.value = item; option.textContent = item; option.selected = value.fit === item;
    fit.append(option);
  }
  fit.addEventListener('change', () => { value.fit = fit.value; scheduleSave('修改图片适配'); render(); });

  const row = document.createElement('div');
  row.className = 'field-row';
  row.append(role, fit);
  wrapper.append(preview, choose, row);
  for (const axis of ['x', 'y']) {
    const range = document.createElement('input');
    range.type = 'range'; range.min = '0'; range.max = '1'; range.step = '0.01';
    range.value = String(value.focalPoint?.[axis] ?? 0.5);
    range.addEventListener('input', () => {
      value.focalPoint ||= { x: 0.5, y: 0.5 };
      value.focalPoint[axis] = Number(range.value);
      renderDeck(elements.stage, deck, { activeIndex, interactive: true });
      renderPrintDeck();
      scheduleSave('调整图片焦点');
    });
    wrapper.append(createField(`焦点 ${axis.toUpperCase()}`, range));
  }
  return wrapper;
}

function actionButton(label, handler, className = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `button button-quiet ${className}`.trim();
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

function renderVersions() {
  const versions = listVersions();
  elements.versionCount.textContent = String(versions.length);
  elements.versionList.replaceChildren();
  versions.forEach((version) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const label = document.createElement('strong');
    label.textContent = version.label;
    const time = document.createElement('span');
    time.textContent = new Date(version.createdAt).toLocaleString('zh-CN', { hour12: false });
    button.append(label, time);
    button.addEventListener('click', () => {
      const restored = restoreVersion(version.id);
      if (!restored) return;
      deck = restored;
      activeIndex = 0;
      commitVersion(deck, `恢复：${version.label}`);
      render(); renderVersions(); showToast('已恢复所选版本');
    });
    item.append(button);
    elements.versionList.append(item);
  });
}

function renderProposalDialog() {
  elements.proposalGrid.replaceChildren();
  for (const proposal of PROPOSALS) {
    const proposalDeck = pendingIntake ? createDeckFromIntake(proposal.id, pendingIntake) : createDeck(proposal.id);
    const card = document.createElement('article');
    card.className = 'proposal-card';
    card.tabIndex = 0;
    const preview = document.createElement('div');
    preview.className = 'proposal-preview';
    proposalDeck.slides.slice(0, 3).forEach((slide, index) => preview.append(makeThumbnail(slide, proposalDeck, 92, index)));
    const title = document.createElement('h3');
    title.textContent = `${proposal.label} · ${proposal.name}`;
    const description = document.createElement('p');
    description.textContent = proposal.description;
    const choose = actionButton('选择此方案', () => chooseProposal(proposal.id), 'button-primary');
    card.append(preview, title, description, choose);
    card.addEventListener('dblclick', () => chooseProposal(proposal.id));
    elements.proposalGrid.append(card);
  }
}

function chooseProposal(proposalId) {
  deck = pendingIntake ? createDeckFromIntake(proposalId, pendingIntake) : createDeck(proposalId);
  activeIndex = 0;
  commitVersion(deck, `选择 ${proposalFor(deck).name}`);
  elements.proposalDialog.close();
  render(); renderVersions();
}

function renderPrintDeck() {
  renderDeck(elements.printDeck, deck, { all: true });
}

function updateStageScale() {
  const bounds = elements.stageViewport.getBoundingClientRect();
  const scale = Math.min((bounds.width - 56) / 750, (bounds.height - 42) / 1320, 1);
  elements.stageScaler.style.transform = `translate(-50%, -50%) scale(${Math.max(0.1, scale)})`;
}

async function runValidation({ quiet = false } = {}) {
  elements.validateButton.disabled = true;
  const result = await validateDeck(deck, elements.measureRoot);
  elements.validateButton.disabled = false;
  elements.validationSummary.hidden = false;
  elements.validationSummary.classList.toggle('is-error', !result.pass);
  elements.validationSummary.replaceChildren();
  const headline = document.createElement('strong');
  headline.textContent = result.pass
    ? `检测通过 · ${result.warningCount} 个提醒`
    : `检测未通过 · ${result.errorCount} 个错误，${result.warningCount} 个提醒`;
  elements.validationSummary.append(headline);
  if (result.issues.length) {
    const list = document.createElement('ul');
    result.issues.slice(0, 12).forEach((entry) => {
      const item = document.createElement('li'); item.textContent = entry.message; list.append(item);
    });
    elements.validationSummary.append(list);
  }
  if (!quiet) showToast(result.pass ? 'DOM 与品牌规则检测通过' : '发现需要处理的问题');
  return result;
}

async function autoRepair() {
  const allActions = [];
  for (let pass = 0; pass < 3; pass += 1) {
    const validation = await runValidation({ quiet: true });
    if (validation.pass) break;
    const repaired = repairDeck(deck, validation);
    if (!repaired.actions.length) break;
    deck = repaired.deck;
    allActions.push(...repaired.actions);
    render();
  }
  const final = await runValidation({ quiet: true });
  if (allActions.length) commitVersion(deck, `自动修复 ${allActions.length} 项`);
  render(); renderVersions();
  showToast(final.pass ? `自动修复完成：${allActions.join('；') || '无需修复'}` : '已完成三轮修复，仍有问题需要人工处理', 5000);
}

function navigate(delta) {
  activeIndex = Math.max(0, Math.min(deck.slides.length - 1, activeIndex + delta));
  render();
  if (!elements.presenter.hidden) renderPresenter();
}

function renderPresenter() {
  elements.presenterStage.replaceChildren();
  const fit = document.createElement('div');
  fit.className = 'stage-fit';
  fit.append(renderSlide(currentSlide(), deck, { index: activeIndex }));
  elements.presenterStage.append(fit);
  const bounds = elements.presenterStage.getBoundingClientRect();
  const scale = Math.min((bounds.width - 50) / 750, (bounds.height - 50) / 1320, 1);
  fit.style.transform = `translate(-50%, -50%) scale(${scale})`;
  elements.presenterNote.textContent = currentSlide().speakerNotes || '本页没有备注。';
  elements.presenterNextPreview.replaceChildren();
  const next = deck.slides[Math.min(activeIndex + 1, deck.slides.length - 1)];
  elements.presenterNextPreview.append(makeThumbnail(next, deck, 180, Math.min(activeIndex + 1, deck.slides.length - 1)));
}

function updateTimer() {
  const elapsed = timerElapsed + (timerStartedAt ? Date.now() - timerStartedAt : 0);
  const seconds = Math.floor(elapsed / 1000);
  elements.presenterTime.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function toggleTimer() {
  if (timerStartedAt) {
    timerElapsed += Date.now() - timerStartedAt;
    timerStartedAt = null;
    clearInterval(timerHandle);
    elements.timerButton.textContent = '继续计时';
  } else {
    timerStartedAt = Date.now();
    timerHandle = setInterval(updateTimer, 250);
    elements.timerButton.textContent = timerElapsed ? '暂停计时' : '暂停计时';
  }
  updateTimer();
}

elements.previousButton.addEventListener('click', () => navigate(-1));
elements.nextButton.addEventListener('click', () => navigate(1));
elements.addSlideButton.addEventListener('click', () => {
  const fresh = clone(createDeck(deck.proposalId).slides[1]);
  fresh.id = crypto.randomUUID();
  deck.slides.splice(activeIndex + 1, 0, fresh);
  activeIndex += 1;
  scheduleSave('添加页面'); render();
});
elements.versionToggle.addEventListener('click', () => {
  const expanded = elements.versionToggle.getAttribute('aria-expanded') === 'true';
  elements.versionToggle.setAttribute('aria-expanded', String(!expanded));
  elements.versionList.hidden = expanded;
});
elements.validateButton.addEventListener('click', () => runValidation());
elements.repairButton.addEventListener('click', autoRepair);
elements.newDeckButton.addEventListener('click', () => {
  elements.intakeText.value = DEMO_CONTENT;
  elements.outlineList.replaceChildren();
  elements.outlineEmpty.hidden = false;
  elements.confirmOutlineButton.disabled = true;
  elements.onboardingDialog.showModal();
});
elements.importButton.addEventListener('click', () => {
  elements.importText.value = JSON.stringify(deck, null, 2);
  elements.importDialog.showModal();
});
elements.generateOutlineButton.addEventListener('click', () => {
  const outline = outlineFromText(elements.intakeText.value);
  if (!outline.length) return showToast('请先输入或上传内容');
  pendingIntake = {
    content: elements.intakeText.value,
    purpose: elements.intakePurpose.value,
    density: elements.intakeDensity.value,
    outline,
  };
  elements.outlineList.replaceChildren();
  outline.forEach((section, index) => {
    const item = document.createElement('li');
    const number = document.createElement('span'); number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('strong'); title.textContent = section.title;
    item.append(number, title); elements.outlineList.append(item);
  });
  elements.outlinePreview.hidden = false;
  elements.outlineEmpty.hidden = true;
  elements.confirmOutlineButton.disabled = false;
});
elements.confirmOutlineButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (!pendingIntake) return showToast('请先生成大纲');
  elements.onboardingDialog.close();
  renderProposalDialog();
  elements.proposalDialog.showModal();
});
elements.intakePicker.addEventListener('change', async () => {
  const file = elements.intakePicker.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) return showToast('内容文件不能超过 2MB');
  if (!/\.(?:md|txt)$/i.test(file.name) && !['text/markdown', 'text/plain'].includes(file.type)) {
    elements.intakePicker.value = '';
    return showToast('只支持 Markdown 或纯文本内容');
  }
  elements.intakeText.value = await file.text();
  elements.intakePicker.value = '';
  elements.outlineList.replaceChildren();
  elements.outlineEmpty.hidden = false;
  elements.confirmOutlineButton.disabled = true;
});
elements.confirmImportButton.addEventListener('click', (event) => {
  event.preventDefault();
  try {
    const imported = JSON.parse(elements.importText.value);
    const errors = assertDeckSpec(imported);
    if (errors.length) throw new Error(errors.join('；'));
    deck = imported; activeIndex = 0;
    commitVersion(deck, '导入 DeckSpec');
    elements.importDialog.close(); render(); renderVersions(); showToast('DeckSpec 导入成功');
  } catch (error) {
    showToast(`导入失败：${error.message}`, 5000);
  }
});
elements.imagePicker.addEventListener('change', async () => {
  const file = elements.imagePicker.files?.[0];
  if (!file || !pendingImageSlot) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    elements.imagePicker.value = '';
    return showToast('只支持 PNG、JPEG 或 WebP 图片');
  }
  if (file.size > 10 * 1024 * 1024) return showToast('图片不能超过 10MB');
  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const value = currentSlide().slots[pendingImageSlot];
    value.src = dataUrl;
    value.alt = file.name;
    pendingImageSlot = null;
    elements.imagePicker.value = '';
    scheduleSave('替换图片'); render();
  } catch {
    elements.imagePicker.value = '';
    showToast('图片读取失败，请更换文件后重试');
  }
});
elements.pdfButton.addEventListener('click', () => { renderPrintDeck(); window.print(); });
elements.pptxButton.addEventListener('click', async () => {
  elements.pptxButton.disabled = true;
  elements.pptxButton.textContent = '生成中…';
  try {
    const validation = await runValidation({ quiet: true });
    if (!validation.pass) throw new Error('请先修复 DOM 错误再导出');
    const result = await buildPptx(deck, elements.measureRoot);
    if (!result.validation.pass) throw new Error(result.validation.errors.join('；'));
    downloadBlob(result.blob, `${deck.title || 'brand-deck'}.pptx`);
    showToast(`PPTX 已验证：${result.validation.slideCount} 页，${result.validation.noteCount} 页备注`);
  } catch (error) {
    showToast(`PPTX 导出失败：${error.message}`, 6000);
  } finally {
    elements.pptxButton.disabled = false;
    elements.pptxButton.textContent = 'PPTX';
  }
});
elements.presentButton.addEventListener('click', () => {
  elements.presenter.hidden = false; renderPresenter(); updateTimer();
});
elements.exitPresenter.addEventListener('click', () => { elements.presenter.hidden = true; });
elements.presenterPrevious.addEventListener('click', () => navigate(-1));
elements.presenterNext.addEventListener('click', () => navigate(1));
elements.timerButton.addEventListener('click', toggleTimer);

window.addEventListener('keydown', (event) => {
  if (event.target.matches('input, textarea, select') || elements.proposalDialog.open || elements.importDialog.open) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown') navigate(1);
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') navigate(-1);
  if (event.key === 'Escape' && !elements.presenter.hidden) elements.presenter.hidden = true;
});
new ResizeObserver(() => {
  updateStageScale();
  if (!elements.presenter.hidden) renderPresenter();
}).observe(elements.stageViewport);

commitVersion(deck, firstRun ? '初始化文稿' : '继续编辑');
renderProposalDialog();
render();
renderVersions();
if (firstRun) {
  elements.intakeText.value = DEMO_CONTENT;
  elements.onboardingDialog.showModal();
}

window.__STUDIO__ = {
  getDeck: () => clone(deck),
  setDeck: (value) => { deck = clone(value); activeIndex = 0; render(); },
  validate: () => validateDeck(deck, elements.measureRoot),
  buildPptx: () => buildPptx(deck, elements.measureRoot),
  selectProposal: chooseProposal,
  ready: true,
};
