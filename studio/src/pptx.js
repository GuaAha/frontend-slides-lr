import PptxGenJS from 'pptxgenjs';
import JSZip from 'jszip';
import { CANVAS, brand } from './core.js';
import { renderDeck } from './renderer.js';

const toInches = (value) => value / 100;
const pxToPoints = (value) => Math.max(6, value * 0.75);

function colorToHex(value, fallback = '000000') {
  if (!value || value === 'transparent' || value === 'rgba(0, 0, 0, 0)') return fallback;
  if (value.startsWith('#')) return value.slice(1).toUpperCase();
  const values = value.match(/[\d.]+/g)?.map(Number);
  if (!values || values.length < 3) return fallback;
  return values.slice(0, 3).map((part) => Math.round(part).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function position(element, canvasRect) {
  const rect = element.getBoundingClientRect();
  return {
    x: toInches(rect.left - canvasRect.left),
    y: toInches(rect.top - canvasRect.top),
    w: toInches(rect.width),
    h: toInches(rect.height),
  };
}

function textOptions(element, canvasRect) {
  const style = getComputedStyle(element);
  const align = ['center', 'right', 'justify'].includes(style.textAlign) ? style.textAlign : 'left';
  const cssFontSize = Number.parseFloat(style.fontSize) || 15;
  const isLongDisplayTitle = element.classList.contains('slot-title') && (element.textContent || '').length > 14;
  return {
    ...position(element, canvasRect),
    fontFace: style.fontFamily.split(',')[0].replace(/["']/g, '').trim() || 'Microsoft YaHei',
    fontSize: isLongDisplayTitle ? Math.min(50, pxToPoints(cssFontSize)) : pxToPoints(cssFontSize),
    bold: Number.parseInt(style.fontWeight, 10) >= 700,
    color: colorToHex(style.color),
    margin: 0,
    breakLine: false,
    valign: 'top',
    align,
    paraSpaceAfterPt: 0,
    lineSpacingMultiple: 1,
    fit: 'shrink',
  };
}

function renderedText(element) {
  const node = element.firstChild;
  const raw = element.textContent || '';
  if (!node || node.nodeType !== Node.TEXT_NODE || !raw) return raw;
  const lines = [];
  let line = '';
  let lastTop = null;
  for (let index = 0; index < raw.length; index += 1) {
    const character = raw[index];
    if (character === '\n') {
      lines.push(line);
      line = '';
      lastTop = null;
      continue;
    }
    const range = document.createRange();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    const rect = range.getBoundingClientRect();
    if (lastTop !== null && Math.abs(rect.top - lastTop) > 1 && line) {
      lines.push(line.trimEnd());
      line = '';
    }
    line += character;
    if (rect.height) lastTop = rect.top;
  }
  if (line || !lines.length) lines.push(line.trimEnd());
  return lines.join('\n');
}

async function populateSlide(pptx, pptSlide, spec, canvas) {
  const canvasStyle = getComputedStyle(canvas);
  const canvasRect = canvas.getBoundingClientRect();
  pptSlide.background = { color: colorToHex(canvasStyle.backgroundColor, brand.palette.paper.slice(1)) };

  for (const element of canvas.querySelectorAll(':scope > [data-export-kind="shape"]')) {
    const style = getComputedStyle(element);
    const fill = colorToHex(style.backgroundColor, 'FFFFFF');
    const lineColor = colorToHex(style.borderTopColor || style.borderColor, fill);
    const box = position(element, canvasRect);
    if (box.x < 0 || box.y < 0 || box.x + box.w > 7.5 || box.y + box.h > 13.2) continue;
    pptSlide.addShape(pptx.ShapeType.rect, {
      ...box,
      fill: { color: fill },
      line: { color: lineColor, transparency: style.borderTopWidth === '0px' ? 100 : 0, width: 0.5 },
    });
  }

  for (const element of canvas.querySelectorAll(':scope > [data-export-kind="text"]')) {
    const value = element.classList.contains('slot-title')
      ? renderedText(element)
      : (element.textContent || '');
    if (!value.trim()) continue;
    pptSlide.addText(value, textOptions(element, canvasRect));
  }

  for (const figure of canvas.querySelectorAll(':scope > [data-export-kind="image"]')) {
    const img = figure.querySelector('img');
    const box = position(figure, canvasRect);
    if (!img?.src) {
      pptSlide.addShape(pptx.ShapeType.rect, {
        ...box,
        fill: { color: brand.palette.inverse.slice(1) },
        line: { color: brand.palette.accent.slice(1), width: 1 },
      });
      pptSlide.addShape(pptx.ShapeType.rect, {
        x: box.x + box.w * 0.1,
        y: box.y + box.h * 0.12,
        w: box.w * 0.38,
        h: box.h * 0.36,
        rotate: 18,
        fill: { color: brand.palette.inverse.slice(1), transparency: 100 },
        line: { color: brand.palette.accent.slice(1), width: 1 },
      });
      pptSlide.addShape(pptx.ShapeType.rect, {
        x: box.x + box.w * 0.62,
        y: box.y + box.h * 0.12,
        w: box.w * 0.22,
        h: box.h * 0.64,
        rotate: -10,
        fill: { color: brand.palette.accent_dark.slice(1) },
        line: { color: brand.palette.accent.slice(1), width: 1 },
      });
      pptSlide.addShape(pptx.ShapeType.rect, {
        x: box.x + box.w * 0.46,
        y: box.y + box.h * 0.42,
        w: box.w * 0.16,
        h: box.w * 0.16,
        fill: { color: brand.palette.accent.slice(1) },
        line: { color: brand.palette.accent.slice(1), transparency: 100 },
      });
      pptSlide.addText('IMAGE SLOT', { ...box, color: brand.palette.inverse_text.slice(1), fontSize: 10, bold: true, margin: 0.12, valign: 'bottom' });
      continue;
    }
    const source = img.src.startsWith('data:') ? { data: img.src } : { path: img.src };
    pptSlide.addImage({
      ...source,
      x: box.x,
      y: box.y,
      altText: img.alt || '演示图片',
      sizing: { type: figure.dataset.imageFit === 'contain' ? 'contain' : 'cover', w: box.w, h: box.h },
    });
  }
  if (spec.speakerNotes?.trim()) pptSlide.addNotes(spec.speakerNotes.trim());
}

export async function buildPptx(deck, measureRoot) {
  renderDeck(measureRoot, deck, { all: true });
  await document.fonts.ready;
  await Promise.all([...measureRoot.querySelectorAll('img')].map((img) => img.decode?.().catch(() => {})));

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'LR_FIXED', width: 7.5, height: 13.2 });
  pptx.layout = 'LR_FIXED';
  pptx.author = 'LR Brand Studio';
  pptx.company = brand.brand.name;
  pptx.subject = '固定品牌内部演示';
  pptx.title = deck.title;
  pptx.lang = 'zh-CN';
  pptx.theme = {
    headFontFace: 'Microsoft YaHei',
    bodyFontFace: 'Microsoft YaHei',
    lang: 'zh-CN',
  };

  const canvases = [...measureRoot.querySelectorAll('.slide-canvas')];
  for (const [index, spec] of deck.slides.entries()) {
    const pptSlide = pptx.addSlide();
    await populateSlide(pptx, pptSlide, spec, canvases[index]);
  }
  const blob = await pptx.write({ outputType: 'blob', compression: true });
  measureRoot.replaceChildren();
  return {
    blob,
    validation: await validatePptx(
      blob,
      deck.slides.length,
      deck.slides.filter((slide) => slide.speakerNotes?.trim()).length,
    ),
  };
}

export async function validatePptx(blob, expectedSlides, expectedNotes = 0) {
  const errors = [];
  let zip;
  try {
    zip = await JSZip.loadAsync(blob);
  } catch (error) {
    return { pass: false, errors: [`PPTX 不是有效 ZIP：${error.message}`] };
  }
  for (const required of ['[Content_Types].xml', 'ppt/presentation.xml']) {
    if (!zip.file(required)) errors.push(`缺少 ${required}`);
  }
  const slides = Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name));
  if (slides.length !== expectedSlides) errors.push(`页面数量错误：期望 ${expectedSlides}，实际 ${slides.length}`);
  const presentation = await zip.file('ppt/presentation.xml')?.async('string');
  if (presentation && (!presentation.includes('cx="6858000"') || !presentation.includes('cy="12070080"'))) {
    errors.push('PPTX 画布尺寸不是 7.5 × 13.2 英寸');
  }
  const slideWidth = 6858000;
  const slideHeight = 12070080;
  let checkedObjectCount = 0;
  for (const name of slides) {
    const xml = await zip.file(name).async('string');
    if (!xml.includes('<p:sp') && !xml.includes('<p:pic')) errors.push(`${name} 没有可编辑内容`);
    const transforms = [...xml.matchAll(/<a:xfrm[^>]*>[\s\S]*?<a:off x="(-?\d+)" y="(-?\d+)"\s*\/>[\s\S]*?<a:ext cx="(\d+)" cy="(\d+)"\s*\/>[\s\S]*?<\/a:xfrm>/g)];
    checkedObjectCount += transforms.length;
    transforms.forEach((match, index) => {
      const [, xRaw, yRaw, widthRaw, heightRaw] = match;
      const [x, y, width, height] = [xRaw, yRaw, widthRaw, heightRaw].map(Number);
      if (x < 0 || y < 0 || x + width > slideWidth || y + height > slideHeight) {
        errors.push(`${name} 的第 ${index + 1} 个对象越出画布`);
      }
    });
  }
  if (!checkedObjectCount) errors.push('没有找到可验证的 PPTX 对象几何');
  const notes = Object.keys(zip.files).filter((name) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(name));
  if (notes.length !== expectedNotes) errors.push(`备注数量错误：期望 ${expectedNotes}，实际 ${notes.length}`);
  return { pass: errors.length === 0, slideCount: slides.length, noteCount: notes.length, checkedObjectCount, errors };
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
