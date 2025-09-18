import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api" });

// Produits
export const getProducts = () => API.get("/products");
export const getProduct = (id) => API.get(`/products/${id}`);
export const getImages = (productId) => API.get(`/images/${productId}`);
export const createProduct = (data) => API.post("/products", data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Auth
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// Commandes
export const createOrder = (data) => API.post("/orders", data);

// Paiements
export const createPayment = (data) => API.post("/payments", data);

export default API;
