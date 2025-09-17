const fs = require('fs-extra');

// Lire le JSON avec toutes les tables
const db = fs.readJsonSync('nike_db.json');

// Début du fichier SQL
let sql = `-- Création des tables Nike E-commerce\n\n`;

// Table marques
sql += `
DROP TABLE IF EXISTS marques CASCADE;
CREATE TABLE marques (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);\n`;

// Table categories
sql += `
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);\n`;

// Table products
sql += `
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(50),
  marque_id INTEGER REFERENCES marques(id),
  category_id INTEGER REFERENCES categories(id),
  link TEXT
);\n`;

// Table images
sql += `
DROP TABLE IF EXISTS images CASCADE;
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  url TEXT
);\n`;

// Table variantes
sql += `
DROP TABLE IF EXISTS variantes CASCADE;
CREATE TABLE variantes (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  color VARCHAR(50),
  size INTEGER,
  stock INTEGER
);\n`;

// Insérer les données

// Marques
db.marques.forEach(m => {
  sql += `INSERT INTO marques (id, name) VALUES (${m.id}, '${m.name.replace(/'/g,"''")}');\n`;
});

// Categories
db.categories.forEach(c => {
  sql += `INSERT INTO categories (id, name) VALUES (${c.id}, '${c.name.replace(/'/g,"''")}');\n`;
});

// Products
db.products.forEach(p => {
  sql += `INSERT INTO products (id, name, price, marque_id, category_id, link) VALUES (${p.id}, '${p.name.replace(/'/g,"''")}', '${p.price.replace(/'/g,"''")}', ${p.marque_id}, ${p.category_id}, '${p.link}');\n`;
});

// Images
db.images.forEach(i => {
  sql += `INSERT INTO images (id, product_id, url) VALUES (${i.id}, ${i.product_id}, '${i.url}');\n`;
});

// Variantes
db.variantes.forEach(v => {
  sql += `INSERT INTO variantes (id, product_id, color, size, stock) VALUES (${v.id}, ${v.product_id}, '${v.color}', ${v.size}, ${v.stock});\n`;
});

// Sauvegarder le fichier SQL
fs.writeFileSync('nike_db.sql', sql);
console.log('nike_db.sql créé ! Tu peux l’importer dans PostgreSQL.');
