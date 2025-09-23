// sneakers-backend/server.js  (CommonJS)

// Dépendances
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// Config
const PORT = process.env.PORT ? Number(process.env.PORT) : 5050;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Fichiers de données/statics
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");
const IMAGES_DIR = path.join(__dirname, "public", "images");

// Utilitaires data
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const seed = [
      { id: 1, name: "Nike Lite 710", price: 120, stock: 8, link: "/images/placeholder.jpg" },
      { id: 2, name: "Adidas Runner 300", price: 90, stock: 15, link: "/images/placeholder.jpg" },
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

function readProducts() {
  ensureDataFile();
  try {
    const txt = fs.readFileSync(DATA_FILE, "utf8");
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error("❌ products.json invalide :", e.message);
    return [];
  }
}

function writeProducts(arr) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), "utf8");
}

// Auth helpers
const USERS = [
  { id: 1, email: "admin@test.com", password: "admin", role: "admin" },
  { id: 2, email: "seller@test.com", password: "seller", role: "seller" },
  { id: 3, email: "user@test.com",  password: "user",  role: "user"  },
];

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer (.+)$/i);
  if (!m) return res.status(401).json({ error: "Missing bearer token" });
  try {
    req.user = jwt.verify(m[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// App
const app = express();
app.use(cors());
app.use(express.json());

// Statics pour images: accessible via /api/images/...
app.use("/api/images", express.static(IMAGES_DIR));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Compteur
app.get("/api/_count", (_req, res) => res.json({ count: readProducts().length }));

// Produits
app.get("/api/products", (_req, res) => res.json(readProducts()));

app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = readProducts().find(x => x.id === id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// Auth simple
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Bad credentials" });
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// Seed 500 (protégé admin)
app.post("/api/debug/seed500", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });

  const brands = ["Nike", "Adidas", "Puma", "New Balance", "Asics", "Converse", "Reebok"];
  const out = [];
  for (let i = 1; i <= 500; i++) {
    const brand = brands[i % brands.length];
    out.push({
      id: i,
      name: `${brand} Model ${i}`,
      price: 50 + (i % 150),
      stock: (i * 7) % 30,
      // IMPORTANT: lien relatif → le front préfixera par /api (via resolveImg)
      link: "/images/placeholder.jpg",
    });
  }
  writeProducts(out);
  res.json({ ok: true, count: out.length });
});

// Démarrage
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API on http://0.0.0.0:${PORT}`);
});
