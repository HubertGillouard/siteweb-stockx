const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Secret pour JWT (simple exemple)
const JWT_SECRET = "monsecret";

// --- MOCK DATABASE ---
let products = [
  { id: 1, name: "Nike Air", price: 120 },
  { id: 2, name: "Adidas Yeezy", price: 200 }
];

let images = [
  { productId: 1, url: "/images/nike.jpg" },
  { productId: 2, url: "/images/yeezy.jpg" }
];

let users = [
  { id: 1, email: "admin@test.com", password: "admin", role: "admin" },
  { id: 2, email: "user@test.com", password: "user", role: "user" }
];

// --- AUTH ---
app.post("/api/auth/register", (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email et mot de passe requis" });
  const id = users.length + 1;
  const user = { id, email, password, role: "user", first_name, last_name };
  users.push(user);
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ token, user });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Identifiants invalides" });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ token, user });
});

// --- MIDDLEWARE AUTH ---
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token manquant" });
  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
}

// --- ADMIN CHECK ---
function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Accès refusé" });
  next();
}

// --- PRODUCTS ---
app.get("/api/products", (req, res) => res.json(products));
app.get("/api/products/:id", (req, res) => {
  const p = products.find(p => p.id == req.params.id);
  if (!p) return res.status(404).json({ message: "Produit non trouvé" });
  res.json(p);
});
app.get("/api/images/:productId", (req, res) => {
  const imgs = images.filter(i => i.productId == req.params.productId);
  res.json(imgs);
});

// --- ADMIN PRODUCTS ---
app.post("/api/admin/add-product", authMiddleware, adminMiddleware, (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: "Nom et prix requis" });
  const id = products.length + 1;
  const newProduct = { id, name, price };
  products.push(newProduct);
  res.json(newProduct);
});

app.delete("/api/admin/delete-product/:id", authMiddleware, adminMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  images = images.filter(i => i.productId !== id);
  res.json({ message: "Produit supprimé" });
});

// --- ORDERS / PAYMENTS (simulés) ---
app.post("/api/orders", authMiddleware, (req, res) => {
  const order = { id: Math.floor(Math.random() * 100000), ...req.body };
  res.json(order);
});
app.post("/api/payments", authMiddleware, (req, res) => {
  const payment = { id: Math.floor(Math.random() * 100000), client_secret: "pi_test_secret" };
  res.json(payment);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
