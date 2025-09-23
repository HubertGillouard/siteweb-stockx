import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";

// ⬇️ On n'utilise que des fonctions APi sûres ici
import {
  getProducts,
  getProduct,
  updateStock,
  resolveImg,
  formatPrice,
  login as apiLogin,
  logout as apiLogout,
  bootAuthFromStorage,
  checkout as apiCheckout,
  getConsent,
  setConsent,
} from "./api/index.js";

/* ---------- UI simples ---------- */
function Header({ cartCount, user, onLogout }) {
  return (
    <header
      style={{
        padding: "12px 16px",
        display: "flex",
        gap: 16,
        alignItems: "center",
        borderBottom: "1px solid #eee",
      }}
    >
      <Link to="/" style={{ fontWeight: 700, textDecoration: "none" }}>
        Sneakers Shop
      </Link>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/catalog">Catalogue</Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/seller">Seller</Link>
        <Link to="/legal">RGPD</Link>
      </nav>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        <Link to="/cart">Panier ({cartCount})</Link>
        {user ? (
          <>
            <span>Bonjour, {user.email} ({user.role})</span>
            <button onClick={onLogout}>Se déconnecter</button>
          </>
        ) : (
          <Link to="/login">Se connecter</Link>
        )}
      </div>
    </header>
  );
}

function CookieBannerInline() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      const c = getConsent();
      if (!c) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 9999,
        background: "#111",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 12,
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <span>
        Nous utilisons des cookies pour améliorer votre expérience.{" "}
        <Link to="/legal" style={{ color: "#9cf" }}>
          En savoir plus
        </Link>
      </span>
      <button
        onClick={() => {
          setConsent(true);
          setVisible(false);
        }}
      >
        Accepter
      </button>
      <button
        onClick={() => {
          setConsent(false);
          setVisible(false);
        }}
      >
        Refuser
      </button>
    </div>
  );
}

/* ---------- Pages ---------- */

function Home() {
  const [prods, setProds] = useState([]);
  useEffect(() => {
    getProducts({ limit: 12 }).then(setProds).catch(console.error);
  }, []);
  return (
    <div style={{ padding: 16 }}>
      <h1>Bienvenue 👟</h1>
      <p>Les meilleures sneakers, au meilleur prix.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {prods.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            style={{
              display: "block",
              border: "1px solid #eee",
              borderRadius: 12,
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src={resolveImg(p.link)}
              alt={p.name}
              style={{ width: "100%", height: 150, objectFit: "cover" }}
              onError={(e) => (e.currentTarget.src = "/api/images/placeholder.jpg")}
            />
            <div style={{ padding: 8 }}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ opacity: 0.7 }}>{formatPrice(p.price || 99)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Catalog() {
  const [prods, setProds] = useState([]);
  useEffect(() => {
    getProducts().then(setProds).catch(console.error);
  }, []);
  return (
    <div style={{ padding: 16 }}>
      <h1>Catalogue</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {prods.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Link to={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <img
                src={resolveImg(p.link)}
                alt={p.name}
                style={{ width: "100%", height: 160, objectFit: "cover" }}
                onError={(e) => (e.currentTarget.src = "/api/images/placeholder.jpg")}
              />
              <div style={{ padding: 10 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ opacity: 0.7 }}>{formatPrice(p.price || 99)}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  useEffect(() => {
    getProduct(id).then(setP).catch(console.error);
  }, [id]);
  if (!p) return <div style={{ padding: 16 }}>Chargement…</div>;
  return (
    <div style={{ padding: 16 }}>
      <h1>{p.name}</h1>
      <img
        src={resolveImg(p.link)}
        alt={p.name}
        style={{ width: 420, maxWidth: "100%", borderRadius: 12 }}
        onError={(e) => (e.currentTarget.src = "/api/images/placeholder.jpg")}
      />
      <p style={{ fontSize: 18, marginTop: 8 }}>{formatPrice(p.price || 99)}</p>
      <p>Catégorie: {p.category || "N/A"}</p>
      <p>Tailles: {(p.sizes || ["40", "41", "42"]).join(", ")}</p>
    </div>
  );
}

function Login({ onLogin }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");

  return (
    <div style={{ padding: 16, maxWidth: 360 }}>
      <h1>Connexion</h1>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
      <label>Mot de passe</label>
      <input
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%" }}
      />
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button
        onClick={async () => {
          try {
            const u = await apiLogin(email, password);
            onLogin(u);
            nav("/");
          } catch (e) {
            setError("Identifiants invalides");
            console.error(e);
          }
        }}
      >
        Se connecter
      </button>
    </div>
  );
}

function AdminPage({ user }) {
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return (
    <div style={{ padding: 16 }}>
      <h1>Admin</h1>
      <ul>
        <li>Vision globale des stocks</li>
        <li>Gestion des utilisateurs</li>
        <li>Paramètres & RGPD</li>
      </ul>
      <p>(Démo : à compléter selon le cahier des charges.)</p>
    </div>
  );
}

function SellerPage({ user }) {
  const [prods, setProds] = useState([]);
  if (!user || (user.role !== "seller" && user.role !== "admin"))
    return <Navigate to="/login" replace />;

  useEffect(() => {
    getProducts().then(setProds).catch(console.error);
  }, []);

  async function bump(id) {
    try {
      const p = prods.find((x) => x.id === id);
      const next = (p?.stock || 0) + 1;
      const updated = await updateStock(id, next);
      setProds((arr) => arr.map((x) => (x.id === id ? { ...x, stock: updated.stock } : x)));
    } catch (e) {
      alert("Maj stock échouée");
      console.error(e);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Seller</h1>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Produit</th>
            <th>Stock</th>
            <th>+1</th>
          </tr>
        </thead>
        <tbody>
          {prods.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 6 }}>
                <Link to={`/product/${p.id}`}>{p.name}</Link>
              </td>
              <td style={{ textAlign: "center" }}>{p.stock ?? 0}</td>
              <td style={{ textAlign: "center" }}>
                <button onClick={() => bump(p.id)}>+1</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>(Démo : mise à jour unitaire du stock via API.)</p>
    </div>
  );
}

function Checkout() {
  const [email, setEmail] = useState("client@test.com");
  const [status, setStatus] = useState("");

  async function pay() {
    try {
      const result = await apiCheckout({
        items: [], // démo, à rattacher au vrai panier
        email,
        consent: getConsent() === true,
      });
      setStatus(`Commande ${result.orderId} confirmée ✅ (fake)`);
    } catch (e) {
      setStatus("Paiement refusé ❌");
      console.error(e);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Checkout (démo)</h1>
      <label>Email de confirmation</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <div style={{ marginTop: 8 }}>
        <button onClick={pay}>Payer</button>
      </div>
      {status && <p style={{ marginTop: 8 }}>{status}</p>}
    </div>
  );
}

function Legal() {
  return (
    <div style={{ padding: 16 }}>
      <h1>RGPD & Confidentialité</h1>
      <p>Politique de confidentialité, consentement cookies, gestion des données, etc.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 16 }}>
      <h1>404</h1>
      <p>Page introuvable.</p>
    </div>
  );
}

/* ---------- App racine (sans providers externes) ---------- */

export default function App() {
  // Auth légère côté client (basée sur l’API fournie)
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const u = bootAuthFromStorage();
      if (u) setUser(u);
    } catch {
      // ignore
    }
  }, []);

  // Panier ultra-simple (compteur uniquement pour le header, à étoffer)
  const [cartCount] = useState(0);

  const onLogout = () => {
    try {
      apiLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <BrowserRouter>
      <CookieBannerInline />
      <Header cartCount={cartCount} user={user} onLogout={onLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/admin" element={<AdminPage user={user} />} />
        <Route path="/seller" element={<SellerPage user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
