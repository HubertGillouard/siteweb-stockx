const fs = require('fs');

// Fonction pour convertir le prix "129,99 €" → 129.99
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(',', '.').replace(/[^\d.]/g, ''));
}

// Normaliser les liens relatifs
function normalizeLink(link) {
  if (!link) return "";
  if (link.startsWith("http")) return link;
  return `https://www.courir.com${link}`;
}

// Générer un ID unique pour le produit + variante
function generateId(productName, variant) {
  const cleanName = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const cleanVariant = variant ? `${variant.size}-${variant.color}`.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
  return cleanVariant ? `${cleanName}-${cleanVariant}` : cleanName;
}

// Normalisation des variantes
function normalizeVariants(variants) {
  if (!variants || !Array.isArray(variants)) return [];
  return variants.map(v => ({
    size: v.size || "Unknown",
    color: v.color || "Unknown",
    stock: typeof v.stock === "number" ? v.stock : 0
  }));
}

// Normalisation d’un produit
function normalizeProduct(product) {
  const normalizedVariants = normalizeVariants(product.variants);

  // Si plusieurs images, garder le tableau, sinon convertir en tableau avec une image
  const images = Array.isArray(product.images)
    ? product.images
    : product.image
      ? [product.image]
      : [];

  return {
    id: generateId(product.name),
    name: product.name,
    brand: product.brand || "Unknown",
    images,
    category: product.category || "Unknown",
    price: parsePrice(product.price),
    link: normalizeLink(product.link),
    variants: normalizedVariants.map(v => ({
      ...v,
      id: generateId(product.name, v)
    }))
  };
}

// Lecture et transformation avec logs
try {
  const rawProducts = JSON.parse(fs.readFileSync('mock_raw.json', 'utf-8'));

  const normalizedProducts = rawProducts.map(product => {
    const normalized = normalizeProduct(product);
    console.log(`✅ Produit traité: "${normalized.name}" avec ${normalized.variants.length} variante(s)`);
    normalized.variants.forEach(v => {
      console.log(`   Variante ID: ${v.id}, Taille: ${v.size}, Couleur: ${v.color}, Stock: ${v.stock}`);
    });
    return normalized;
  });

  fs.writeFileSync('products.json', JSON.stringify(normalizedProducts, null, 2));
  console.log("\n🎉 products.json généré avec succès !");
} catch (err) {
  console.error("❌ Une erreur est survenue :", err);
}
