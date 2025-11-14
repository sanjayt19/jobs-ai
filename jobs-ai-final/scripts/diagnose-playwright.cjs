const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const out = [];
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    out.push({ type: 'console', text: msg.text() });
    console.log('CONSOLE>', msg.type(), msg.text());
  });
  page.on('pageerror', err => {
    out.push({ type: 'pageerror', text: err.message });
    console.error('PAGEERROR>', err && err.message);
  });
  page.on('requestfailed', req => {
    out.push({ type: 'requestfailed', url: req.url(), status: req.failure() && req.failure().errorText });
    console.error('REQFAILED>', req.url(), req.failure() && req.failure().errorText);
  });

  const urls = ['http://localhost:5173/', 'http://localhost:5173/login', 'http://localhost:5173/signup'];
  for (const u of urls) {
    console.log('-> NAV', u);
    try {
      const res = await page.goto(u, { waitUntil: 'networkidle', timeout: 30000 });
      console.log('RESP status', res && res.status());
      await page.waitForTimeout(5000);
      const html = await page.content();
      fs.writeFileSync(path.join(__dirname, '..', 'preview-screenshots', new URL(u).pathname.replace(/\//g,'') || 'root') + '.html', html);
      console.log('WROTE HTML snapshot for', u);
    } catch (e) {
      console.error('NAV ERROR', e && e.message);
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, '..', 'preview-screenshots', 'diagnostics.json'), JSON.stringify(out, null, 2));
  console.log('Diagnostics saved to preview-screenshots/diagnostics.json');
})();
