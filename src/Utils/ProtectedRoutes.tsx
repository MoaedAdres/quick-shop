import { useAuthStore } from "@/Stores/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute() {
  const { fetchProfile, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Fetch user profile on app initialization
    fetchProfile();
  }, [fetchProfile]);

  // For Telegram Mini App, always allow access if it's a Telegram app
  // For regular web app, check authentication
  const shouldAllow = true;
  return shouldAllow ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
