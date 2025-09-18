const pool = require('../db');
const bcrypt = require('bcrypt');

async function createUser({ email, password, first_name, last_name, role = 'customer' }) {
  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, email, first_name, last_name, role`,
    [email, password_hash, first_name, last_name, role]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  return result.rows[0] || null;
}

module.exports = { createUser, getUserByEmail };
