const fs = require('fs-extra');

// Lire les produits Nike existants
const nikeProducts = fs.readJsonSync('products_nike.json');

// Catégories et tailles
const categories = [
  { id: 1, name: 'hommes', sizes: [40,41,42,43,44,45,46] },
  { id: 2, name: 'femmes', sizes: [36,37,38,39,40,41,42] },
  { id: 3, name: 'enfants', sizes: [28,29,30,31,32,33,34,35] }
];

// Couleurs possibles
const colors = ['noir', 'blanc', 'rouge'];

// Marques
const marques = [
  { id: 1, name: 'Nike' },
  { id: 2, name: 'Adidas' },
  { id: 3, name: 'Puma' }
];

// Images locales par marque
const adidasImages = ['images/adidas1.jpg','images/adidas2.jpg','images/adidas3.jpg'];
const pumaImages = ['images/puma1.jpg','images/puma2.jpg','images/puma3.jpg'];

let db = {
  categories: categories.map(c => ({ id: c.id, name: c.name })),
  marques: marques,
  products: [],
  images: [],
  variantes: []
};

let productId = 1;
let imageId = 1;
let varianteId = 1;

// Générer prix réaliste
function generatePrice(basePrice, brandId) {
  if (brandId === 1) return basePrice;
  const numericPrice = parseFloat(basePrice.replace(/[^\d\.]/g, '')) || 100;
  const variation = numericPrice * (Math.random() * 0.4 - 0.2); // -20% à +20%
  return `${(numericPrice + variation).toFixed(2)}€`;
}

// Ajouter produits pour une marque
function addProductsForBrand(products, brandId, brandName) {
  products.forEach((p, idx) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = brandId === 1 ? p.name : `${brandName} Model ${idx + 1}`;
    const price = brandId === 1 ? p.price : generatePrice(p.price, brandId);

    db.products.push({
      id: productId,
      name,
      price,
      marque_id: brandId,
      category_id: category.id,
      link: p.link
    });

    // Choisir images locales selon la couleur
    colors.forEach((color, colorIdx) => {
      let imageURL;
      if (brandId === 1) {
        imageURL = p.image; // Nike réel
      } else if (brandId === 2) {
        imageURL = adidasImages[colorIdx % adidasImages.length];
      } else {
        imageURL = pumaImages[colorIdx % pumaImages.length];
      }

      db.images.push({
        id: imageId,
        product_id: productId,
        url: imageURL,
        color: color
      });
      imageId++;
    });

    // Variantes
    category.sizes.forEach(size => {
      colors.forEach(color => {
        db.variantes.push({
          id: varianteId,
          product_id: productId,
          color,
          size,
          stock: Math.floor(Math.random() * 16) + 5
        });
        varianteId++;
      });
    });

    productId++;
  });
}

// Ajouter Nike (réels)
addProductsForBrand(nikeProducts, 1, 'Nike');
// Ajouter Adidas et Puma (simulés avec images locales)
addProductsForBrand(nikeProducts, 2, 'Adidas');
addProductsForBrand(nikeProducts, 3, 'Puma');

console.log('Nombre total de produits :', db.products.length);
console.log('Nombre total de variantes :', db.variantes.length);
console.log('Nombre total d\'images :', db.images.length);

fs.writeJsonSync('db.json', db, { spaces: 2 });
console.log('✅ db.json créé avec images locales pour Adidas et Puma !');
