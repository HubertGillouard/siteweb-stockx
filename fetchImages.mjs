import fs from "fs";
import path from "path";
import "dotenv/config";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

const INPUT_FILE = path.resolve("./products.json");
const OUTPUT_FILE = path.resolve("./products_with_images.json");
const CSV_OUTPUT = path.resolve("./products_with_images.csv");
const CHECKPOINT_FILE = path.resolve("./checkpoint.txt");

const FALLBACK_IMAGE = "https://via.placeholder.com/600x600.png?text=Sneaker";

// 🔹 Fonction pour récupérer les images via Google Custom Search
async function fetchImages(query) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&cx=${GOOGLE_CSE_ID}&key=${GOOGLE_API_KEY}&searchType=image&num=3&safe=active`;

  try {
    const res = await fetch(url);
    if (res.status === 429) {
      console.warn("⚠️ Quota dépassé → attente 30s...");
      await new Promise((r) => setTimeout(r, 30000));
      return fetchImages(query);
    }
    const data = await res.json();
    return data.items
      ? data.items.map((i, idx) => ({
          url: i.link,
          is_primary: idx === 0,
        }))
      : [];
  } catch (err) {
    console.error(`❌ Erreur sur ${query}:`, err.message || err);
    return [];
  }
}

// 🔹 Récupère les images pour un produit
async function fetchProductImages(product) {
  const queries = [
    `${product.name} ${product.brand} sneakers site:stockx.com`,
    `${product.name} ${product.brand} sneakers site:goat.com`,
    `${product.name} ${product.brand} sneakers site:flightclub.com`,
    `${product.name} ${product.brand} sneakers`,
  ];

  for (const query of queries) {
    const images = await fetchImages(query);
    if (images.length > 0) return images;
    await new Promise((r) => setTimeout(r, 1000));
  }

  return [{ url: FALLBACK_IMAGE, is_primary: true }];
}

// 🔹 Fonction pour générer le CSV (une ligne par variante)
function exportCSV(products) {
  const header = [
    "product_id",
    "product_name",
    "description",
    "brand",
    "base_price",
    "variant_id",
    "variant_size",
    "variant_color",
    "variant_price",
    "variant_stock",
    "image_url"
  ].join(";");

  const rows = [];

  products.forEach((p) => {
    const images = p.images?.length ? p.images : [{ url: FALLBACK_IMAGE }];

    p.variants.forEach((v) => {
      const img = images[0].url;
      rows.push([
        p.id,
        `"${p.name}"`,
        `"${p.description || ""}"`,
        `"${p.brand}"`,
        p.base_price,
        v.id,
        v.size,
        v.color,
        v.price,
        v.stock,
        `"${img}"`
      ].join(";"));
    });
  });

  fs.writeFileSync(CSV_OUTPUT, header + "\n" + rows.join("\n"), "utf-8");
  console.log(`📂 Export CSV généré → ${CSV_OUTPUT} (${rows.length} lignes)`);
}

// 🔹 Fonction principale
async function main() {
  const products = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));
  let startIndex = 0;

  if (fs.existsSync(CHECKPOINT_FILE)) {
    startIndex = parseInt(fs.readFileSync(CHECKPOINT_FILE, "utf-8")) || 0;
  }

  console.log(`➡️ Reprise à ${startIndex}/${products.length}`);

  for (let i = startIndex; i < products.length; i++) {
    const p = products[i];
    p.images = await fetchProductImages(p);

    console.log(
      `(${i + 1}/${products.length}) ${p.name} → ${p.images.length} images`
    );

    // Sauvegarde intermédiaire toutes les 10 lignes
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), "utf-8");
      fs.writeFileSync(CHECKPOINT_FILE, String(i + 1));
      exportCSV(products.slice(0, i + 1));
      console.log(`💾 Sauvegarde intermédiaire (ligne ${i + 1})`);
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  // Sauvegarde finale
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), "utf-8");
  fs.writeFileSync(CHECKPOINT_FILE, String(products.length));
  exportCSV(products);
  console.log("🎉 Sauvegarde finale avec images & CSV !");
}

main();
