import axios from "axios";
import { useAuthStore } from "../auth/useAuthStore";

const api = axios.create({
  baseURL: "https://localhost:7179",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh token automático
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const { refreshToken, setToken } = useAuthStore.getState();

      try {
        const { data } = await axios.post("https://localhost:7179/auth/refresh", {
          refreshToken,
        });

        setToken(data.token);
        err.config.headers.Authorization = `Bearer ${data.token}`;
        return api(err.config);
      } catch {
        useAuthStore.getState().logout();
      }
    }

    throw err;
  }
);

export default api;
