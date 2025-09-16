const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route racine
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API Sneakers!',
    version: '1.0.0',
    endpoints: {
      authentication: {
        login: 'POST /login'
      },
      products: {
        list: 'GET /products',
        details: 'GET /products/:id',
        create: 'POST /products (admin)',
        update: 'PUT /products/:id (admin)',
        delete: 'DELETE /products/:id (admin)'
      },
      variants: {
        list: 'GET /variants/:productId',
        create: 'POST /variants (admin)',
        update: 'PUT /variants/:id (admin)',
        delete: 'DELETE /variants/:id (admin)'
      },
      images: {
        list: 'GET /images/:productId',
        create: 'POST /images (admin)',
        update: 'PUT /images/:id (admin)',
        delete: 'DELETE /images/:id (admin)'
      },
      categories: {
        list: 'GET /categories',
        create: 'POST /categories (admin)',
        update: 'PUT /categories/:id (admin)',
        delete: 'DELETE /categories/:id (admin)'
      },
      brands: {
        list: 'GET /brands',
        create: 'POST /brands (admin)',
        update: 'PUT /brands/:id (admin)',
        delete: 'DELETE /brands/:id (admin)'
      }
    }
  });
});

// Connexion PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'hubert',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sneakers',
  password: process.env.DB_PASS || 'motdepasse',
  port: process.env.DB_PORT || 5432,
});

// Clé secrète pour JWT
const SECRET_KEY = process.env.JWT_SECRET || 'supersecret123';

// ---------- AUTHENTICATION ----------
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Pour l'exemple : utilisateur admin codé en dur
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  
  if (username === 'admin' && await bcrypt.compare(password, adminPasswordHash)) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ 
      token,
      user: { username: 'admin', role: 'admin' }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware de vérification du token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ---------------- CRUD ----------------

// Helper pour gérer les erreurs
const tryCatch = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ----------- PRODUCTS -----------
app.get('/products', tryCatch(async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY id LIMIT 100');
  res.json(result.rows);
}));

app.get('/products/:id', tryCatch(async (req, res) => {
  const result = await pool.query('SELECT * FROM products WHERE id=$1', [req.params.id]);
  res.json(result.rows[0]);
}));

app.post('/products', verifyToken, tryCatch(async (req, res) => {
  const { name, price, marque_id, category_id, link } = req.body;
  if (!name || !marque_id || !category_id) return res.status(400).json({ message: 'Missing required fields' });
  const result = await pool.query(
    'INSERT INTO products (name, price, marque_id, category_id, link) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name, price, marque_id, category_id, link]
  );
  res.json(result.rows[0]);
}));

app.put('/products/:id', verifyToken, tryCatch(async (req, res) => {
  const { name, price, marque_id, category_id, link } = req.body;
  const result = await pool.query(
    'UPDATE products SET name=$1, price=$2, marque_id=$3, category_id=$4, link=$5 WHERE id=$6 RETURNING *',
    [name, price, marque_id, category_id, link, req.params.id]
  );
  res.json(result.rows[0]);
}));

app.delete('/products/:id', verifyToken, tryCatch(async (req, res) => {
  await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
  res.json({ message: 'Product deleted' });
}));

// ----------- VARIANTES -----------
app.get('/variants/:productId', tryCatch(async (req, res) => {
  const result = await pool.query('SELECT * FROM variantes WHERE product_id=$1', [req.params.productId]);
  res.json(result.rows);
}));

app.post('/variants', verifyToken, tryCatch(async (req, res) => {
  const { product_id, color, size, stock } = req.body;
  if (!product_id || !size) return res.status(400).json({ message: 'Missing required fields' });
  const result = await pool.query(
    'INSERT INTO variantes (product_id, color, size, stock) VALUES ($1,$2,$3,$4) RETURNING *',
    [product_id, color, size, stock]
  );
  res.json(result.rows[0]);
}));

app.put('/variants/:id', verifyToken, tryCatch(async (req, res) => {
  const { color, size, stock } = req.body;
  const result = await pool.query(
    'UPDATE variantes SET color=$1, size=$2, stock=$3 WHERE id=$4 RETURNING *',
    [color, size, stock, req.params.id]
  );
  res.json(result.rows[0]);
}));

app.delete('/variants/:id', verifyToken, tryCatch(async (req, res) => {
  await pool.query('DELETE FROM variantes WHERE id=$1', [req.params.id]);
  res.json({ message: 'Variant deleted' });
}));

// ----------- IMAGES -----------
app.get('/images/:productId', tryCatch(async (req, res) => {
  const result = await pool.query('SELECT * FROM images WHERE product_id=$1', [req.params.productId]);
  res.json(result.rows);
}));

app.post('/images', verifyToken, tryCatch(async (req, res) => {
  const { product_id, url } = req.body;
  if (!product_id || !url) return res.status(400).json({ message: 'Missing fields' });
  const result = await pool.query(
    'INSERT INTO images (product_id, url) VALUES ($1,$2) RETURNING *',
    [product_id, url]
  );
  res.json(result.rows[0]);
}));

app.put('/images/:id', verifyToken, tryCatch(async (req, res) => {
  const { url } = req.body;
  const result = await pool.query(
    'UPDATE images SET url=$1 WHERE id=$2 RETURNING *',
    [url, req.params.id]
  );
  res.json(result.rows[0]);
}));

app.delete('/images/:id', verifyToken, tryCatch(async (req, res) => {
  await pool.query('DELETE FROM images WHERE id=$1', [req.params.id]);
  res.json({ message: 'Image deleted' });
}));

// ----------- CATEGORIES -----------
app.get('/categories', tryCatch(async (req, res) => {
  const result = await pool.query('SELECT * FROM categories');
  res.json(result.rows);
}));

app.post('/categories', verifyToken, tryCatch(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Missing name' });
  const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
  res.json(result.rows[0]);
}));

app.put('/categories/:id', verifyToken, tryCatch(async (req, res) => {
  const { name } = req.body;
  const result = await pool.query('UPDATE categories SET name=$1 WHERE id=$2 RETURNING *', [name, req.params.id]);
  res.json(result.rows[0]);
}));

app.delete('/categories/:id', verifyToken, tryCatch(async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
  res.json({ message: 'Category deleted' });
}));

// ----------- MARQUES -----------
app.get('/brands', tryCatch(async (req, res) => {
  const result = await pool.query('SELECT * FROM marques');
  res.json(result.rows);
}));

app.post('/brands', verifyToken, tryCatch(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Missing name' });
  const result = await pool.query('INSERT INTO marques (name) VALUES ($1) RETURNING *', [name]);
  res.json(result.rows[0]);
}));

app.put('/brands/:id', verifyToken, tryCatch(async (req, res) => {
  const { name } = req.body;
  const result = await pool.query('UPDATE marques SET name=$1 WHERE id=$2 RETURNING *', [name, req.params.id]);
  res.json(result.rows[0]);
}));

app.delete('/brands/:id', verifyToken, tryCatch(async (req, res) => {
  await pool.query('DELETE FROM marques WHERE id=$1', [req.params.id]);
  res.json({ message: 'Brand deleted' });
}));

// ----------- Gestion globale des erreurs -----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Route de fallback pour les routes non trouvées - CORRIGÉE
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

// -------------------------------
app.listen(port, () => console.log(`✅ API running at http://localhost:${port}`));