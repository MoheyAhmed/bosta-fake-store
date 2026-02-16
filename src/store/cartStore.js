import { create } from "zustand";

const STORAGE_KEY = "bosta_cart_v1";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: {} };
  } catch {
    return { items: {} };
  }
};
const save = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

/**
 * items map:
 *  { [productId]: { product, quantity } }
 */
export const useCartStore = create((set, get) => ({
  items: load().items,

  addToCart: (product, qty = 1) => {
    const items = { ...get().items };
    const id = String(product.id);
    const current = items[id]?.quantity ?? 0;
    items[id] = { product, quantity: current + qty };
    save({ items });
    set({ items });
  },

  removeFromCart: (productId) => {
    const id = String(productId);
    const items = { ...get().items };
    delete items[id];
    save({ items });
    set({ items });
  },

  setQuantity: (productId, quantity) => {
    const id = String(productId);
    const items = { ...get().items };
    if (!items[id]) return;
    const q = Math.max(1, Number(quantity) || 1);
    items[id] = { ...items[id], quantity: q };
    save({ items });
    set({ items });
  },

  clear: () => {
    save({ items: {} });
    set({ items: {} });
  },

  getCartList: () => Object.values(get().items),

  getTotal: () => {
    const list = Object.values(get().items);
    return list.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  },

  getCount: () => {
    const list = Object.values(get().items);
    return list.reduce((sum, it) => sum + it.quantity, 0);
  },
}));
