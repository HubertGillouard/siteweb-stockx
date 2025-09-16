// manual_solve_and_save_cookies.js (corrigé)
const fs = require('fs-extra');
const puppeteer = require('puppeteer');

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36');
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

  console.log('Ouverture de la page StockX, résous le challenge manuellement si demandé.');
  try {
    await page.goto('https://stockx.com/sneakers', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch(e) {
    console.warn('Warning goto:', e.message);
  }

  console.log("Tu as 2 minutes pour résoudre le challenge manuellement dans la fenêtre ouverte...");
  await wait(120000); // 120s

  // optionnel : demande une confirmation visuelle dans la console
  console.log('Récupération des cookies...');

  try {
    const cookies = await page.cookies();
    await fs.writeJson('cookies.json', cookies, { spaces: 2 });
    console.log('Cookies sauvegardés dans cookies.json');
  } catch (err) {
    console.error('Erreur lors de la sauvegarde des cookies :', err.message);
  }

  // Sauvegarder localStorage (optionnel)
  try {
    const localStorageData = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
      }
      return data;
    });
    await fs.writeJson('localStorage.json', localStorageData, { spaces: 2 });
    console.log('localStorage sauvegardé dans localStorage.json');
  } catch (err) {
    console.warn('localStorage non sauvegardé :', err.message);
  }

  await browser.close();
  console.log('Terminé.');
})();
