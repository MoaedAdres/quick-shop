import { Navigate } from "react-router-dom";

const RedirectRoute = () => {
  // const token = useAuthStore().token;
  const isAuthenticated = true;
  return (
    <Navigate
      to={`${isAuthenticated ? "/dashboard/home" : "login"}`}
      replace
    />
  );
};

export default RedirectRoute;
