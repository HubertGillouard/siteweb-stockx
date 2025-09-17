const fs = require("fs");
const pool = require("./db"); // ton fichier db.js

async function updateLinks() {
  try {
    // Lire le fichier db.json
    const raw = fs.readFileSync("db.json", "utf-8");
    const data = JSON.parse(raw);

    // Si ton db.json est un array de produits, sinon data.products
    const productsArray = Array.isArray(data) ? data : data.products;

    for (const product of productsArray) {
      if (!product.link) continue; // ignorer si pas d'image

      await pool.query(
        `UPDATE products SET link=$1 WHERE nom=$2`,
        [product.link, product.name || product.nom]
      );
    }

    console.log("✅ Tous les liens des produits ont été mis à jour !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour des liens :", err);
    process.exit(1);
  }
}

updateLinks();
