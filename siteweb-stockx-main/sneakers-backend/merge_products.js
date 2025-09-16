const fs = require("fs-extra");

async function merge() {
  const nike = fs.existsSync("products_nike.json") ? fs.readJsonSync("products_nike.json") : [];
  const adidas = fs.existsSync("products_adidas.json") ? fs.readJsonSync("products_adidas.json") : [];
  const puma = fs.existsSync("products_puma.json") ? fs.readJsonSync("products_puma.json") : [];

  const allProducts = [...nike, ...adidas, ...puma];

  fs.writeJsonSync("products.json", allProducts, { spaces: 2 });

  console.log(`✅ Fusion terminée : ${allProducts.length} produits enregistrés dans products.json`);
}

merge();
