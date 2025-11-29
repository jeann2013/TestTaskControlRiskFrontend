import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/useAuthStore";

export default function Login() {
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [testError, setTestError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://localhost:7179/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Credenciales inválidas");
        return;
      }

      const resClone = res.clone();
      let data;
      try {
        data = await res.json();
      } catch {
        // If not JSON, assume plain text token
        data = { token: await resClone.text() };
      }

      // Guardar token
      const token = data.Token || data.token || data.access_token || data.accessToken || data.AccessToken;
      const refreshToken = data.RefreshToken || data.refresh_token || data.refreshToken;
      console.log("Parsed token:", token);

      // Decode JWT to get role
      let role = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
        } catch (e) {
          console.error("Failed to decode token:", e);
        }
      }

      setAuth({ token, refreshToken, user: data.user, role });

      // Redirigir
      window.location.href = "/tasks";
    } catch (error) {
      alert("Error de conexión. Verifica que el backend esté ejecutándose.");
    }
  };

  if (testError) {
    throw new Error("Test error from Login");
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-center">
          Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  );
}
