const puppeteer = require('puppeteer');
const fs = require('fs-extra');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Scroll automatique pour charger tous les produits
async function autoScroll(page) {
  let previousHeight = 0;
  let retries = 0;

  while (retries < 3) {
    try {
      const newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === previousHeight) {
        retries++;
      } else {
        retries = 0;
        previousHeight = newHeight;
      }

      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await sleep(2000); // attendre le lazy-load
    } catch (e) {
      console.log('⚠️ Erreur pendant le scroll Nike :', e.message);
      break;
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36'
  );
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });

  // ⚡ Parcourir plusieurs catégories si nécessaire
  const categories = [
    { name: 'hommes', url: 'https://www.nike.com/fr/w/mens-shoes-nik1zy7ok' },
    { name: 'femmes', url: 'https://www.nike.com/fr/w/womens-shoes-5e1x6zy7ok' },
    { name: 'enfants', url: 'https://www.nike.com/fr/w/kids-shoes-1onrzy7ok' }
  ];

  let allProducts = [];

  for (const cat of categories) {
    console.log(`🌐 Ouverture Nike ${cat.name}...`);
    await page.goto(cat.url, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(2000);

    console.log('📜 Scroll auto...');
    await autoScroll(page);
    await sleep(3000); // laisser le DOM se stabiliser

    console.log('📦 Extraction...');
    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div.product-card'));
      return items
        .map(item => {
          const nameEl = item.querySelector('div.product-card__title');
          const priceEl = item.querySelector('div.product-price');
          const linkEl = item.querySelector('a.product-card__link-overlay');
          const imgEl = item.querySelector('img.product-card__img');
          return {
            name: nameEl ? nameEl.innerText.trim() : null,
            price: priceEl ? priceEl.innerText.trim() : '0€',
            image: imgEl ? imgEl.src : null,
            link: linkEl ? linkEl.href : null,
            brand: 'Nike'
          };
        })
        .filter(p => p.name); // ne filtrer que sur le nom
    });

    console.log(`✅ ${products.length} produits récupérés pour ${cat.name}`);
    allProducts = allProducts.concat(products);
  }

  // Supprimer les doublons par nom + lien
  const uniqueProducts = [];
  const seen = new Set();
  allProducts.forEach(p => {
    const key = p.name + p.link;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueProducts.push(p);
    }
  });

  console.log(`📊 Total produits uniques Nike : ${uniqueProducts.length}`);

  await fs.writeJson('products_nike.json', uniqueProducts, { spaces: 2 });
  console.log('✅ products_nike.json créé !');

  await browser.close();
})();
