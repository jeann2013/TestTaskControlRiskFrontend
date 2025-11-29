import { create } from "zustand";

const getInitialState = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const role = localStorage.getItem("role");
  return { token, refreshToken, user, role };
};

export const useAuthStore = create((set) => ({
  ...getInitialState(),

  setAuth: ({ token, refreshToken, user, role }) => {
    localStorage.setItem("token", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    if (role) localStorage.setItem("role", role);
    set({ token, refreshToken, user, role });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    set({ token: null, refreshToken: null, user: null, role: null });
  },
}));
