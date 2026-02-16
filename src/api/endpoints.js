import { api } from "./client";

export const fetchProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get("/products/categories");
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return data;
};

export const loginRequest = async ({ username, password }) => {
  const { data } = await api.post("/auth/login", { username, password });
  return data; // usually { token: "..." }
};
