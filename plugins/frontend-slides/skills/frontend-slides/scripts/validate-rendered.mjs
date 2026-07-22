#!/usr/bin/env node
/** Rendered geometry validation for fixed-brand 750 × 1320 decks. */

import { mkdirSync, readFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { chromium } from 'playwright';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const brandSource = JSON.parse(readFileSync(resolve(repoRoot, 'brand/source.json'), 'utf8'));
const typographyContract = {
  lineHeightPercent: brandSource.typography.line_height_percent,
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

if (!inputArg) {
  console.error('Usage: node scripts/validate-rendered.mjs <deck.html> [--screenshots <directory>]');
  process.exit(2);
}

const input = resolve(inputArg);
if (screenshotFlag >= 0 && !args[screenshotFlag + 1]) {
  console.error('ERROR: --screenshots requires a directory');
  process.exit(2);
}
if (screenshotDir) mkdirSync(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 750, height: 1320 }, deviceScaleFactor: 1 });
const errors = [];

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

  for (let index = 0; index < slideCount; index += 1) {
    await page.evaluate((activeIndex) => {
      document.querySelectorAll('.slide').forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === activeIndex);
        slide.classList.toggle('visible', slideIndex === activeIndex);
        slide.style.visibility = slideIndex === activeIndex ? 'visible' : 'hidden';
        slide.style.opacity = slideIndex === activeIndex ? '1' : '0';
      });
    }, index);
    await page.waitForTimeout(80);

    const diagnostics = await page.evaluate(({ activeIndex, typographyContract, safeAreaContract }) => {
      const slide = document.querySelectorAll('.slide')[activeIndex];
      if (!slide) return [{ kind: 'structure', message: 'Active slide missing' }];
      const issues = [];
      const slideRect = slide.getBoundingClientRect();
      const close = (left, right) => Math.abs(left - right) <= 1;
      if (!close(slideRect.width, 750) || !close(slideRect.height, 1320)) {
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
        const allowedSizes = new Set(Object.values(localeRule.sizes_px).map(Number));
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
            message: `${label} falls outside x=${safeAreaContract.left}–${750 - safeAreaContract.right}, y=${safeAreaContract.top}–${1320 - safeAreaContract.bottom}`,
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
          const expectedLineHeight = fontSize * typographyContract.lineHeightPercent / 100;
          const actualLineHeight = Number.parseFloat(style.lineHeight);
          if (!closeTypography(actualLineHeight, expectedLineHeight)) {
            issues.push({
              kind: 'line-height',
              message: `${label} resolves to ${style.lineHeight}; expected ${expectedLineHeight}px`,
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
    }, { activeIndex: index, typographyContract, safeAreaContract });

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
console.log(JSON.stringify({ pass: true, canvas: { width: 750, height: 1320 } }, null, 2));
