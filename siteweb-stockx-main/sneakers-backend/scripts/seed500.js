// scripts/seed500.js
const fs = require("fs");
const { PRODUCTS_FILE } = require("../data/store");

const CATS = ["hommes", "femmes", "enfants", "sport", "ville"];
const ADULT_SIZES = ["36","37","38","39","40","41","42","43","44","45","46","47"];
const KIDS_SIZES  = ["28","29","30","31","32","33","34","35"];

const BRANDS = ["Nike","Adidas","Puma","New Balance","Reebok","Asics","Converse","Jordan"];
const MODELS = ["Air","Max","Zoom","Court","Run","Street","Pro","Classic","Retro","Lite","Ultra","Boost","Nova","Racer","Trainer","Cloud","Flow","Pulse"];

function choice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function uniqSku(base, size, i){ return `${base}-${size}-${i}`.replace(/\W+/g,"").toUpperCase(); }

function genProduct(id){
  const brand = choice(BRANDS);
  const model = `${choice(MODELS)} ${Math.floor(100+Math.random()*900)}`;
  const name = `${brand} ${model}`;
  const category = choice(CATS);
  const basePrice = Math.round((60 + Math.random()*140) * 100)/100; // 60 - 200 €
  const sizes = category === "enfants" ? KIDS_SIZES : ADULT_SIZES;
  const pick = [...sizes].sort(()=>0.5 - Math.random()).slice(3 + Math.floor(Math.random()*5)); // 3-8 tailles
  const variants = pick.map((sz, i) => ({
    sku: uniqSku(`${brand}${model}`, sz, i),
    size: sz,
    stock: 2 + Math.floor(Math.random()*15),
    price: basePrice + (Math.random() < 0.3 ? 10 : 0)
  }));

  return {
    id,
    name,
    price: basePrice,
    category,
    link: "/images/placeholder.jpg",
    description: `${name} – ${category}.`,
    variants
  };
}

(function main(){
  const total = 500;
  const list = [];
  for (let i=1;i<=total;i++) list.push(genProduct(i));
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(list, null, 2));
  console.log(`✅ ${total} produits écrits dans ${PRODUCTS_FILE}`);
})();
