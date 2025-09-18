const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const pool = require("../db");
const router = express.Router();

// Créer un produit (admin ou vendeur)
router.post("/add-product", authenticate, authorize(["admin", "vendeur"]), async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) return res.status(400).json({ message: "Nom et prix requis" });

    const result = await pool.query(
      `INSERT INTO products (name, price) VALUES ($1,$2) RETURNING *`,
      [name, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Supprimer un produit (admin uniquement)
router.delete("/delete-product/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM products WHERE id=$1`, [id]);
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
