const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByUsername } = require('../models/user');
const SECRET_KEY = process.env.JWT_SECRET || 'supersecret123';

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

  const existing = await findUserByUsername(username);
  if (existing) return res.status(400).json({ message: 'Username already exists' });

  const user = await createUser(username, password, role);
  res.json({ message: 'User created', user });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
  res.json({ token, user: { username: user.username, role: user.role } });
});

module.exports = router;
