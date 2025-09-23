const fs = require("fs");
const pool = require("./db");

async function importData() {
  const raw = fs.readFileSync("db.json", "utf-8");
  const data = JSON.parse(raw);

  const productsArray = Array.isArray(data) ? data : data.products;

  for (const product of productsArray) {
    const res = await pool.query(
      `INSERT INTO products (nom, prix, marque_id, categorie_id) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        product.name || product.nom,
        parseFloat(product.price || product.prix),
        product.marque_id,
        product.categorie_id
      ]
    );
    const productId = res.rows[0].id;

    // Variante si tu as des variantes
    if (product.variants) {
      for (const variant of product.variants) {
        await pool.query(
          `INSERT INTO variants (product_id, size, price, stock) 
           VALUES ($1, $2, $3, $4)`,
          [productId, variant.size, variant.price, variant.stock]
        );
      }
    }
  }

  console.log("✅ Données importées !");
  process.exit();
}

importData();
