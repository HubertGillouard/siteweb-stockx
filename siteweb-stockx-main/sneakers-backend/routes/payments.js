// routes/payments.js
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  // Paiement fictif : on renvoie juste un id
  const fakePaymentId = Math.floor(Math.random() * 1000000);
  res.json({ id: fakePaymentId, status: "success" });
});

module.exports = router;
