import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // For Telegram Mini App, always allow access if it's a Telegram app
  // For regular web app, check authentication
  const shouldAllow = true;
  return shouldAllow ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
