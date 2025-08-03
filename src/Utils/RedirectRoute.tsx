import { useAuthStore } from "@/Stores/auth.store";
import { Navigate } from "react-router-dom";

const RedirectRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return (
    <Navigate
      to={`${isAuthenticated ? "/dashboard/home" : "login"}`}
      replace
    />
  );
};

export default RedirectRoute;
