const express = require('express');
const router = express.Router();
const { createOrder, getOrdersByUser } = require('../models/order');
const authMiddleware = require('../middleware/auth');

// Créer une commande
router.post('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const items = req.body.items; 
    try {
        const order = await createOrder(userId, items);
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Récupérer ses commandes
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const orders = await getOrdersByUser(userId);
    res.json(orders);
});

module.exports = router;
