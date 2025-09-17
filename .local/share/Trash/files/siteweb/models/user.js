const pool = require('../db');
const bcrypt = require('bcrypt');

async function createUser(username, password, role = 'customer') {
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password, role) VALUES ($1,$2,$3) RETURNING id, username, role',
    [username, hashed, role]
  );
  return result.rows[0];
}

async function findUserByUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
  return result.rows[0];
}

module.exports = { createUser, findUserByUsername };
