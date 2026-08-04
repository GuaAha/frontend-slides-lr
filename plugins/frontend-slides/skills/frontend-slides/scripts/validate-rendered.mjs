#!/usr/bin/env node
/** Rendered geometry validation for 750px-wide decks with per-slide heights. */

import { mkdirSync, readFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { chromium } from 'playwright';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const brandSource = JSON.parse(readFileSync(resolve(repoRoot, 'brand/source.json'), 'utf8'));
const typographyContract = {
  lineHeightPercent: brandSource.typography.line_height_percent,
  annotationTextLineHeightPercent: brandSource.typography.annotation_line_height_percent,
  largeEvidenceSecondaryPx: brandSource.typography.large_evidence_secondary_px,
  localeRules: brandSource.typography.locale_rules,
};
const safeAreaContract = {
  top: brandSource.spacing.safe_top_px,
  right: brandSource.spacing.slide_padding_px,
  bottom: brandSource.spacing.safe_bottom_px,
  left: brandSource.spacing.slide_padding_px,
};

const args = process.argv.slice(2);
const inputArg = args.find((arg) => !arg.startsWith('--'));
const screenshotFlag = args.indexOf('--screenshots');
const screenshotDir = screenshotFlag >= 0 ? resolve(args[screenshotFlag + 1] || '') : null;
const slideFlag = args.indexOf('--slide');
const requestedSlide = slideFlag >= 0 ? Number.parseInt(args[slideFlag + 1] || '', 10) : null;

if (!inputArg) {
  console.error('Usage: node scripts/validate-rendered.mjs <deck.html> [--slide <number>] [--screenshots <directory>]');
  process.exit(2);
}

const input = resolve(inputArg);
if (screenshotFlag >= 0 && !args[screenshotFlag + 1]) {
  console.error('ERROR: --screenshots requires a directory');
  process.exit(2);
}
if (screenshotDir) mkdirSync(screenshotDir, { recursive: true });
if (slideFlag >= 0 && (!Number.isInteger(requestedSlide) || requestedSlide < 1)) {
  console.error('ERROR: --slide requires a positive slide number');
  process.exit(2);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 750, height: 1320 }, deviceScaleFactor: 1 });
const errors = [];
let validatedSlides = [];

page.on('console', (message) => {
  if (message.type() === 'error') errors.push({ slide: null, kind: 'console', message: message.text() });
});
page.on('pageerror', (error) => errors.push({ slide: null, kind: 'page', message: error.message }));
page.on('requestfailed', (request) => errors.push({
  slide: null,
  kind: 'asset',
  message: `${request.url()} — ${request.failure()?.errorText || 'request failed'}`,
}));

try {
  await page.goto(pathToFileURL(input).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const slideCount = await page.locator('.slide').count();
  if (!slideCount) errors.push({ slide: null, kind: 'structure', message: 'No .slide elements found' });
  if (requestedSlide && requestedSlide > slideCount) {
    errors.push({ slide: requestedSlide, kind: 'structure', message: `Slide ${requestedSlide} does not exist` });
  }
  const selectedIndexes = requestedSlide ? [requestedSlide - 1] : Array.from({ length: slideCount }, (_, index) => index);
  validatedSlides = selectedIndexes.filter((index) => index >= 0 && index < slideCount).map((index) => index + 1);
  const slideContracts = await page.locator('.slide').evaluateAll((slides) => slides.map((slide) => ({
    kind: slide.getAttribute('data-slide-kind'),
    height: Number.parseInt(slide.getAttribute('data-slide-height') || '', 10),
  })));

  for (const index of selectedIndexes) {
    if (index < 0 || index >= slideCount) continue;
    const contract = slideContracts[index];
    if (!['kv', 'content'].includes(contract.kind)) {
      errors.push({ slide: index + 1, kind: 'canvas', message: 'data-slide-kind must be kv or content' });
    }
    if (!Number.isInteger(contract.height) || contract.height <= 0) {
      errors.push({ slide: index + 1, kind: 'canvas', message: 'data-slide-height must be a positive integer' });
    }
    if (contract.kind === 'kv' && contract.height !== brandSource.canvas.kv_height) {
      errors.push({ slide: index + 1, kind: 'canvas', message: 'KV slide height must be 1320px' });
    }
    const expectedHeight = Number.isInteger(contract.height) && contract.height > 0
      ? contract.height
      : brandSource.canvas.kv_height;
    await page.setViewportSize({ width: brandSource.canvas.width, height: expectedHeight });
    await page.evaluate(({ activeIndex, expectedHeight }) => {
      if (window.presentation?.show) {
        window.presentation.show(activeIndex, { updateHash: false });
        return;
      }
      const stage = document.querySelector('.deck-stage');
      if (stage) {
        stage.style.setProperty('--active-slide-height', `${expectedHeight}px`);
        stage.style.height = `${expectedHeight}px`;
      }
      document.querySelectorAll('.slide').forEach((slide, slideIndex) => {
        const declaredHeight = Number.parseInt(slide.getAttribute('data-slide-height') || '', 10);
        if (Number.isInteger(declaredHeight) && declaredHeight > 0) {
          slide.style.setProperty('--slide-height', `${declaredHeight}px`);
          slide.style.height = `${declaredHeight}px`;
        }
        slide.classList.toggle('active', slideIndex === activeIndex);
        slide.classList.toggle('visible', slideIndex === activeIndex);
        slide.style.visibility = slideIndex === activeIndex ? 'visible' : 'hidden';
        slide.style.opacity = slideIndex === activeIndex ? '1' : '0';
      });
    }, { activeIndex: index, expectedHeight });
    await page.waitForTimeout(80);

    const diagnostics = await page.evaluate(({ activeIndex, expectedHeight, typographyContract, safeAreaContract }) => {
      const slide = document.querySelectorAll('.slide')[activeIndex];
      if (!slide) return [{ kind: 'structure', message: 'Active slide missing' }];
      const issues = [];
      const slideRect = slide.getBoundingClientRect();
      const close = (left, right) => Math.abs(left - right) <= 1;
      if (!close(slideRect.width, 750) || !close(slideRect.height, expectedHeight)) {
        issues.push({ kind: 'canvas', message: `Slide is ${slideRect.width} × ${slideRect.height}` });
      }

      const elements = Array.from(slide.querySelectorAll('*')).filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0;
      });

      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const classLabel = typeof element.className === 'string' ? element.className.trim().replace(/\s+/g, '.') : '';
        const label = element.id
          ? `#${element.id}`
          : classLabel
            ? `${element.tagName.toLowerCase()}.${classLabel}`
            : element.tagName.toLowerCase();
        if (!element.hasAttribute('data-allow-bleed')) {
          const out = rect.left < slideRect.left - 1
            || rect.top < slideRect.top - 1
            || rect.right > slideRect.right + 1
            || rect.bottom > slideRect.bottom + 1;
          if (out) issues.push({ kind: 'bounds', message: `${label} extends outside the slide` });
        }
        // Default visible text overflow includes normal glyph ascenders and
        // descenders. Report only when a box clips or scrolls material content.
        const clipsX = !['visible', 'clip'].includes(style.overflowX);
        const clipsY = !['visible', 'clip'].includes(style.overflowY);
        if ((clipsX && element.scrollWidth > element.clientWidth + 4)
          || (clipsY && element.scrollHeight > element.clientHeight + 4)) {
          issues.push({ kind: 'overflow', message: `${label} has clipped or scrolling content` });
        }
        // Computed radii detect runtime-authored masks without inspecting the
        // geometry contained inside raster/vector image assets.
        const radiusValues = [
          style.borderTopLeftRadius,
          style.borderTopRightRadius,
          style.borderBottomRightRadius,
          style.borderBottomLeftRadius,
        ];
        const hasNonzeroRadius = radiusValues.some((value) => {
          const numbers = value.match(/-?\d*\.?\d+/g) || [];
          return numbers.some((number) => Math.abs(Number(number)) > 0.001);
        });
        if (hasNonzeroRadius) {
          issues.push({
            kind: 'radius',
            message: `${label} has non-zero authored border radius (${radiusValues.join(', ')})`,
          });
        }
      }

      const textElements = elements.filter((element) => {
        if (element.hasAttribute('data-allow-overlap')) return false;
        const ownText = Array.from(element.childNodes).some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
        );
        const rect = element.getBoundingClientRect();
        return ownText && rect.width > 0 && rect.height > 0;
      });

      const localeFor = (element) => {
        const declared = element.closest('[lang]')?.getAttribute('lang')
          || document.documentElement.getAttribute('lang')
          || 'zh';
        const locale = declared.toLowerCase().split('-')[0];
        return typographyContract.localeRules[locale] ? locale : 'zh';
      };
      const closeTypography = (left, right) => Math.abs(left - right) <= 0.15;
      for (const element of textElements) {
        if (!element.closest('[data-copy-id]')) continue;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const locale = localeFor(element);
        const localeRule = typographyContract.localeRules[locale];
        const fontSize = Number.parseFloat(style.fontSize);
        const isLargeEvidence = element.matches('.metric') || Boolean(element.closest('.metric'));
        const allowedSizes = new Set(Object.values(localeRule.sizes_px).map(Number));
        if (isLargeEvidence) allowedSizes.add(Number(typographyContract.largeEvidenceSecondaryPx));
        const isCitationMarker = element.matches('[data-citation-marker]')
          || Boolean(element.closest('[data-citation-marker]'));
        const isAnnotationText = !isCitationMarker && (element.matches('[data-annotation-text]')
          || Boolean(element.closest('[data-annotation-text]')));
        const label = element.closest('[data-copy-id]')?.getAttribute('data-copy-id')
          || element.tagName.toLowerCase();

        const safeLeft = slideRect.left + safeAreaContract.left;
        const safeRight = slideRect.right - safeAreaContract.right;
        const safeTop = slideRect.top + safeAreaContract.top;
        const safeBottom = slideRect.bottom - safeAreaContract.bottom;
        if (rect.left < safeLeft - 1 || rect.right > safeRight + 1
          || rect.top < safeTop - 1 || rect.bottom > safeBottom + 1) {
          issues.push({
            kind: 'safe-area',
            message: `${label} falls outside x=${safeAreaContract.left}–${750 - safeAreaContract.right}, y=${safeAreaContract.top}–${expectedHeight - safeAreaContract.bottom}`,
          });
        }

        if (![...allowedSizes].some((size) => closeTypography(fontSize, size))) {
          issues.push({
            kind: 'type-size',
            message: `${label} uses ${style.fontSize}; allowed ${locale} sizes are ${[...allowedSizes].join(', ')}px`,
          });
        }

        if (style.lineHeight === 'normal') {
          issues.push({ kind: 'line-height', message: `${label} uses browser-normal line height` });
        } else {
          const expectedLineHeight = isAnnotationText
            ? fontSize * typographyContract.annotationTextLineHeightPercent / 100
            : fontSize * typographyContract.lineHeightPercent / 100;
          const actualLineHeight = Number.parseFloat(style.lineHeight);
          if (!closeTypography(actualLineHeight, expectedLineHeight)) {
            issues.push({
              kind: 'line-height',
              message: `${label} resolves to ${style.lineHeight}; expected ${expectedLineHeight}px${isAnnotationText ? ' (annotation text)' : ''}`,
            });
          }
        }

        const expectedLetterSpacing = fontSize * localeRule.letter_spacing_percent / 100;
        const actualLetterSpacing = style.letterSpacing === 'normal'
          ? 0
          : Number.parseFloat(style.letterSpacing);
        if (!closeTypography(actualLetterSpacing, expectedLetterSpacing)) {
          issues.push({
            kind: 'letter-spacing',
            message: `${label} resolves to ${style.letterSpacing}; expected ${expectedLetterSpacing}px for ${locale}`,
          });
        }

        const lineText = new Map();
        Array.from(element.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .forEach((node) => {
            for (let offset = 0; offset < node.textContent.length; offset += 1) {
              const character = node.textContent[offset];
              if (/\s/u.test(character)) continue;
              const range = document.createRange();
              range.setStart(node, offset);
              range.setEnd(node, offset + 1);
              const characterRect = range.getBoundingClientRect();
              if (!characterRect.width && !characterRect.height) continue;
              const lineKey = Math.round(characterRect.top * 2) / 2;
              lineText.set(lineKey, `${lineText.get(lineKey) || ''}${character}`);
            }
          });
        for (const visibleLine of lineText.values()) {
          if (/^\p{Script=Han}(?:\p{P})?$/u.test(visibleLine)) {
            issues.push({
              kind: 'orphan-line',
              message: `${label} has a visible line containing only one Han character${visibleLine.length > 1 ? ' plus punctuation' : ''}`,
            });
          }
        }
      }

      for (const marker of slide.querySelectorAll('[data-citation-marker]')) {
        const siblings = marker.parentElement ? Array.from(marker.parentElement.childNodes) : [];
        const markerIndex = siblings.indexOf(marker);
        const previousText = siblings.slice(0, markerIndex).map((node) => node.textContent || '').join('').trim();
        const nextText = siblings.slice(markerIndex + 1).map((node) => node.textContent || '').join('').trim();
        if (!previousText && !nextText) {
          issues.push({
            kind: 'citation-line',
            message: 'citation marker digits must follow corresponding copy at the upper-right and may not form a line by themselves',
          });
        }
      }

      const evidenceMetrics = Array.from(slide.querySelectorAll('.metric[data-copy-id]'));
      if (evidenceMetrics.length >= 2) {
        const preferredMetricSize = evidenceMetrics.length === 2 ? 75 : typographyContract.largeEvidenceSecondaryPx;
        const metricSizes = evidenceMetrics.map((metric) => Number.parseFloat(getComputedStyle(metric).fontSize));
        if (metricSizes.some((size) => Math.abs(size - preferredMetricSize) > 0.15)) {
          issues.push({
            kind: 'large-evidence-size',
            message: `${evidenceMetrics.length} large-evidence groups must use one unified ${preferredMetricSize}px size; found ${metricSizes.join(', ')}px`,
          });
        }
      }

      for (let leftIndex = 0; leftIndex < textElements.length; leftIndex += 1) {
        const left = textElements[leftIndex];
        const leftRect = left.getBoundingClientRect();
        for (let rightIndex = leftIndex + 1; rightIndex < textElements.length; rightIndex += 1) {
          const right = textElements[rightIndex];
          if (left.contains(right) || right.contains(left)) continue;
          const rightRect = right.getBoundingClientRect();
          const overlapWidth = Math.min(leftRect.right, rightRect.right) - Math.max(leftRect.left, rightRect.left);
          const overlapHeight = Math.min(leftRect.bottom, rightRect.bottom) - Math.max(leftRect.top, rightRect.top);
          if (overlapWidth > 2 && overlapHeight > 2) {
            issues.push({
              kind: 'overlap',
              message: `${left.tagName.toLowerCase()} overlaps ${right.tagName.toLowerCase()}`,
            });
          }
        }
      }
      return issues;
    }, { activeIndex: index, expectedHeight, typographyContract, safeAreaContract });

    diagnostics.forEach((issue) => errors.push({ slide: index + 1, ...issue }));
    if (screenshotDir) {
      await page.screenshot({ path: join(screenshotDir, `slide-${String(index + 1).padStart(3, '0')}.png`) });
    }
  }
} finally {
  await browser.close();
}

if (errors.length) {
  console.error(JSON.stringify({ pass: false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  pass: true,
  canvas: { width: 750, kvHeight: 1320, nonKvHeight: 'content' },
  slides: validatedSlides,
}, null, 2));
