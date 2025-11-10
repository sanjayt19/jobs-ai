const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async function run(){
  const outDir = path.resolve(__dirname, '..', 'preview-screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const targets = [
    { name: 'landing', url: 'http://localhost:5173/', waitFor: 'h1, header, main' },
    { name: 'login', url: 'http://localhost:5173/login', waitFor: 'form, input[type=email], input[type=password]' },
    { name: 'signup', url: 'http://localhost:5173/signup', waitFor: 'form, input[type=email], input[type=password]' },
    { name: 'preview', url: 'http://localhost:5173/rebrand-preview.html', waitFor: 'body' },
  ];

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  for (const target of targets) {
    try {
      console.log('Navigating to', target.url);
      const resp = await page.goto(target.url, { waitUntil: 'networkidle', timeout: 30000 });
      if (!resp || !resp.ok()) {
        console.warn('Warning: HTTP response not OK for', target.url, resp && resp.status());
      }
      // Wait for a meaningful element to appear before screenshot
      if (target.waitFor) {
        try {
          await page.waitForSelector(target.waitFor, { timeout: 10000, state: 'visible' });
        } catch (e) {
          console.warn('Selector did not appear in time for', target.url, target.waitFor);
        }
      }
      // extra small delay for fonts/styles
      await page.waitForTimeout(700);
      const file = path.join(outDir, `${target.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log('Saved', file);
    } catch (err) {
      console.error('Failed capturing', target.url, err && err.message);
    }
  }

  await browser.close();
})();
