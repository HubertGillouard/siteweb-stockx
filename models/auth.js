const express = require('express');
const router = express.Router();
const { createUser, getUserByEmail } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Inscription
router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    try {
        const user = await createUser({ email, password, first_name, last_name });
        res.json({ user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
