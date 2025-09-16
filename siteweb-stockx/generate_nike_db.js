const fs = require('fs-extra');

// Lire le JSON brut des produits récupérés
const products = fs.readJsonSync('products.json');

// Définir catégories et tailles réalistes
const categories = [
  { id: 1, name: 'hommes', sizes: [40,41,42,43,44,45,46] },
  { id: 2, name: 'femmes', sizes: [36,37,38,39,40,41,42] },
  { id: 3, name: 'enfants', sizes: [28,29,30,31,32,33,34,35] }
];

// Couleurs possibles (3 variantes par modèle)
const colors = ['noir', 'blanc', 'rouge'];

// Marques
const marques = [{ id: 1, name: 'Nike' }];

// Table finale
const db = {
  categories: categories.map(c => ({ id: c.id, name: c.name })),
  marques: marques,
  products: [],
  images: [],
  variantes: []
};

let productId = 1;
let imageId = 1;
let varianteId = 1;

// On limite pour obtenir minimum 100 modèles
const modelsToUse = products.slice(0, Math.max(100, products.length));

modelsToUse.forEach((p) => {
  // Associer catégorie aléatoire pour chaque modèle
  const category = categories[Math.floor(Math.random() * categories.length)];

  // Ajouter le produit
  db.products.push({
    id: productId,
    name: p.name,
    price: p.price,
    marque_id: 1, // Nike
    category_id: category.id,
    link: p.link
  });

  // Ajouter image principale
  db.images.push({
    id: imageId,
    product_id: productId,
    url: p.image
  });

  // Générer variantes (taille x couleur)
  category.sizes.forEach(size => {
    colors.forEach(color => {
      db.variantes.push({
        id: varianteId,
        product_id: productId,
        color: color,
        size: size,
        stock: Math.floor(Math.random() * 16) + 5 // stock 5-20
      });
      varianteId++;
    });
  });

  productId++;
  imageId++;
});

// Vérifier le nombre total de références
console.log('Nombre de modèles (products) :', db.products.length);
console.log('Nombre de références (variantes) :', db.variantes.length);

// Sauvegarder en JSON
fs.writeJsonSync('nike_db.json', db, { spaces: 2 });
console.log('nike_db.json créé avec toutes les tables !');
