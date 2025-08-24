import { useAuthStore } from "@/Stores/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute() {
  const {
    fetchProfile,
    isAuthenticated,
    isTelegramApp,
    isLoading,
    profileFetched,
  } = useAuthStore();

  useEffect(() => {
    // Only fetch profile if it hasn't been fetched yet, user is authenticated, and not currently loading
    if (isAuthenticated && !profileFetched && !isLoading) {
      fetchProfile();
    }
  }, [fetchProfile, isAuthenticated, profileFetched, isLoading]);

  // For Telegram Mini App, always allow access if it's a Telegram app
  // For regular web app, check authentication
  const shouldAllow = isAuthenticated || isTelegramApp;
  return shouldAllow ? <Outlet /> : <Navigate to="/dashboard/home" replace />;
}

export default ProtectedRoute;
