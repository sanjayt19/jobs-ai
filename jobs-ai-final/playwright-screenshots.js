const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.join(__dirname, 'preview-screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const base = process.env.PREVIEW_BASE || 'http://127.0.0.1:5173';
  const pages = [
    { url: '/', name: 'landing.png' },
    { url: '/login', name: 'login.png' },
    { url: '/signup', name: 'signup.png' },
    { url: '/rebrand-preview.html', name: 'rebrand-preview.png' },
  ];

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  for (const p of pages) {
    const url = base + p.url;
    console.log('Navigating to', url);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      // Slight wait for any client rendering
      await page.waitForTimeout(600);
      const outPath = path.join(outDir, p.name);
      await page.screenshot({ path: outPath, fullPage: true });
      console.log('Saved', outPath);
    } catch (err) {
      console.error('Failed to capture', url, err.message);
    }
  }

  await browser.close();
  console.log('Screenshots complete. Files are in', outDir);
})();
