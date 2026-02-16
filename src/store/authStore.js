import { create } from "zustand";

const STORAGE_KEY = "bosta_auth_v1";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const save = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const useAuthStore = create((set, get) => ({
  user: load()?.user ?? null,          // { username }
  token: load()?.token ?? null,

  isAuthed: () => Boolean(get().token),

  login: ({ username, token }) => {
    const next = { user: { username }, token };
    save(next);
    set(next);
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, token: null });
  },
}));
