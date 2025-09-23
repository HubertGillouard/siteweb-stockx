// data/store.js
const fs = require("fs");
const path = require("path");

const DATA_DIR = __dirname;
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

function ensureFile() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    const seed = [
      {
        id: 1,
        name: "Nike Air",
        price: 120,
        category: "hommes",
        link: "/images/placeholder.jpg",
        description: "Sneakers iconiques.",
        variants: [
          { sku: "NIKEAIR-42", size: "42", stock: 5, price: 120 },
          { sku: "NIKEAIR-43", size: "43", stock: 3, price: 120 }
        ]
      },
      {
        id: 2,
        name: "Adidas Yeezy",
        price: 200,
        category: "hommes",
        link: "/images/placeholder.jpg",
        description: "Édition limitée.",
        variants: [
          { sku: "YEEZY-42", size: "42", stock: 2, price: 200 },
          { sku: "YEEZY-43", size: "43", stock: 0, price: 200 }
        ]
      }
    ];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(seed, null, 2));
  }
}

function loadProducts() {
  try {
    ensureFile();
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("[STORE] loadProducts error:", e);
    return [];
  }
}

function saveProducts(list) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(list, null, 2));
  } catch (e) {
    console.error("[STORE] saveProducts error:", e);
  }
}

module.exports = { loadProducts, saveProducts, PRODUCTS_FILE };
