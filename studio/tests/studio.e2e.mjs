import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(projectRoot, 'output/pptx/sample-brand-deck.pptx');
const qaDirectory = resolve(projectRoot, 'output/qa');
mkdirSync(dirname(output), { recursive: true });
mkdirSync(qaDirectory, { recursive: true });
const server = await createServer({
  configFile: resolve(projectRoot, 'studio/vite.config.js'),
  server: { host: '127.0.0.1', port: 0 },
  logLevel: 'error',
});
await server.listen();
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch({ headless: true });
const consoleErrors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => window.__STUDIO__?.ready), true);
  assert.equal(await page.locator('#onboardingDialog').isVisible(), true);
  await page.screenshot({ path: resolve(qaDirectory, 'onboarding.png') });
  await page.locator('#generateOutlineButton').click();
  assert.equal(await page.locator('#outlineList li').count(), 5);
  await page.locator('#confirmOutlineButton').click();
  assert.equal(await page.locator('.proposal-card').count(), 3);

  for (const id of ['editorial-air', 'evidence-grid', 'image-rhythm']) {
    const validation = await page.evaluate(async (proposalId) => {
      window.__STUDIO__.selectProposal(proposalId);
      return window.__STUDIO__.validate();
    }, id);
    assert.equal(validation.pass, true, `${id}: ${JSON.stringify(validation.issues)}`);
  }

  await page.evaluate(() => window.__STUDIO__.selectProposal('editorial-air'));
  await page.screenshot({ path: resolve(qaDirectory, 'editor.png') });
  const titleInput = page.locator('#inspector [data-slot="title"]');
  const originalTitle = await titleInput.inputValue();
  await titleInput.fill('编辑后的固定品牌标题');
  await page.waitForTimeout(800);
  assert.equal((await page.evaluate(() => window.__STUDIO__.getDeck())).slides[0].slots.title.text, '编辑后的固定品牌标题');
  assert.ok(Number(await page.locator('#versionCount').textContent()) >= 2);
  await titleInput.fill(originalTitle);
  await page.waitForTimeout(800);

  await page.locator('#presentButton').click();
  assert.equal(await page.locator('#presenter').isVisible(), true);
  assert.notEqual((await page.locator('#presenterNote').textContent()).trim(), '');
  await page.locator('#timerButton').click();
  await page.waitForTimeout(1100);
  assert.notEqual(await page.locator('#presenterTime').textContent(), '00:00');
  await page.locator('#exitPresenter').click();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#pptxButton').click();
  const download = await downloadPromise;
  await download.saveAs(output);
  assert.match(download.suggestedFilename(), /\.pptx$/i);

  const fixedCanvas = await page.locator('#stage .slide-canvas').first().evaluate((canvas) => ({
    width: canvas.offsetWidth,
    height: canvas.offsetHeight,
  }));
  assert.deepEqual(fixedCanvas, { width: 750, height: 1320 });
  assert.deepEqual(consoleErrors, []);
  console.log(JSON.stringify({ pass: true, url, output, checks: ['content-intake', 'purpose-density', 'outline-confirmation', 'three-proposals', 'dom-validation', 'editing', 'versions', 'presenter-notes', 'timer', 'pptx-download'] }, null, 2));
} finally {
  await browser.close();
  await server.close();
}
