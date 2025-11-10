const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function run() {
  const outDir = path.resolve(__dirname, '..', 'preview-screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const urls = [
    { name: 'landing', url: 'http://localhost:5173/' },
    { name: 'login', url: 'http://localhost:5173/login' },
    { name: 'signup', url: 'http://localhost:5173/signup' },
    { name: 'preview', url: 'http://localhost:5173/rebrand-preview.html' },
  ];

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  for (const target of urls) {
    try {
      console.log('Navigating to', target.url);
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 30000 });
      // give some extra time for fonts/styles
      await page.waitForTimeout(500);
      const file = path.join(outDir, `${target.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log('Saved', file);
    } catch (err) {
      console.error('Failed capturing', target.url, err.message);
    }
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
