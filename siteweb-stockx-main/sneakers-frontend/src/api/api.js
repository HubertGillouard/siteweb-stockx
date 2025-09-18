import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000" });

// Gestion du token
export const setToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

// AUTH
export const login = (data) => API.post("/login", data);
export const register = (data) => API.post("/register", data);

// PRODUITS
export const getProducts = () => API.get("/products");
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (product) => API.post("/products", product);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// IMAGES
export const getImages = (productId) => API.get(`/images/${productId}`);

// COMMANDES
export const createOrder = (data) => API.post("/orders", data);

// PAIEMENTS
export const createPayment = (data) => API.post("/payments", data);

export default API;
