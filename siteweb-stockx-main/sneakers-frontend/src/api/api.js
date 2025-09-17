import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000" });

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

export default API;
