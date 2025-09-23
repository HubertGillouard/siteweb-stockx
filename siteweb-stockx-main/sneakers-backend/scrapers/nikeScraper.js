const puppeteerExtra = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth");
const UserAgents = require("user-agents");
puppeteerExtra.use(stealth());

const sleep = (ms)=> new Promise(r=>setTimeout(r, ms));
const parsePrice = (txt)=> {
  if (!txt) return null;
  const s = txt.replace(/\s/g,"").replace(",",".");
  const m = s.match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
};

async function scrapeNikeCategory(url, { limit = 24 } = {}) {
  const browser = await puppeteerExtra.launch({ headless: "new", args: ["--no-sandbox","--disable-setuid-sandbox"] });
  const ua = new UserAgents().toString();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(ua);
    await page.setExtraHTTPHeaders({ "Accept-Language":"fr-FR,fr;q=0.9,en;q=0.8" });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const selectors = [
      '[data-test="product-card"]',
      '.product-card',
      'li.product-grid__item',
      'div.product-grid__card'
    ];
    let cardSel = null;
    for (const s of selectors) { if (await page.$(s)) { cardSel = s; break; } }
    if (!cardSel) throw new Error("Cartes produit introuvables (Nike a peut-être changé le DOM).");

    const list = await page.$$eval(cardSel, (cards)=>{
      const take = (el, sels)=> { for (const s of sels){ const n=el.querySelector(s); if(n&&n.textContent) return n.textContent.trim(); } return null; };
      const takeAttr = (el, sels, attr)=> { for (const s of sels){ const n=el.querySelector(s); if(n&&n.getAttribute(attr)) return n.getAttribute(attr); if(n&&n[attr]) return n[attr]; } return null; };
      const abs = (src)=>{ try{return new URL(src, location.href).toString()}catch{ return src } };
      const nameS   = ['[data-test="product-card-title"]','.product-card__title','h3','a[aria-label]'];
      const priceS  = ['[data-test="product-price"]','.product-price','div[data-test="product-price"]'];
      const imgS    = ['img','.product-card__hero-image'];
      const linkS   = ['a[href*="/t/"]','a.product-card__link-overlay','a[href]'];
      return Array.from(cards).map(el=>{
        const name  = take(el, nameS);
        const price = take(el, priceS);
        let img     = takeAttr(el, imgS, 'src') || takeAttr(el, imgS, 'data-src') || null;
        if (img) img = abs(img);
        let href    = takeAttr(el, linkS, 'href');
        if (href && !/^https?:/.test(href)) href = abs(href);
        return { name, priceText: price, img, href };
      }).filter(x=>x.name && x.href);
    });

    const items = list.slice(0, limit);

    for (const it of items) {
      const p = await browser.newPage();
      try {
        await p.setUserAgent(ua);
        await p.setExtraHTTPHeaders({ "Accept-Language":"fr-FR,fr;q=0.9,en;q=0.8" });
        await p.goto(it.href, { waitUntil: "networkidle2", timeout: 60000 });

        const sizeSelCandidates = [
          'button[data-qa="size-variant"]',
          '[data-test="size-grid"] button',
          'button[aria-label*="EU"]',
          'button[aria-label*="FR"]',
          'div[role="radiogroup"] button'
        ];
        let sizes = null;
        for (const s of sizeSelCandidates) {
          if (await p.$(s)) {
            sizes = await p.$$eval(s, btns => btns.map(b=>{
              const t = (b.textContent || b.getAttribute('aria-label') || '').trim();
              return t;
            }));
            break;
          }
        }
        if (!sizes) sizes = [];
        it.sizes = sizes.map(t=>t.replace(/(EU|FR)\s*/i,'').trim()).filter(Boolean);

        if (!it.priceText) {
          const priceSel = ['[data-test="product-price"]','.product-price'];
          for (const s of priceSel) {
            const val = await p.$eval(s, el => el.textContent.trim()).catch(()=>null);
            if (val) { it.priceText = val; break; }
          }
        }
        await p.close();
        await sleep(150);
      } catch(e) {
        await p.close();
        it.sizes = it.sizes || [];
      }
    }

    return items.map(it=>({
      name: it.name,
      price: parsePrice(it.priceText) || 0,
      image: it.img || null,
      sizes: it.sizes && it.sizes.length ? Array.from(new Set(it.sizes)) : ["42","43","44"]
    }));
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeNikeCategory };
