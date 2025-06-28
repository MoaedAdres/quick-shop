import { useAuthStore } from "@/Stores/auth.store";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { isAuthenticated, isTelegramApp } = useAuthStore();
  // For Telegram Mini App, always allow access if it's a Telegram app
  // For regular web app, check authentication
  const shouldAllow = isTelegramApp || isAuthenticated;
  return shouldAllow ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
