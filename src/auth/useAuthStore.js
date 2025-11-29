import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  refreshToken: null,
  user: null,

  setAuth: ({ token, refreshToken, user }) =>
    set({ token, refreshToken, user }),

  setToken: (token) => set({ token }),

  logout: () => set({ token: null, refreshToken: null, user: null }),
}));
