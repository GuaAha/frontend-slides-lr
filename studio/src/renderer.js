import { CANVAS, LAYOUTS, brand } from './core.js';

const TAG_BY_SLOT = {
  title: 'h1', eyebrow: 'p', body: 'p', meta: 'p', caption: 'p', index: 'p',
  point1: 'p', point2: 'p', point3: 'p', leftTitle: 'h2', leftBody: 'p',
  rightTitle: 'h2', rightBody: 'p', metric: 'p', unit: 'p', source: 'p',
  step1: 'p', step2: 'p', step3: 'p', action: 'p',
};

function applyBrandTokens(element) {
  const palette = brand.palette;
  element.style.setProperty('--paper', palette.paper);
  element.style.setProperty('--surface', palette.surface);
  element.style.setProperty('--ink', palette.ink);
  element.style.setProperty('--muted', palette.muted);
  element.style.setProperty('--accent', palette.accent);
  element.style.setProperty('--accent-dark', palette.accent_dark);
  element.style.setProperty('--line', palette.line);
  element.style.setProperty('--inverse', palette.inverse);
  element.style.setProperty('--inverse-text', palette.inverse_text);
}

function textElement(name, content) {
  const element = document.createElement(TAG_BY_SLOT[name] || 'p');
  element.className = `slot slot-${name}`;
  element.dataset.slotId = name;
  element.dataset.slotKind = 'text';
  element.dataset.exportKind = 'text';
  element.textContent = content?.text || '';
  return element;
}

function imageElement(name, content) {
  const figure = document.createElement('figure');
  figure.className = `slot slot-${name} image-slot`;
  figure.dataset.slotId = name;
  figure.dataset.slotKind = 'image';
  figure.dataset.exportKind = 'image';
  figure.dataset.imageRole = content?.role || 'photo';
  figure.dataset.imageFit = content?.fit || 'cover';
  if (content?.src) {
    const img = document.createElement('img');
    img.src = content.src;
    img.alt = content.alt || '';
    img.style.objectFit = content.fit || 'cover';
    const focal = content.focalPoint || { x: 0.5, y: 0.5 };
    img.style.objectPosition = `${focal.x * 100}% ${focal.y * 100}%`;
    figure.append(img);
  } else {
    figure.dataset.imagePlaceholder = 'true';
    const visual = document.createElement('div');
    visual.className = 'placeholder-visual';
    visual.innerHTML = '<span></span><span></span><span></span>';
    const label = document.createElement('b');
    label.textContent = 'IMAGE SLOT';
    figure.append(visual, label);
  }
  return figure;
}

function shape(className, label = '') {
  const element = document.createElement('div');
  element.className = `decor ${className}`;
  element.dataset.exportKind = label ? 'text' : 'shape';
  element.setAttribute('aria-hidden', 'true');
  if (label) {
    element.dataset.shapeLabel = label;
    element.textContent = label;
  }
  return element;
}

const BUILDERS = {
  cover(slide, add) {
    add('eyebrow'); add('title'); add('body'); add('meta'); add('hero');
    return [shape('cover-rule'), shape('cover-index', '01')];
  },
  statement(slide, add) {
    add('eyebrow'); add('title'); add('body'); add('index');
    return [shape('statement-field')];
  },
  'image-hero'(slide, add) {
    add('eyebrow'); add('title'); add('body'); add('hero'); add('caption');
    return [shape('hero-rule')];
  },
  'image-left'(slide, add) {
    add('hero'); add('eyebrow'); add('title'); add('body'); add('caption');
    return [shape('side-number', 'A')];
  },
  'image-right'(slide, add) {
    add('eyebrow'); add('title'); add('body'); add('hero'); add('caption');
    return [shape('side-number', 'B')];
  },
  'three-points'(slide, add) {
    add('eyebrow'); add('title'); add('point1'); add('point2'); add('point3');
    return [shape('points-field')];
  },
  comparison(slide, add) {
    add('eyebrow'); add('title'); add('leftTitle'); add('leftBody'); add('rightTitle'); add('rightBody');
    return [shape('compare-divider')];
  },
  metric(slide, add) {
    add('eyebrow'); add('title'); add('metric'); add('unit'); add('body'); add('source');
    return [shape('metric-orbit')];
  },
  timeline(slide, add) {
    add('eyebrow'); add('title'); add('step1'); add('step2'); add('step3');
    return [shape('timeline-line')];
  },
  closing(slide, add) {
    add('eyebrow'); add('title'); add('body'); add('action');
    return [shape('closing-field')];
  },
};

export function renderSlide(slide, deck, options = {}) {
  if (!LAYOUTS[slide.layoutId]) throw new Error(`未注册布局：${slide.layoutId}`);
  const canvas = document.createElement('section');
  canvas.className = `slide-canvas layout-${slide.layoutId}`;
  canvas.dataset.slideId = slide.id;
  canvas.dataset.layoutId = slide.layoutId;
  canvas.dataset.proposalId = deck.proposalId;
  canvas.style.width = `${CANVAS.width}px`;
  canvas.style.height = `${CANVAS.height}px`;
  applyBrandTokens(canvas);

  const add = (name) => {
    const content = slide.slots[name];
    if (!content) return;
    const element = content.kind === 'image' ? imageElement(name, content) : textElement(name, content);
    if (options.interactive) element.tabIndex = 0;
    canvas.append(element);
  };
  const decorations = BUILDERS[slide.layoutId](slide, add) || [];
  canvas.prepend(...decorations);

  const page = document.createElement('span');
  page.className = 'page-number';
  page.dataset.exportKind = 'text';
  page.textContent = String(options.index + 1).padStart(2, '0');
  canvas.append(page);
  return canvas;
}

export function renderDeck(container, deck, options = {}) {
  container.replaceChildren();
  deck.slides.forEach((slide, index) => {
    const element = renderSlide(slide, deck, { ...options, index });
    if (!options.all && index !== options.activeIndex) element.hidden = true;
    container.append(element);
  });
}

export function makeThumbnail(slide, deck, width = 90, index = 0) {
  const wrapper = document.createElement('div');
  wrapper.className = 'thumbnail-frame';
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${width * CANVAS.height / CANVAS.width}px`;
  const canvas = renderSlide(slide, deck, { index });
  canvas.style.transform = `scale(${width / CANVAS.width})`;
  canvas.style.transformOrigin = 'top left';
  wrapper.append(canvas);
  return wrapper;
}
