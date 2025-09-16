// use_cookies_and_test.js
const fs = require('fs-extra');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36');
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

  // Charger cookies si existants
  try {
    if (await fs.pathExists('cookies.json')) {
      const cookies = await fs.readJson('cookies.json');
      if (cookies && cookies.length) {
        await page.setCookie(...cookies);
        console.log('Cookies injectés.');
      }
    } else {
      console.log('cookies.json introuvable — exécute d’abord manual_solve_and_save_cookies.js');
    }
  } catch (err) {
    console.warn('Erreur injection cookies:', err.message);
  }

  // aller sur la page protégée
  try {
    await page.goto('https://stockx.com/sneakers', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Page ouverte — vérifie visuellement si les produits s’affichent.');
    // laisse la fenêtre visible quelques dizaines de secondes pour inspection
    await new Promise(r => setTimeout(r, 30000));
  } catch (e) {
    console.warn('Erreur goto:', e.message);
    await page.screenshot({ path: 'debug_after_cookies.png', fullPage: true });
    console.log('Screenshot saved: debug_after_cookies.png');
  }

  await browser.close();
})();
