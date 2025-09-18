const pool = require('../db');

// Créer une commande
async function createOrder(userId, items) {
    // Calcul du total
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Création de la commande
    const orderResult = await pool.query(
        `INSERT INTO orders (user_id, total, date) VALUES ($1, $2, NOW()) RETURNING *`,
        [userId, total]
    );

    const orderId = orderResult.rows[0].id;

    // Insertion des items + mise à jour du stock
    for (const item of items) {
        await pool.query(
            `INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
             VALUES ($1, $2, $3, $4, $5)`,
            [orderId, item.product_id, item.variant_id, item.quantity, item.price]
        );

        await pool.query(
            `UPDATE product_variants SET stock = stock - $1 WHERE id=$2`,
            [item.quantity, item.variant_id]
        );
    }

    return orderResult.rows[0];
}

// Récupérer les commandes d’un utilisateur
async function getOrdersByUser(userId) {
    const result = await pool.query(
        `SELECT 
            o.*,
            json_agg(
                json_build_object(
                    'product_id', oi.product_id,
                    'variant_id', oi.variant_id,
                    'quantity', oi.quantity,
                    'price', oi.price
                )
            ) as items
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         WHERE o.user_id=$1
         GROUP BY o.id
         ORDER BY o.date DESC`,
        [userId]
    );
    return result.rows;
}

module.exports = { createOrder, getOrdersByUser };
