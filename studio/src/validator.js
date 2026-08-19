import { assertDeckSpec, clone, coerceSlots, LAYOUTS, splitSlide, touchDeck } from './core.js';
import { renderDeck } from './renderer.js';

const issue = (severity, kind, message, extra = {}) => ({ severity, kind, message, ...extra });
const ALLOWED_SLIDE_FONT_SIZES = new Set([15, 30, 45, 60, 75]);

export async function validateDeck(deck, measureRoot) {
  const issues = assertDeckSpec(deck).map((message) => issue('error', 'SCHEMA', message));
  if (issues.length) return report(issues);

  for (const [slideIndex, slide] of deck.slides.entries()) {
    const layout = LAYOUTS[slide.layoutId];
    for (const [slotId, definition] of Object.entries(layout.slots)) {
      const value = slide.slots[slotId];
      if (value?.kind === 'text' && value.text.length > definition.maxCharacters) {
        issues.push(issue('warning', 'TEXT_DENSITY', `第 ${slideIndex + 1} 页「${slotId}」超过建议字数`, { slideIndex, slotId }));
      }
      if (value?.kind === 'image') {
        if (value.role === 'screenshot' && value.fit !== 'contain') {
          issues.push(issue('error', 'IMAGE_FIT', `第 ${slideIndex + 1} 页截图必须使用 contain`, { slideIndex, slotId }));
        }
        if (!value.src) {
          issues.push(issue('warning', 'IMAGE_PLACEHOLDER', `第 ${slideIndex + 1} 页仍使用图片占位`, { slideIndex, slotId }));
        }
      }
    }
  }

  renderDeck(measureRoot, deck, { all: true });
  await document.fonts.ready;
  await Promise.all([...measureRoot.querySelectorAll('img')].map((img) => img.decode?.().catch(() => {})));

  const canvases = [...measureRoot.querySelectorAll('.slide-canvas')];
  canvases.forEach((canvas, slideIndex) => {
    const canvasRect = canvas.getBoundingClientRect();
    const slots = [...canvas.querySelectorAll(':scope > [data-slot-id]')];
    for (const slot of slots) {
      const slotId = slot.dataset.slotId;
      const rect = slot.getBoundingClientRect();
      const outside = rect.left < canvasRect.left - 0.5
        || rect.top < canvasRect.top - 0.5
        || rect.right > canvasRect.right + 0.5
        || rect.bottom > canvasRect.bottom + 0.5;
      if (outside) issues.push(issue('error', 'CANVAS_OVERFLOW', `第 ${slideIndex + 1} 页「${slotId}」越出画布`, { slideIndex, slotId }));
      if (slot.scrollHeight > slot.clientHeight + 1 || slot.scrollWidth > slot.clientWidth + 1) {
        issues.push(issue('error', 'CONTENT_OVERFLOW', `第 ${slideIndex + 1} 页「${slotId}」内容溢出`, { slideIndex, slotId }));
      }
      if (slot.dataset.slotKind === 'image') {
        const img = slot.querySelector('img');
        if (img && (!img.complete || !img.naturalWidth)) {
          issues.push(issue('error', 'BROKEN_IMAGE', `第 ${slideIndex + 1} 页「${slotId}」图片加载失败`, { slideIndex, slotId }));
        }
        if (img && img.naturalWidth < rect.width * 1.5) {
          issues.push(issue('warning', 'LOW_RESOLUTION', `第 ${slideIndex + 1} 页「${slotId}」图片分辨率偏低`, { slideIndex, slotId }));
        }
      }
      if (slot.dataset.slotKind === 'text') {
        const fontSize = Math.round(Number.parseFloat(getComputedStyle(slot).fontSize));
        if (!ALLOWED_SLIDE_FONT_SIZES.has(fontSize)) {
          issues.push(issue('error', 'BRAND_TYPE_SIZE', `第 ${slideIndex + 1} 页「${slotId}」使用未授权字号 ${fontSize}px`, { slideIndex, slotId }));
        }
        for (const line of renderedLines(slot)) {
          if (/^\p{Script=Han}[\p{Punctuation}，。！？；：、]*$/u.test(line)) {
            issues.push(issue('error', 'CJK_ORPHAN', `第 ${slideIndex + 1} 页「${slotId}」出现单字行「${line}」`, { slideIndex, slotId }));
            break;
          }
        }
      }
    }
    for (let left = 0; left < slots.length; left += 1) {
      for (let right = left + 1; right < slots.length; right += 1) {
        const a = slots[left].getBoundingClientRect();
        const b = slots[right].getBoundingClientRect();
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapX > 2 && overlapY > 2) {
          issues.push(issue('error', 'SLOT_OVERLAP', `第 ${slideIndex + 1} 页「${slots[left].dataset.slotId}」与「${slots[right].dataset.slotId}」重叠`, {
            slideIndex, slotId: slots[left].dataset.slotId, otherSlotId: slots[right].dataset.slotId,
          }));
        }
      }
    }
  });
  measureRoot.replaceChildren();
  return report(dedupe(issues));
}

function renderedLines(element) {
  const node = element.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return [];
  const lines = new Map();
  for (let index = 0; index < node.textContent.length; index += 1) {
    const character = node.textContent[index];
    if (character === '\n') continue;
    const range = document.createRange();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    const rect = range.getBoundingClientRect();
    const key = Math.round(rect.top);
    lines.set(key, `${lines.get(key) || ''}${character}`);
  }
  return [...lines.values()].map((line) => line.trim()).filter(Boolean);
}

function report(issues) {
  return {
    pass: !issues.some((item) => item.severity === 'error'),
    errorCount: issues.filter((item) => item.severity === 'error').length,
    warningCount: issues.filter((item) => item.severity === 'warning').length,
    issues,
  };
}

function dedupe(issues) {
  const seen = new Set();
  return issues.filter((item) => {
    const key = `${item.kind}:${item.slideIndex}:${item.slotId}:${item.otherSlotId || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function repairDeck(deck, validation) {
  const repaired = clone(deck);
  const actions = [];
  const processedSlides = new Set();

  for (const current of validation.issues) {
    const slide = repaired.slides[current.slideIndex];
    if (!slide) continue;
    if (current.kind === 'IMAGE_FIT' && slide.slots[current.slotId]?.kind === 'image') {
      slide.slots[current.slotId].fit = 'contain';
      actions.push(`第 ${current.slideIndex + 1} 页截图改为 contain`);
      continue;
    }
    if ((current.kind === 'CONTENT_OVERFLOW' || current.kind === 'TEXT_DENSITY') && !processedSlides.has(slide.id)) {
      if (splitSlide(repaired, current.slideIndex, current.slotId)) {
        processedSlides.add(slide.id);
        actions.push(`拆分第 ${current.slideIndex + 1} 页的溢出内容`);
      } else {
        const alternative = LAYOUTS[slide.layoutId].density === 'low' ? 'comparison' : 'statement';
        coerceSlots(slide, alternative);
        actions.push(`第 ${current.slideIndex + 1} 页切换为 ${LAYOUTS[alternative].name}`);
      }
    }
  }
  touchDeck(repaired);
  return { deck: repaired, actions };
}
