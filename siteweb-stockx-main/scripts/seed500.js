// sneakers-backend/scripts/seed500.js
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const OUT_FILE = path.join(DATA_DIR, "products.json");

const CATEGORIES = ["hommes", "femmes", "enfants", "sports", "ville"];
const BRANDS = ["Nike", "Adidas", "Puma", "New Balance", "Asics", "Saucony", "Reebok"];
const MODELS = [
  "Air Max", "Air Force 1", "Dunk", "Jordan 1", "Jordan 4", "Blazer",
  "Ultraboost", "Gazelle", "Campus", "Samba", "Suede", "Gel-Kayano",
  "990v5", "550", "574", "Shadow 6000", "Classic Leather"
];

// tailles réalistes par catégorie
const SIZES = {
  hommes: ["39", "40", "41", "42", "43", "44", "45"],
  femmes: ["35", "36", "37", "38", "39", "40", "41"],
  enfants: ["28", "29", "30", "31", "32", "33", "34"],
  sports: ["39", "40", "41", "42", "43", "44", "45"],
  ville:  ["39", "40", "41", "42", "43", "44", "45"]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function priceFor(cat) {
  // fourchettes par catégorie
  if (cat === "enfants") return +(30 + Math.random() * 40).toFixed(2);    // 30–70
  if (cat === "sports")  return +(60 + Math.random() * 90).toFixed(2);    // 60–150
  return +(70 + Math.random() * 180).toFixed(2);                          // 70–250
}
function stock() {
  return Math.floor(Math.random() * 30) + 1; // 1–30 en stock
}
function sizesFor(cat) {
  const base = SIZES[cat] || SIZES.hommes;
  // 3 à 6 tailles disponibles
  const n = 3 + Math.floor(Math.random() * 4);
  const shuffled = [...base].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function buildProducts(n = 500) {
  const products = [];
  for (let i = 1; i <= n; i++) {
    const brand = pick(BRANDS);
    const model = pick(MODELS);
    const category = pick(CATEGORIES);
    const color = pick(["Black", "White", "Grey", "Navy", "Red", "Blue", "Green", "Cream"]);
    const name = `${brand} ${model} ${color}`;

    // Image fiable via placehold.co (évite les 500 de loremflickr)
    const text = encodeURIComponent(`${brand} ${model}`);
    const link = `https://placehold.co/600x400?text=${text}`;

    products.push({
      id: i,
      name,
      brand,
      model,
      category,                 // "hommes" | "femmes" | "enfants" | "sports" | "ville"
      price: priceFor(category),
      stock: stock(),
      sizes: sizesFor(category), // tableau de tailles
      link,                      // URL d'image stable
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  return products;
}

function main() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const items = buildProducts(500);
  fs.writeFileSync(OUT_FILE, JSON.stringify(items, null, 2), "utf-8");
  console.log(`✅ 500 produits écrits dans ${OUT_FILE}`);
}

if (require.main === module) {
  main();
}
