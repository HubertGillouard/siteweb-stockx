// sneakers-backend/routes/ordersRouter.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // ton pool Postgres

// Créer une commande (body: { userId, items: [{ product_id, variant_id, quantity, price }], total, payment })
router.post('/', async (req, res, next) => {
  const { userId, items, total, payment } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'Panier vide' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const status = payment ? 'paid' : 'pending';
    const transactionId = payment ? (payment.transactionId || payment.id || payment.txId) : null;

    const insertOrder = await client.query(
      `INSERT INTO orders (user_id, total, date, status, transaction_id)
       VALUES ($1, $2, NOW(), $3, $4) RETURNING *`,
      [userId || null, total || 0, status, transactionId]
    );

    const orderId = insertOrder.rows[0].id;

    for (const it of items) {
      const product_id = it.product_id || it.id || it.productId;
      const variant_id = it.variant_id || it.variantId || null;
      const quantity = Number(it.quantity || it.qty || 1);
      const price = Number(
        // attempt to normalize price if it's a string like "129,99 €"
        (() => {
          if (typeof it.price === 'number') return it.price;
          if (!it.price) return 0;
          return Number(String(it.price).replace(/\s/g, '').replace('€','').replace(',', '.'));
        })()
      );

      await client.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
         VALUES ($1,$2,$3,$4,$5)`,
        [orderId, product_id, variant_id, quantity, price]
      );

      if (variant_id) {
        await client.query(
          `UPDATE product_variants SET stock = stock - $1 WHERE id = $2`,
          [quantity, variant_id]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, order: insertOrder.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// Récupérer les commandes d'un utilisateur
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT 
         o.*,
         json_agg(json_build_object('product_id', oi.product_id, 'variant_id', oi.variant_id, 'quantity', oi.quantity, 'price', oi.price)) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
