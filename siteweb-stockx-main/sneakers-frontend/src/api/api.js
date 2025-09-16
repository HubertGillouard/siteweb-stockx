import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// ===== PRODUCTS =====
export const getProducts = () => API.get("/products");
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ===== VARIANTES =====
export const getVariants = (productId) => API.get(`/products/${productId}/variants`);
export const createVariant = (productId, data) => API.post(`/products/${productId}/variants`, data);
export const updateVariant = (id, data) => API.put(`/variants/${id}`, data);
export const deleteVariant = (id) => API.delete(`/variants/${id}`);

// ===== MARQUES =====
export const getBrands = () => API.get("/brands");
export const createBrand = (data) => API.post("/brands", data);

// ===== CATEGORIES =====
export const getCategories = () => API.get("/categories");
export const createCategory = (data) => API.post("/categories", data);

// ===== IMAGES =====
export const getImages = (productId) => API.get(`/products/${productId}/images`);
export const addImage = (productId, data) => API.post(`/products/${productId}/images`, data);
export const deleteImage = (id) => API.delete(`/images/${id}`);


