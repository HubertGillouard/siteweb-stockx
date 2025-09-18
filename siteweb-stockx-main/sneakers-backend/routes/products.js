const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM products WHERE id=$1', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ message: 'Produit introuvable' });
  res.json(result.rows[0]);
});

router.get('/:id/images', async (req, res) => {
  const result = await pool.query('SELECT * FROM product_images WHERE product_id=$1', [req.params.id]);
  res.json(result.rows);
});

module.exports = router;
