// scrapers/selectorScraper.js
const axios = require("axios");
const cheerio = require("cheerio");
const UserAgents = require("user-agents");
const puppeteerExtra = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth");
puppeteerExtra.use(stealth());

// prix "129,99 €" -> 129.99
function parsePrice(txt) {
  if (!txt) return null;
  const s = txt.replace(/\s/g, "").replace(",", ".");
  const m = s.match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}
function absoluteUrl(src, base) {
  try { return new URL(src, base).toString(); } catch { return src; }
}

async function fetchHTML(url, usePuppeteer = false) {
  if (!usePuppeteer) {
    const ua = new UserAgents().toString();
    const res = await axios.get(url, {
      headers: { "User-Agent": ua, "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8" },
      timeout: 20000
    });
    return res.data;
  } else {
    const browser = await puppeteerExtra.launch({ headless: "new", args: ["--no-sandbox","--disable-setuid-sandbox"] });
    try {
      const page = await browser.newPage();
      await page.setUserAgent(new UserAgents().toString());
      await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
      await page.waitForTimeout(1000);
      return await page.content();
    } finally {
      await browser.close();
    }
  }
}

/**
 * selectors = {
 *   item: ".product-card",
 *   name: ".product-title",
 *   price: ".price",
 *   image: "img",           // optionnel
 *   imageAttr: "data-src",  // optionnel (sinon "src")
 *   size: ".size-option"    // optionnel
 * }
 */
async function scrapeWithSelectors(url, selectors, { usePuppeteer = false, throttleMs = 0, limit = null } = {}) {
  const html = await fetchHTML(url, usePuppeteer);
  const $ = cheerio.load(html);
  const items = [];
  const nodes = $(selectors.item).toArray();

  for (let i = 0; i < nodes.length; i++) {
    if (limit && items.length >= limit) break;
    const el = nodes[i];

    const name = selectors.name ? $(el).find(selectors.name).first().text().trim() : null;
    if (!name) continue;

    const priceText = selectors.price ? $(el).find(selectors.price).first().text().trim() : null;
    const price = parsePrice(priceText);

    let image = null;
    if (selectors.image) {
      const imgEl = $(el).find(selectors.image).first();
      image = imgEl.attr(selectors.imageAttr || "src") || null;
      if (image) image = absoluteUrl(image, url);
    }

    let sizes = [];
    if (selectors.size) {
      $(el).find(selectors.size).each((_, s) => {
        const t = $(s).text().trim();
        if (t) sizes.push(t);
      });
      sizes = [...new Set(sizes)];
    }

    items.push({ name, price, image, sizes });
    if (throttleMs) await new Promise(r => setTimeout(r, throttleMs));
  }

  return items;
}

module.exports = { scrapeWithSelectors };
