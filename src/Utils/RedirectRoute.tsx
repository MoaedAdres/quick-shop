import { Navigate } from "react-router-dom";

const RedirectRoute = () => {
  return <Navigate to="/dashboard/home" replace />;
};

export default RedirectRoute;
