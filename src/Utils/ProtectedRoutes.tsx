import { useAuthStore } from "@/Stores/auth.store";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = useAuthStore().token;
  const isAuthenticated = token ? true : true;
  return isAuthenticated ? <Outlet /> : <Navigate to="login" replace />;
}

export default ProtectedRoute;
