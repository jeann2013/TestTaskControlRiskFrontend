import { useAuthStore } from "../auth/useAuthStore";

export default function useApi() {
  const { token, refreshToken, setToken, setAuth, logout } = useAuthStore();

  const request = async (url: string, options: RequestInit = {}, isRetry = false) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && !isRetry && refreshToken) {
      // Try to refresh token
      try {
        const refreshRes = await fetch("https://localhost:7179/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setAuth({ token: refreshData.accessToken, refreshToken: refreshData.refreshToken, user: null });
          // Retry the original request with new token
          return request(url, options, true);
        }
      } catch (error) {
        console.error("Refresh failed", error);
      }

      // If refresh fails, logout
      alert("Session expired. Please login again.");
      logout();
      window.location.href = "/";
      return res; // Return the 401 response
    }

    if (res.status === 401 && !refreshToken) {
      alert("Session expired. Please login again.");
      logout();
      window.location.href = "/";
    }

    return res;
  };

  return { request };
}
