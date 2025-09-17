const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Liste produits (public)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Ajouter produit (admin seulement)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const result = await pool.query(
            'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
            [name, price, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer produit (admin seulement)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM products WHERE id=$1', [id]);
        res.json({ message: 'Produit supprimé' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
