const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verifyToken } = require("../middleware/auth");

// Ajouter un produit au panier
router.post("/cart", verifyToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  const existing = await pool.query(
    "SELECT * FROM shopping_carts WHERE user_id=$1 AND product_id=$2",
    [user_id, product_id]
  );

  if (existing.rows.length > 0) {
    // Mettre à jour quantité
    const updated = await pool.query(
      "UPDATE shopping_carts SET quantity=quantity+$1 WHERE user_id=$2 AND product_id=$3 RETURNING *",
      [quantity, user_id, product_id]
    );
    return res.json(updated.rows[0]);
  }

  const inserted = await pool.query(
    "INSERT INTO shopping_carts (user_id, product_id, quantity) VALUES ($1,$2,$3) RETURNING *",
    [user_id, product_id, quantity]
  );
  res.json(inserted.rows[0]);
});

// Lister le panier
router.get("/cart", verifyToken, async (req, res) => {
  const user_id = req.user.id;
  const result = await pool.query(
    `SELECT sc.id, sc.quantity, p.id as product_id, p.nom, p.prix, p.link
     FROM shopping_carts sc
     JOIN products p ON sc.product_id=p.id
     WHERE sc.user_id=$1`,
    [user_id]
  );
  res.json(result.rows);
});

// Supprimer un article du panier
router.delete("/cart/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  await pool.query("DELETE FROM shopping_carts WHERE id=$1 RETURNING *", [id]);
  res.json({ message: "Article supprimé" });
});

// Checkout
router.post("/checkout", verifyToken, async (req, res) => {
  const user_id = req.user.id;
  const cart = await pool.query(
    "SELECT * FROM shopping_carts WHERE user_id=$1",
    [user_id]
  );

  if (cart.rows.length === 0) return res.status(400).json({ message: "Panier vide" });

  const total = cart.rows.reduce((sum, item) => sum + item.quantity * parseFloat(item.prix || 0), 0);

  const order = await pool.query(
    "INSERT INTO orders (user_id, total, status) VALUES ($1,$2,'paid') RETURNING *",
    [user_id, total]
  );

  const orderId = order.rows[0].id;

  for (let item of cart.rows) {
    await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)",
      [orderId, item.product_id, item.quantity, item.prix]
    );
  }

  // Vider le panier
  await pool.query("DELETE FROM shopping_carts WHERE user_id=$1", [user_id]);

  res.json({ message: "Commande passée !", order: order.rows[0] });
});

module.exports = router;
