import { create } from "zustand";

const getInitialState = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  return { token, refreshToken, user };
};

export const useAuthStore = create((set) => ({
  ...getInitialState(),

  setAuth: ({ token, refreshToken, user }) => {
    localStorage.setItem("token", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    set({ token, refreshToken, user });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    set({ token: null, refreshToken: null, user: null });
  },
}));
