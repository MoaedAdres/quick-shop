import { useAuthStore } from "@/Stores/auth.store";
import { Navigate } from "react-router-dom";

const RedirectRoute = () => {
  console.log("redirect   ");
  const token = useAuthStore().token;
  const isAuthenticated = token ? true : true;
  return (
    <Navigate
      to={`${isAuthenticated ? "/dashboard" : "login"}`}
      replace
    />
  );
};

export default RedirectRoute;
