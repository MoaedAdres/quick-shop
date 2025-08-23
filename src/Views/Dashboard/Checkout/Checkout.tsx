import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new shipping flow
    navigate("/dashboard/checkout/shipping", { replace: true });
  }, [navigate]);

  return null;
};

export default Checkout;
