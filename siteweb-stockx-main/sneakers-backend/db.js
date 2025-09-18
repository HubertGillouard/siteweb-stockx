require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'hubert',
  password: process.env.DB_PASS || 'motdepasse',
  database: process.env.DB_NAME || 'sneakers',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
