#!/usr/bin/env node
/** Rendered geometry validation for fixed-brand 750 × 1320 decks. */

import { mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { pathToFileURL } from 'url';
import { chromium } from 'playwright';

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

    const diagnostics = await page.evaluate((activeIndex) => {
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
    }, index);

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
