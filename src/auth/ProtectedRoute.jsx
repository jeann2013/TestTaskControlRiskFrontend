import { useAuthStore } from "./useAuthStore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
}
