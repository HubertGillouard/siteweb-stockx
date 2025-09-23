const express = require("express");
const pool = require("../db");
const router = express.Router();

// POST /api/orders → créer commande
router.post("/", async (req, res) => {
  try {
    const { userId, items, paymentId } = req.body;
    if (!userId || !items || !items.length)
      return res.status(400).json({ message: "userId ou items manquants" });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Calcul du total
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      // Création de la commande
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total, date, status, transaction_id)
         VALUES ($1, $2, NOW(), 'paid', $3) RETURNING *`,
        [userId, total, paymentId || null]
      );

      const orderId = orderResult.rows[0].id;

      // Insertion des items
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.id, item.quantity, item.price]
        );
      }

      await client.query("COMMIT");
      res.json({ order: orderResult.rows[0] });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la création de la commande" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/orders/:userId → récupérer commandes
router.get("/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          o.*,
          json_agg(
              json_build_object(
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'price', oi.price
              )
          ) as items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id=$1
       GROUP BY o.id
       ORDER BY o.date DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
  }
});

module.exports = router;
