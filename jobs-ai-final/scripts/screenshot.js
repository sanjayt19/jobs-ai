const { chromium } = require('playwright');
const fs = require('fs');
const fetch = global.fetch || require('node-fetch');

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
      // small wait for dynamic content
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
