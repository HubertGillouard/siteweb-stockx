const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const pool = require('../db');

router.post('/', authenticate, async (req, res) => {
  const { items, paymentId } = req.body;
  const userId = req.user.id;

  const orderRes = await pool.query(
    'INSERT INTO orders (user_id, payment_id) VALUES ($1,$2) RETURNING *',
    [userId, paymentId]
  );
  const order = orderRes.rows[0];

  for (const item of items) {
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)',
      [order.id, item.id, item.quantity, item.price]
    );
  }

  res.json(order);
});

module.exports = router;
