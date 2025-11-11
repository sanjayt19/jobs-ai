const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle', timeout: 30000 });
    // Wait a moment for client JS to hydrate
    await page.waitForTimeout(1000);

    // Listen for a popup (the OAuth provider / Supabase redirect)
    const [popup] = await Promise.all([
      page.waitForEvent('popup', { timeout: 10000 }).catch(() => null),
      // Click the OAuth button
      page.click('button:has-text("Continue with Google")', { timeout: 5000 }).catch((e) => {
        console.error('Click failed', e && e.message);
      }),
    ]);

    if (popup) {
      console.log('Popup opened. URL:', popup.url());
    } else {
      // If no popup, check for navigation on the same page (some flows open in same tab)
      await page.waitForTimeout(1000);
      console.log('Current page URL after click:', page.url());
    }

    // dump cookies and localStorage keys to help debug
    const cookies = await context.cookies();
    console.log('Cookies:', cookies.map(c => ({ name: c.name, domain: c.domain })));
    const localStorage = await page.evaluate(() => {
      const out = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        out[k] = localStorage.getItem(k);
      }
      return out;
    });
    console.log('localStorage keys:', Object.keys(localStorage));

  } catch (err) {
    console.error('Error during OAuth test:', err && err.message);
  } finally {
    await browser.close();
  }
})();
