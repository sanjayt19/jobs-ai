import fs from 'fs';
import path from 'path';
import playwright from 'playwright';

const outDir = path.resolve(process.cwd(), 'preview-screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { url: '/', name: 'landing' },
  { url: '/login', name: 'login' },
  { url: '/signup', name: 'signup' },
  { url: '/rebrand-preview.html', name: 'preview' },
];

async function run() {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  for (const p of pages) {
    const url = `http://localhost:5173${p.url}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      console.error(`Failed to open ${url}:`, e.message);
      continue;
    }

    // small wait for animations
    await page.waitForTimeout(500);

    const out = path.join(outDir, `${p.name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log('Saved', out);
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
import { chromium } from 'playwright';
import fs from 'fs';
import fetch from 'node-fetch';

const base = process.env.BASE_URL || 'http://127.0.0.1:5173';
const outDir = 'preview-screenshots';
const pages = ['/', '/login', '/signup', '/rebrand-preview.html'];

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.status === 200) return true;
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('Timed out waiting for dev server at ' + url);
}

(async () => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Waiting for dev server...');
  await waitForServer(base);
  console.log('Server ready — launching browser');

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  for (const p of pages) {
    const url = base.replace(/\/$/, '') + (p.startsWith('/') ? p : '/' + p);
    console.log('Loading', url);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(500);
      const name = p === '/' ? 'landing' : p.replace(/\W+/g, '_').replace(/^_+|_+$/g, '') || 'page';
      const file = `${outDir}/${name}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log('Saved', file);
    } catch (err) {
      console.error('Failed to capture', url, err.message);
    }
  }

  await browser.close();
  console.log('Done');
})();
