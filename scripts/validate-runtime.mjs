#!/usr/bin/env node
/** Browser-level interaction validation for the canonical fixed-brand runtime. */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { chromium } from 'playwright';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = resolve(process.argv[2] || 'tests/fixtures/minimal-deck.html');
const runtime = resolve(repoRoot, 'brand/generated/brand-runtime.js');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 750, height: 1320 }, acceptDownloads: true });
const errors = [];

const check = (condition, message) => {
  if (!condition) errors.push(message);
};

page.on('pageerror', (error) => errors.push(`page error: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console error: ${message.text()}`);
});

try {
  await page.goto(pathToFileURL(input).href, { waitUntil: 'load' });
  if (!await page.evaluate(() => window.FRONTEND_SLIDES_BRAND?.runtime === 'brand-runtime-v2')) {
    await page.addScriptTag({ path: runtime });
  }
  await page.waitForFunction(() => window.presentation?.slides?.length > 0);

  const initial = await page.evaluate(() => ({
    index: window.presentation.index,
    total: window.presentation.slides.length,
    counter: document.querySelector('.deck-controls__counter')?.textContent,
    transform: document.getElementById('deckStage')?.style.transform,
    canvas: window.FRONTEND_SLIDES_BRAND?.canvas,
    runtime: window.FRONTEND_SLIDES_BRAND?.runtime,
    slideCount: document.querySelectorAll('.slide').length,
    deckId: window.presentation.deckId,
    requestedFilename: document.body.dataset.exportFilename,
    locked: document.body.dataset.deckLocked === 'true',
    editableCount: document.querySelectorAll('[data-editable="text"][data-edit-id]').length,
    activeHeight: Number.parseInt(document.getElementById('deckStage')?.style.height || '', 10),
    firstKind: document.querySelector('.slide')?.dataset.slideKind,
    firstDeclaredHeight: Number.parseInt(document.querySelector('.slide')?.dataset.slideHeight || '', 10),
  }));
  check(initial.index === 0, 'runtime must start on the first slide');
  check(initial.total === initial.slideCount, 'runtime must discover every slide');
  check(initial.counter === `1 / ${initial.slideCount}`, 'page counter must start at 1 / total');
  check(initial.transform?.includes('scale(1)'), '750 × 1320 KV stage must fit at scale(1)');
  check(initial.activeHeight === initial.firstDeclaredHeight, 'stage height must match the active slide height');
  check(initial.firstKind !== 'kv' || initial.firstDeclaredHeight === 1320, 'KV slide height must be 1320');
  check(
    initial.canvas?.width === 750
      && initial.canvas?.kvHeight === 1320
      && initial.canvas?.nonKvHeight === 'content',
    'runtime canvas contract must use fixed width, fixed KV height, and content-driven non-KV height',
  );
  check(initial.runtime === 'brand-runtime-v2', 'canonical runtime version marker is missing');

  await page.keyboard.press('ArrowRight');
  const expectedNextIndex = initial.slideCount > 1 ? 1 : 0;
  check(await page.evaluate(() => window.presentation.index) === expectedNextIndex, 'ArrowRight must advance or clamp at the final slide');
  if (initial.slideCount > 1) {
    const second = await page.evaluate(() => {
      const slide = document.querySelectorAll('.slide')[1];
      return {
        declaredHeight: Number.parseInt(slide.dataset.slideHeight || '', 10),
        stageHeight: Number.parseInt(document.getElementById('deckStage')?.style.height || '', 10),
        transform: document.getElementById('deckStage')?.style.transform,
      };
    });
    check(second.stageHeight === second.declaredHeight, 'navigation must resize the stage to the active slide');
    check(Boolean(second.transform?.includes('scale(')), 'navigation must refit the active slide');
  }
  await page.keyboard.press('Home');
  check(await page.evaluate(() => window.presentation.index === 0), 'Home must return to the first slide');
  if (initial.slideCount > 1) {
    await page.keyboard.press('2');
    check(await page.evaluate(() => window.presentation.index === 1), 'number keys must navigate to matching slides');
  }
  await page.keyboard.press('KeyR');
  check(await page.evaluate(() => window.presentation.index) === expectedNextIndex, 'reset must preserve the active slide');

  if (initial.slideCount > 1) {
    await page.evaluate(() => window.presentation.goTo(0));
    await page.mouse.click(700, 660);
    check(await page.evaluate(() => window.presentation.index === 1), 'right-third click must advance one slide');
  }

  const touchWorked = initial.slideCount > 1 ? await page.evaluate(() => {
    const stage = document.getElementById('deckStage');
    if (typeof Touch !== 'function' || typeof TouchEvent !== 'function') return null;
    window.presentation.goTo(0);
    const start = new Touch({ identifier: 1, target: stage, clientX: 650, clientY: 660 });
    const end = new Touch({ identifier: 1, target: stage, clientX: 120, clientY: 660 });
    stage.dispatchEvent(new TouchEvent('touchstart', { touches: [start], bubbles: true }));
    stage.dispatchEvent(new TouchEvent('touchend', { changedTouches: [end], bubbles: true, cancelable: true }));
    return window.presentation.index === 1;
  }) : null;
  check(touchWorked !== false, 'left swipe must advance one slide');

  check(initial.locked || initial.editableCount > 0, 'unlocked decks must declare at least one editable text layer');
  let testEditId = null;
  let testEditText = null;
  if (initial.editableCount > 0) {
    const editable = page.locator('[data-editable="text"][data-edit-id]').first();
    testEditId = await editable.getAttribute('data-edit-id');
    testEditText = `运行时编辑验证-${Date.now()}`;
    await page.evaluate(() => window.presentation.toggleEdit(true));
    check(await editable.getAttribute('contenteditable') === 'true', 'edit mode must enable declared text layers');
    await editable.evaluate((element, replacement) => {
      element.textContent = replacement;
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: replacement }));
    }, testEditText);
    await page.waitForTimeout(400);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem(window.presentation.storageKey) || 'null'));
    check(saved?.edits?.[testEditId] === testEditText, 'text edits must autosave under the deck-scoped key');
    await page.evaluate(() => window.presentation.toggleEdit(false));
    check(await editable.getAttribute('contenteditable') === 'false', 'leaving edit mode must disable text editing');
  }

  const downloadPromise = page.waitForEvent('download');
  await page.evaluate(() => window.presentation.saveFile());
  const download = await downloadPromise;
  const expectedFilename = (initial.requestedFilename || `${initial.deckId}.html`).replace(/[\\/:*?"<>|]+/g, '-');
  check(download.suggestedFilename() === expectedFilename, 'save-to-file must honor the requested filename');
  const downloadedPath = await download.path();
  const downloaded = downloadedPath ? readFileSync(downloadedPath, 'utf8') : '';
  if (testEditText) check(downloaded.includes(testEditText), 'saved HTML must contain the edited text');
  const savedEditableTag = testEditId
    ? downloaded.match(new RegExp(`<[^>]+data-edit-id="${testEditId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`))?.[0] || ''
    : '';
  check(!savedEditableTag.includes('contenteditable='), 'saved HTML must not preserve active editing state');

  const printResult = await page.evaluate(() => {
    let called = false;
    window.print = () => { called = true; };
    window.presentation.print();
    return {
      called,
      pageSizes: document.getElementById('brand-print-page-sizes')?.textContent || '',
    };
  });
  check(printResult.called, 'print API must call window.print');
  check(printResult.pageSizes.includes('750px 1320px'), 'print CSS must preserve the KV page height');
  if (initial.slideCount > 1) {
    const secondHeight = await page.locator('.slide').nth(1).getAttribute('data-slide-height');
    check(printResult.pageSizes.includes(`750px ${secondHeight}px`), 'print CSS must preserve non-KV page heights');
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
  runtime: 'brand-runtime-v2',
  capabilities: ['navigation', 'touch', 'counter', 'editing', 'autosave', 'save-html', 'print'],
}, null, 2));
