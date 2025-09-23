// sneakers-backend/scripts/seed500.gen.js
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }

function sizesFor(category) {
  if (category === "enfants") return ["28","29","30","31","32","33","34","35","36","37"];
  return ["36","37","38","39","40","41","42","43","44","45"];
}
function genStock(sizes) {
  const s = {};
  sizes.forEach(sz => s[sz] = rand(0, 10));
  return s;
}

function generate(n=500) {
  const brands = ["Nike","Adidas","Puma","Jordan","New Balance","Converse","Asics","Reebok"];
  const families = ["Air Max","Zoom","Ultra","RS-X","Classic","540","XT","X Racer","Alpha","React","Pegasus","Blazer"];
  const cats = ["hommes","femmes","enfants","sport","lifestyle"];

  const out = [];
  for (let i=1;i<=n;i++){
    const brand = pick(brands);
    const fam   = pick(families);
    const category = pick(cats);
    const sizes = sizesFor(category);
    const price = rand(45, 260);
    out.push({
      id: i,
      name: `${brand} ${fam} ${i}`,
      price,
      category,
      sizes,
      stock: genStock(sizes),
      link: `https://loremflickr.com/600/400/sneaker,shoe?lock=${i}`
    });
  }
  return out;
}

module.exports = { generate };
