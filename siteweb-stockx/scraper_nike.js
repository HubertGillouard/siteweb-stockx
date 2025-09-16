const puppeteer = require('puppeteer'); // Puppeteer classique
const fs = require('fs-extra');

// fonction sleep pour pauses
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// scroll automatique pour charger tous les produits
async function autoScroll(page){
  let previousHeight;
  try {
    previousHeight = await page.evaluate('document.body.scrollHeight');
    while(true){
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await sleep(1500); // attendre chargement des produits
      let newHeight = await page.evaluate('document.body.scrollHeight');
      if(newHeight === previousHeight) break;
      previousHeight = newHeight;
    }
  } catch(e){
    console.log('Erreur pendant le scroll, mais on continue...', e.message);
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // voir le navigateur
    defaultViewport: null
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36');
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

  console.log('Ouverture de Nike.com...');
  await page.goto('https://www.nike.com/fr/w/mens-shoes-nik1zy7ok', { waitUntil: 'networkidle2', timeout: 60000 });

  // attendre que les produits apparaissent
  try {
    await page.waitForSelector('div.product-card', { timeout: 60000 });
  } catch(e) {
    console.log('Timeout: produits non chargés, on continue quand même...');
  }

  console.log('Scroll pour charger plus de produits...');
  await autoScroll(page);
  console.log('Scroll terminé. Attente que le DOM se stabilise...');
  await sleep(2000);

  console.log('Extraction des produits...');
  const products = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('div.product-card'));
    return items.map(item => {
      const nameEl = item.querySelector('div.product-card__title');
      const priceEl = item.querySelector('div.product-price');
      const linkEl = item.querySelector('a.product-card__link-overlay');
      const imgEl = item.querySelector('img.product-card__img');
      return {
        name: nameEl ? nameEl.innerText.trim() : null,
        price: priceEl ? priceEl.innerText.trim() : null,
        image: imgEl ? imgEl.src : null,
        link: linkEl ? linkEl.href : null
      };
    }).filter(p => p.name && p.price);
  });

  console.log(`Nombre de produits récupérés : ${products.length}`);

  // sauvegarder en JSON
  await fs.writeJson('products.json', products, { spaces: 2 });
  console.log('products.json créé !');

  await browser.close();
})();
