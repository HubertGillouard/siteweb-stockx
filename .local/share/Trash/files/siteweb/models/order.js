const pool = require('../db');

async function createOrder(userId, items) {
    // Calcul du total
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const orderResult = await pool.query(
        `INSERT INTO orders (user_id, total, date) VALUES ($1, $2, NOW()) RETURNING *`,
        [userId, total]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
        await pool.query(
            `INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
             VALUES ($1, $2, $3, $4, $5)`,
            [orderId, item.product_id, item.variant_id, item.quantity, item.price]
        );
        // Décrémenter le stock
        await pool.query(
            `UPDATE product_variants SET stock = stock - $1 WHERE id=$2`,
            [item.quantity, item.variant_id]
        );
    }

    return orderResult.rows[0];
}

async function getOrdersByUser(userId) {
    const result = await pool.query(
        `SELECT * FROM orders WHERE user_id=$1 ORDER BY date DESC`,
        [userId]
    );
    return result.rows;
}

module.exports = { createOrder, getOrdersByUser };
