import axios from "axios";

const API = axios.create({ 
  baseURL: "http://localhost:4001" // <-- ton backend
});

export const getProducts = () => API.get("/products");
export const getProduct = (id) => API.get(`/products/${id}`);
export default API;
