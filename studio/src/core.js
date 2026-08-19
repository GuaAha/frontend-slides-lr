import brand from '../../brand/source.json' with { type: 'json' };

export const CANVAS = Object.freeze({ width: 750, height: 1320 });
const SAFE_EMBEDDED_IMAGE = /^data:image\/(?:png|jpeg|webp);base64,/i;

const text = (maxCharacters, required = true) => ({ kind: 'text', maxCharacters, required });
const image = (role = 'photo', required = false) => ({ kind: 'image', imageRole: role, required });

export const LAYOUTS = Object.freeze({
  cover: {
    name: '封面', density: 'low',
    slots: { eyebrow: text(24, false), title: text(42), body: text(100, false), meta: text(36, false), hero: image('illustration', false) },
  },
  statement: {
    name: '主张', density: 'low',
    slots: { eyebrow: text(24, false), title: text(52), body: text(140, false), index: text(8, false) },
  },
  'image-hero': {
    name: '主视觉', density: 'medium',
    slots: { eyebrow: text(24, false), title: text(36), body: text(90, false), hero: image('photo'), caption: text(48, false) },
  },
  'image-left': {
    name: '左图右文', density: 'medium',
    slots: { eyebrow: text(24, false), title: text(34), body: text(160), hero: image('photo'), caption: text(42, false) },
  },
  'image-right': {
    name: '左文右图', density: 'medium',
    slots: { eyebrow: text(24, false), title: text(34), body: text(160), hero: image('photo'), caption: text(42, false) },
  },
  'three-points': {
    name: '三项要点', density: 'high',
    slots: { eyebrow: text(24, false), title: text(36), point1: text(72), point2: text(72), point3: text(72) },
  },
  comparison: {
    name: '双栏对照', density: 'high',
    slots: { eyebrow: text(24, false), title: text(34), leftTitle: text(18), leftBody: text(120), rightTitle: text(18), rightBody: text(120) },
  },
  metric: {
    name: '关键数字', density: 'low',
    slots: { eyebrow: text(24, false), title: text(34), metric: text(12), unit: text(12, false), body: text(120), source: text(64, false) },
  },
  timeline: {
    name: '三步流程', density: 'high',
    slots: { eyebrow: text(24, false), title: text(34), step1: text(72), step2: text(72), step3: text(72) },
  },
  closing: {
    name: '结尾', density: 'low',
    slots: { eyebrow: text(24, false), title: text(38), body: text(100, false), action: text(32, false) },
  },
});

export const PROPOSALS = Object.freeze([
  {
    id: 'editorial-air', label: '方案 A', name: '留白叙事',
    description: '大标题与克制留白，适合演讲者主导。',
    sequence: ['cover', 'statement', 'image-hero', 'metric', 'closing'],
  },
  {
    id: 'evidence-grid', label: '方案 B', name: '证据网格',
    description: '中等密度和清晰分区，适合内部提案。',
    sequence: ['cover', 'three-points', 'comparison', 'metric', 'closing'],
  },
  {
    id: 'image-rhythm', label: '方案 C', name: '图像节奏',
    description: '图文交替，适合产品与案例展示。',
    sequence: ['cover', 'image-left', 'image-right', 'timeline', 'closing'],
  },
]);

export const PURPOSES = Object.freeze(['internal-update', 'decision-review', 'teaching', 'proposal', 'other']);
export const DENSITIES = Object.freeze(['speaker-led', 'reading-first']);

const baseContent = {
  eyebrow: 'INTERNAL BRAND SYSTEM',
  title: '让品牌演示从生成到交付保持一致',
  body: '模型负责理解内容与组织叙事，确定性代码负责品牌、布局、检测和导出。',
};

const slot = (kind, value, extra = {}) => kind === 'text'
  ? { kind, text: value, ...extra }
  : { kind, src: value || '', alt: extra.alt || '演示图片', fit: extra.fit || 'cover', role: extra.role || 'photo', focalPoint: extra.focalPoint || { x: 0.5, y: 0.5 } };

function contentFor(layoutId, index) {
  const common = {
    eyebrow: slot('text', index === 0 ? baseContent.eyebrow : `0${index + 1} / SYSTEM`),
    title: slot('text', baseContent.title),
    body: slot('text', baseContent.body),
  };
  const imageSlot = slot('image', '', { role: 'illustration', alt: '品牌系统抽象视觉' });
  const variants = {
    cover: { ...common, meta: slot('text', '固定品牌内部版 · 2026'), hero: imageSlot },
    statement: { ...common, title: slot('text', '智能负责判断，规则负责守住边界'), index: slot('text', '01') },
    'image-hero': { ...common, title: slot('text', '同一份结构驱动全部交付'), hero: imageSlot, caption: slot('text', '同一份结构化数据驱动网页、PDF 和 PPTX') },
    'image-left': { ...common, hero: imageSlot, caption: slot('text', '真实图片参与大纲，而不是最后才被塞进页面') },
    'image-right': { ...common, title: slot('text', '图片槽位决定裁切，而不是模型随意摆放'), hero: imageSlot, caption: slot('text', '截图保持完整，照片保留焦点') },
    'three-points': {
      eyebrow: common.eyebrow, title: slot('text', '可靠生成需要三种确定性'),
      point1: slot('text', '01\n品牌 Token 只有一个事实源'),
      point2: slot('text', '02\n模型只能选择注册布局'),
      point3: slot('text', '03\n导出前必须通过 DOM 检测'),
    },
    comparison: {
      eyebrow: common.eyebrow, title: slot('text', '模型能力与工程约束各司其职'),
      leftTitle: slot('text', 'Agent'), leftBody: slot('text', '理解材料\n组织故事线\n选择页面布局\n精简溢出内容'),
      rightTitle: slot('text', 'Renderer'), rightBody: slot('text', '应用品牌 Token\n固定几何位置\n检测 DOM\n输出多种格式'),
    },
    metric: {
      eyebrow: common.eyebrow, title: slot('text', '固定布局让验证成本可控'),
      metric: slot('text', '10'), unit: slot('text', '个注册布局'),
      body: slot('text', '覆盖封面、主张、图文、对照、数字、流程与结尾。每个布局只有已声明的槽位。'),
      source: slot('text', '当前原型数据'),
    },
    timeline: {
      eyebrow: common.eyebrow, title: slot('text', '从内容到交付，保留三个检查点'),
      step1: slot('text', '01\n确认大纲\n先确定讲什么'),
      step2: slot('text', '02\n选择方案\n再确定怎么讲'),
      step3: slot('text', '03\n自动检测\n最后确认没有坏页'),
    },
    closing: { ...common, title: slot('text', '每一次输出，都遵循同一套品牌规则'), action: slot('text', '继续编辑 →') },
  };
  return variants[layoutId];
}

function cleanHeading(value) {
  return value.replace(/^#{1,6}\s+/, '').replace(/^[-*+]\s+/, '').trim();
}

export function outlineFromText(source) {
  const normalized = String(source || '').replace(/\r\n?/g, '\n').trim();
  if (!normalized) return [];
  const lines = normalized.split('\n');
  const sections = [];
  let current = null;
  const flush = () => {
    if (!current) return;
    const body = current.body.join('\n').trim();
    sections.push({ title: current.title.trim(), body });
    current = null;
  };
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^#{1,6}\s+\S/.test(line)) {
      flush();
      current = { title: cleanHeading(line), body: [] };
    } else if (line) {
      if (!current) current = { title: cleanHeading(line).slice(0, 42), body: [] };
      else current.body.push(cleanHeading(line));
    } else if (current?.body.length) {
      current.body.push('');
    }
  }
  flush();
  if (sections.length === 1 && !sections[0].body) sections[0].body = sections[0].title;
  return sections.slice(0, 24);
}

function textChunks(section) {
  const chunks = section.body
    .split(/\n+|(?<=[。！？；.!?;])/u)
    .map((value) => value.replace(/^[-*+]\s+/, '').trim())
    .filter(Boolean);
  return chunks.length ? chunks : [section.title];
}

function applySection(slide, section, index, intake) {
  const chunks = textChunks(section);
  const fullBody = section.body || chunks.join('\n');
  const midpoint = Math.max(1, Math.ceil(chunks.length / 2));
  const numeric = `${section.title} ${fullBody}`.match(/\d+(?:\.\d+)?%?/)?.[0] || String(index + 1).padStart(2, '0');
  const values = {
    eyebrow: `SECTION ${String(index + 1).padStart(2, '0')}`,
    title: section.title,
    body: fullBody,
    meta: `${intake.purpose} · ${intake.density}`,
    caption: chunks.at(-1),
    index: String(index + 1).padStart(2, '0'),
    point1: chunks[0], point2: chunks[1] || chunks[0], point3: chunks[2] || chunks.at(-1),
    leftTitle: '内容 A', rightTitle: '内容 B',
    leftBody: chunks.slice(0, midpoint).join('\n'), rightBody: chunks.slice(midpoint).join('\n') || chunks.at(-1),
    metric: numeric, unit: 'SECTION', source: chunks.at(-1),
    step1: chunks[0], step2: chunks[1] || chunks[0], step3: chunks[2] || chunks.at(-1),
    action: '继续编辑 →',
  };
  for (const [name, slotValue] of Object.entries(slide.slots)) {
    if (slotValue.kind === 'text') slotValue.text = String(values[name] ?? chunks[0] ?? section.title);
  }
  return slide;
}

export function createDeckFromIntake(proposalId, intake) {
  const outline = Array.isArray(intake?.outline) && intake.outline.length
    ? intake.outline
    : outlineFromText(intake?.content);
  if (!outline.length) return createDeck(proposalId);
  const proposal = PROPOSALS.find((item) => item.id === proposalId) || PROPOSALS[0];
  const deck = createDeck(proposal.id);
  const middleLayouts = proposal.sequence.slice(1, -1);
  deck.purpose = PURPOSES.includes(intake.purpose) ? intake.purpose : 'proposal';
  deck.density = DENSITIES.includes(intake.density) ? intake.density : 'speaker-led';
  deck.title = outline[0].title;
  deck.slides = outline.map((section, index) => {
    let layoutId = 'cover';
    if (index === outline.length - 1 && index > 0) layoutId = 'closing';
    else if (index > 0) layoutId = middleLayouts[(index - 1) % middleLayouts.length] || 'statement';
    const base = clone(createDeck(proposal.id).slides.find((slide) => slide.layoutId === layoutId)
      || createDeck(proposal.id).slides[0]);
    base.id = crypto.randomUUID();
    base.layoutId = layoutId;
    base.slots = contentFor(layoutId, index);
    base.speakerNotes = `围绕“${section.title}”讲述本页唯一结论。`;
    return applySection(base, section, index, deck);
  });
  touchDeck(deck);
  return deck;
}

export function createDeck(proposalId = PROPOSALS[0].id) {
  const proposal = PROPOSALS.find((item) => item.id === proposalId) || PROPOSALS[0];
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    title: '固定品牌演示系统',
    brandVersion: `brand-${brand.schema_version}`,
    canvas: { ...CANVAS },
    purpose: 'proposal',
    density: 'speaker-led',
    proposalId: proposal.id,
    createdAt: now,
    updatedAt: now,
    slides: proposal.sequence.map((layoutId, index) => ({
      id: crypto.randomUUID(),
      layoutId,
      slots: contentFor(layoutId, index),
      speakerNotes: index === 0
        ? '先说明这不是一个自由画布，而是一条受品牌约束的生产链路。'
        : '围绕本页唯一结论讲述，避免逐字朗读。',
    })),
  };
}

export function clone(value) {
  return structuredClone(value);
}

export function touchDeck(deck) {
  deck.updatedAt = new Date().toISOString();
  return deck;
}

export function coerceSlots(slide, targetLayoutId) {
  const target = LAYOUTS[targetLayoutId];
  if (!target) throw new Error(`未知布局：${targetLayoutId}`);
  const old = Object.values(slide.slots || {});
  const textValues = old.filter((item) => item.kind === 'text').map((item) => item.text);
  const imageValue = old.find((item) => item.kind === 'image');
  let textIndex = 0;
  const slots = {};
  for (const [name, definition] of Object.entries(target.slots)) {
    if (slide.slots?.[name]?.kind === definition.kind) {
      slots[name] = clone(slide.slots[name]);
    } else if (definition.kind === 'image') {
      slots[name] = imageValue ? clone(imageValue) : slot('image', '', { role: definition.imageRole });
    } else {
      slots[name] = slot('text', textValues[textIndex++] || (definition.required ? '待补充' : ''));
    }
  }
  slide.layoutId = targetLayoutId;
  slide.slots = slots;
  return slide;
}

export function splitSlide(deck, slideIndex, slotName = null) {
  const source = deck.slides[slideIndex];
  if (!source) return null;
  const candidates = Object.entries(source.slots)
    .filter(([, item]) => item.kind === 'text' && item.text.length > 40)
    .sort((a, b) => b[1].text.length - a[1].text.length);
  const [name, item] = slotName && source.slots[slotName]?.kind === 'text'
    ? [slotName, source.slots[slotName]]
    : candidates[0] || [];
  if (!item) return null;
  const breakAt = findSentenceBreak(item.text);
  const second = clone(source);
  second.id = crypto.randomUUID();
  second.slots[name].text = item.text.slice(breakAt).trim();
  source.slots[name].text = item.text.slice(0, breakAt).trim();
  if (second.slots.title?.kind === 'text') second.slots.title.text = `${second.slots.title.text}（续）`;
  deck.slides.splice(slideIndex + 1, 0, second);
  touchDeck(deck);
  return second;
}

function findSentenceBreak(value) {
  const midpoint = Math.floor(value.length / 2);
  const candidates = [...value.matchAll(/[。！？；.!?;\n]/g)].map((match) => match.index + 1);
  if (!candidates.length) return midpoint;
  return candidates.reduce((best, current) => Math.abs(current - midpoint) < Math.abs(best - midpoint) ? current : best);
}

export function assertDeckSpec(deck) {
  const errors = [];
  if (!deck || typeof deck !== 'object') return ['DeckSpec 必须是对象'];
  if (deck.schemaVersion !== 1) errors.push('schemaVersion 必须为 1');
  if (deck.canvas?.width !== CANVAS.width || deck.canvas?.height !== CANVAS.height) errors.push('画布必须固定为 750 × 1320');
  if (!PURPOSES.includes(deck.purpose)) errors.push('purpose 不在允许范围内');
  if (!DENSITIES.includes(deck.density)) errors.push('density 不在允许范围内');
  if (!Array.isArray(deck.slides) || !deck.slides.length) errors.push('至少需要一页');
  for (const [index, slide] of (deck.slides || []).entries()) {
    const layout = LAYOUTS[slide.layoutId];
    if (!layout) {
      errors.push(`第 ${index + 1} 页使用未注册布局 ${slide.layoutId}`);
      continue;
    }
    for (const [name, definition] of Object.entries(layout.slots)) {
      const value = slide.slots?.[name];
      if (definition.required && !value) errors.push(`第 ${index + 1} 页缺少 ${name}`);
      if (value && value.kind !== definition.kind) errors.push(`第 ${index + 1} 页 ${name} 类型错误`);
      if (value?.kind === 'text' && definition.required && !value.text.trim()) errors.push(`第 ${index + 1} 页 ${name} 不能为空`);
      if (value?.kind === 'image' && value.src && !SAFE_EMBEDDED_IMAGE.test(value.src)) {
        errors.push(`第 ${index + 1} 页 ${name} 只能使用内嵌 PNG、JPEG 或 WebP 图片`);
      }
    }
    for (const name of Object.keys(slide.slots || {})) {
      if (!layout.slots[name]) errors.push(`第 ${index + 1} 页包含未注册槽位 ${name}`);
    }
  }
  return errors;
}

export function proposalFor(deck) {
  return PROPOSALS.find((item) => item.id === deck.proposalId) || PROPOSALS[0];
}

export { brand };
