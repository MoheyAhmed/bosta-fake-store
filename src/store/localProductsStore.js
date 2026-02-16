import { create } from "zustand";

const STORAGE_KEY = "bosta_local_products_v1";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const useLocalProductsStore = create((set, get) => ({
  localProducts: load(),

  addLocalProduct: (p) => {
    const prev = get().localProducts || [];
    if (prev.some((x) => String(x.id) === String(p.id))) return;
    const next = [p, ...prev];
    save(next);
    set({ localProducts: next });
  },

  getLocalProductById: (id) => {
    const list = get().localProducts || [];
    return list.find((p) => String(p.id) === String(id)) || null;
  },

  clearLocalProducts: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ localProducts: [] });
  },
}));
