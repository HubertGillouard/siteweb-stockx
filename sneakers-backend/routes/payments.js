const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  const { amount } = req.body;
  res.json({ id: Math.floor(Math.random()*1000000), client_secret: "fake_secret_"+amount });
});

module.exports = router;
