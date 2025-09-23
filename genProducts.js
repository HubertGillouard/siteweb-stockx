import fs from "fs";
import { faker } from "@faker-js/faker";

// --- Marques réelles et modèles connus ---
const brands = {
  Nike: [
    "Air Force 1", "Air Max 90", "Dunk Low", "Air Jordan 1", "Blazer Mid",
    "Air Max 97", "Cortez", "LeBron 20", "Kyrie 7", "Air Zoom Pegasus"
  ],
  Adidas: [
    "Superstar", "Stan Smith", "Ultraboost", "NMD R1", "Forum Low",
    "Samba", "Gazelle", "Yeezy Boost 350", "Yeezy 700", "Ozweego"
  ],
  NewBalance: [
    "574", "990v5", "550", "327", "1080v12",
    "860v2", "2002R", "530", "996", "1500"
  ],
  Puma: [
    "Suede Classic", "RS-X", "Future Rider", "Cali", "Slipstream",
    "MB.02", "Mirage Sport", "Wild Rider", "Blaze of Glory", "Roma"
  ],
  Jordan: [
    "Air Jordan 3", "Air Jordan 4", "Air Jordan 5", "Air Jordan 6", "Air Jordan 11",
    "Jordan Delta 3", "Jordan Zoom Separate", "Jordan MA2", "Jordan Why Not 0.5", "Jordan Legacy 312"
  ]
};

// --- Génère des variantes pour chaque produit ---
function generateVariants(basePrice) {
  const colors = ["White", "Black", "Red", "Blue", "Green", "Grey", "Beige"];
  const sizes = [38, 39, 40, 41, 42, 43, 44, 45];

  return Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => ({
    id: faker.string.uuid(),
    color: faker.helpers.arrayElement(colors),
    size: faker.helpers.arrayElement(sizes),
    price: basePrice + faker.number.int({ min: -20, max: 30 }),
    stock: faker.number.int({ min: 0, max: 50 }),
  }));
}

// --- Génération principale ---
function generateProducts(total = 500) {
  const products = [];
  let idCounter = 1;

  while (products.length < total) {
    for (const [brand, models] of Object.entries(brands)) {
      for (const model of models) {
        if (products.length >= total) break;

        const basePrice = faker.number.int({ min: 80, max: 250 });

        products.push({
          id: `sneaker-${idCounter}`,
          name: `${brand} ${model}`,
          brand,
          description: faker.commerce.productDescription(),
          base_price: basePrice,
          variants: generateVariants(basePrice),
          images: [] // sera rempli par fetchImages.js
        });

        idCounter++;
      }
    }
  }

  return products.slice(0, total);
}

// --- Sauvegarde ---
const products = generateProducts(500);
fs.writeFileSync("products.json", JSON.stringify(products, null, 2), "utf-8");

console.log(`✅ ${products.length} produits générés dans products.json`);
