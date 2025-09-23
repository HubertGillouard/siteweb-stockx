const express = require('express');
const router = express.Router();
const { createUser, getUserByEmail } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'supersecret123';

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const existing = await getUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé' });

    const user = await createUser({ email, password, first_name, last_name, role });
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Utilisateur introuvable' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
    const { password_hash, ...userData } = user;
    res.json({ user: userData, token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
