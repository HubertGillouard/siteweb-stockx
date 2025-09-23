// --- Détection de l’API (via Nginx proxy) -----------------------------------
const ORIGIN =
  typeof window !== "undefined" && window.location && window.location.origin
    ? window.location.origin
    : "";
const API = `${ORIGIN}/api`;

// --- Outils fetch + Auth ------------------------------------------------------
function getToken() {
  try {
    return localStorage.getItem("token") || null;
  } catch {
    return null;
  }
}
function setToken(tok) {
  try {
    if (tok) localStorage.setItem("token", tok);
    else localStorage.removeItem("token");
  } catch {}
}

function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function apiFetch(path, init = {}) {
  const headers = {
    ...(init.headers || {}),
    ...authHeader(),
  };
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${msg || path}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
async function safeText(r) {
  try {
    return await r.text();
  } catch {
    return "";
  }
}

// --- Produits -----------------------------------------------------------------
export async function getProducts() {
  // /api/products → [{id, name, price, link, stock, ...}]
  return apiFetch("/products", { method: "GET" });
}

export async function getProduct(id) {
  return apiFetch(`/products/${id}`, { method: "GET" });
}

// --- Images (link => URL finale) ---------------------------------------------
export function resolveImg(link) {
  if (!link) return `${API}/images/placeholder.jpg`;
  if (link.startsWith("http://") || link.startsWith("https://")) return link;
  // tes produits ont souvent: "/images/xxx.jpg" -> servir par l'API: /api/images/xxx.jpg
  if (link.startsWith("/images/")) return `${API}${link}`;
  // fallback (rare)
  return `${API}/images/placeholder.jpg`;
}

// --- Format prix --------------------------------------------------------------
export function formatPrice(value, currency = "EUR", locale = "fr-FR") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));
  } catch {
    return `${Number(value || 0).toFixed(2)} ${currency}`;
  }
}

// --- Auth (simple) ------------------------------------------------------------
export function bootAuthFromStorage() {
  const t = getToken();
  if (!t) return null;
  try {
    const raw = localStorage.getItem("profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function login(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  // on attend { token, user? }
  if (data && data.token) setToken(data.token);
  if (data && data.user) {
    try {
      localStorage.setItem("profile", JSON.stringify(data.user));
    } catch {}
  }
  return data;
}

export function logout() {
  setToken(null);
  try {
    localStorage.removeItem("profile");
  } catch {}
  return true;
}

// --- Consentement cookies (RGPD) ---------------------------------------------
const CONSENT_KEY = "consent.v1";
export function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : { functional: true, analytics: false };
  } catch {
    return { functional: true, analytics: false };
  }
}
export function setConsent(val) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(!!val ? val : { functional: true, analytics: false }));
  } catch {}
}

// --- Panier côté front (localStorage) ----------------------------------------
const CART_KEY = "cart.v1";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items || []));
  } catch {}
}

export function getCart() {
  const items = readCart();
  // enrichir avec name/price si absent (meilleur affichage)
  return items;
}

export async function addToCart(productId, qty = 1, size) {
  const items = readCart();
  const idx = items.findIndex(
    (it) => it.productId === productId && (size ? it.size === size : !it.size)
  );
  // récupérer infos produit pour nom/prix si pas déjà connu
  let name = "Produit";
  let price = 0;
  try {
    const p = await getProduct(productId);
    name = p?.name || name;
    price = Number(p?.price || 0);
  } catch {}

  if (idx >= 0) {
    items[idx].qty = Math.max(1, Number(items[idx].qty || 1) + Number(qty || 1));
    // si le prix a été mis à jour côté API
    if (price) items[idx].price = price;
    if (name) items[idx].name = name;
  } else {
    items.push({
      productId,
      qty: Math.max(1, Number(qty || 1)),
      size,
      name,
      price,
    });
  }
  writeCart(items);
  return items;
}

export function updateCartItem(productId, qty, size) {
  const items = readCart();
  const idx = items.findIndex(
    (it) => it.productId === productId && (size ? it.size === size : !it.size)
  );
  if (idx >= 0) {
    items[idx].qty = Math.max(1, Number(qty || 1));
    writeCart(items);
  }
  return items;
}

export function removeFromCart(productId, size) {
  let items = readCart();
  items = items.filter(
    (it) => !(it.productId === productId && (size ? it.size === size : !it.size))
  );
  writeCart(items);
  return items;
}

export function clearCart() {
  writeCart([]);
  return [];
}

// --- Vendeur : mise à jour stock/prix ----------------------------------------
export async function updateStock(productId, { stock, price }) {
  // tente PATCH /products/:id (ton API Express expose souvent ce genre de route)
  try {
    const body = {};
    if (typeof stock === "number") body.stock = stock;
    if (typeof price === "number") body.price = price;

    return await apiFetch(`/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    // en démo, si l’API ne supporte pas encore: on renvoie un faux succès
    console.warn("updateStock fallback:", e?.message || e);
    return { ok: true, productId, stock, price, _fallback: true };
  }
}

// --- Checkout (paiement fictif) ----------------------------------------------
/**
 * Signature souple :
 *   - checkout({ items, payment, shipping, totals })
 *   - ou checkout(itemsArray, payment)
 * Retourne { ok, orderId, status, ... }
 */
export async function checkout(payloadOrItems, maybePayment) {
  let payload;
  if (Array.isArray(payloadOrItems)) {
    payload = {
      items: payloadOrItems,
      payment: maybePayment || { brand: "visa", last4: "4242" },
    };
  } else if (payloadOrItems && typeof payloadOrItems === "object") {
    payload = payloadOrItems;
  } else {
    payload = { items: [], payment: {} };
  }

  // 1) si ton API a une route d’orders :
  try {
    return await apiFetch("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // 2) fallback local simulé (paiement fictif)
    console.warn("checkout fallback (simulation):", e?.message || e);
    const orderId = `SIM-${Date.now()}`;
    // on vide le panier local si succès
    clearCart();
    return {
      ok: true,
      orderId,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      items: payload.items || [],
      payment: payload.payment || {},
      _fallback: true,
    };
  }
}
