#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(process.argv[2] || resolve(projectRoot, 'output/pdf/sample-brand-deck.pdf'));
mkdirSync(dirname(output), { recursive: true });

const server = await createServer({
  configFile: resolve(projectRoot, 'studio/vite.config.js'),
  server: { host: '127.0.0.1', port: 0 },
  logLevel: 'error',
});
await server.listen();
const url = server.resolvedUrls?.local?.[0];
if (!url) throw new Error('Vite did not expose a local URL');

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  if (await page.locator('#onboardingDialog').evaluate((dialog) => dialog.open)) {
    await page.locator('#generateOutlineButton').click();
    await page.locator('#confirmOutlineButton').click();
  }
  if (await page.locator('#proposalDialog').evaluate((dialog) => dialog.open)) {
    await page.locator('.proposal-card').first().getByRole('button').click();
  }
  const validation = await page.evaluate(() => window.__STUDIO__.validate());
  if (!validation.pass) throw new Error(`Deck validation failed: ${JSON.stringify(validation.issues)}`);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: output, printBackground: true, preferCSSPageSize: true });
  console.log(JSON.stringify({ pass: true, output, pages: await page.locator('#printDeck .slide-canvas').count() }, null, 2));
} finally {
  await browser.close();
  await server.close();
}
