const puppeteer = require('puppeteer');
const fs = require('fs-extra');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapePage(page, url) {
  console.log(`🌐 Ouverture ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await sleep(5000);

  try {
    await page.waitForSelector('div.product-tile', { timeout: 30000 });
  } catch {
    console.log("⚠️ Pas de produits visibles, on tente quand même...");
  }

  console.log("📜 Scroll auto...");
  await page.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let lastHeight = document.body.scrollHeight;
    for (let i = 0; i < 50; i++) {
      window.scrollTo(0, document.body.scrollHeight);
      await sleep(3000);
      const newHeight = document.body.scrollHeight;
      if (newHeight === lastHeight) break;
      lastHeight = newHeight;
    }
  });

  console.log("📦 Extraction...");
  const products = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('div.product-tile'));
    return items.map(item => {
      const name = item.querySelector('div.product-title')?.innerText?.trim();
      const price = item.querySelector('span.sales')?.innerText?.trim();
      const link = item.querySelector('a.thumb-link')?.href;
      const img = item.querySelector('img.tile-image')?.src;
      return { name, price, link, image: img, brand: 'Puma' };
    }).filter(p => p.name && p.price);
  });

  console.log(`✅ ${products.length} produits trouvés sur ${url}`);
  return products;
}

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36');
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });

  const urls = [
    'https://eu.puma.com/fr/fr/homme/chaussures',
    'https://eu.puma.com/fr/fr/femme/chaussures',
    'https://eu.puma.com/fr/fr/enfant/chaussures'
  ];

  let allProducts = [];
  for (const url of urls) {
    const products = await scrapePage(page, url);
    allProducts = allProducts.concat(products);
  }

  // Supprimer doublons
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [`${p.name}-${p.price}`, p])).values());

  console.log(`✅ Total produits uniques Puma : ${uniqueProducts.length}`);
  await fs.writeJson('products_puma.json', uniqueProducts, { spaces: 2 });

  await browser.close();
})();
