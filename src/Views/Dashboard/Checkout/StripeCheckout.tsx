import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { icons } from "@/Constants/icons";
import { useGetCart, useCreateStripeOrder } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import StripePayment from "@/components/ui/stripe-payment";
import type { ShippingPreviewSuccess, ShippingAddress } from "@/Types/types";
import { toast } from "sonner";
import { calculateTax } from "@/Constants/tax";

const StripeCheckout = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: cartData, isLoading, error } = useGetCart();
  const [shippingPreview, setShippingPreview] =
    useState<ShippingPreviewSuccess | null>(null);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(
    null
  );
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [isPaymentSessionRestored, setIsPaymentSessionRestored] =
    useState(false);
  const [storedTotals, setStoredTotals] = useState<{
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  } | null>(null);
  const createStripeOrderMutation = useCreateStripeOrder();

  useEffect(() => {
    // Load data from localStorage
    const storedPreview = localStorage.getItem("checkout_shipping_preview");
    const storedAddress = localStorage.getItem("checkout_shipping_address");

    // Check for payment session in query parameters
    const clientSecret = searchParams.get("client_secret");
    const orderIdsParam = searchParams.get("order_ids");
    const totalsParam = searchParams.get("totals");

    if (storedPreview && storedAddress) {
      setShippingPreview(JSON.parse(storedPreview));
      setShippingAddress(JSON.parse(storedAddress));

      // Check if we have a stored payment session (for page refresh handling)
      if (clientSecret && orderIdsParam) {
        setStripeClientSecret(clientSecret);
        setOrderIds(JSON.parse(orderIdsParam));
        setIsPaymentSessionRestored(true);
        
        // Restore stored totals if available
        if (totalsParam) {
          setStoredTotals(JSON.parse(totalsParam));
        }
      }
    } else {
      // If no shipping data, redirect back to shipping
      navigate("/dashboard/checkout/shipping");
      return;
    }
  }, [navigate, searchParams]);

  useEffect(() => {
    // Only create Stripe order if we don't have a restored session and we have shipping address
    if (
      shippingAddress &&
      !stripeClientSecret &&
      !createStripeOrderMutation.isPending &&
      !isPaymentSessionRestored
    ) {
      createStripeOrder();
    }
  }, [shippingAddress, isPaymentSessionRestored]);

  const createStripeOrder = async () => {
    if (!shippingAddress) return;

    try {
      const result = await createStripeOrderMutation.mutateAsync({
        payment_method: "stripe",
        delivery_address: shippingAddress,
      });

      const clientSecret = result.data.client_secret;
      const orderIds = result.data.order_ids;

      setStripeClientSecret(clientSecret);
      setOrderIds(orderIds);

      // Calculate and store totals
      const totals = calculateCartTotals();
      setStoredTotals(totals);

      // Store the payment session data in query parameters
      setSearchParams({
        client_secret: clientSecret,
        order_ids: JSON.stringify(orderIds),
        totals: JSON.stringify(totals),
      });
    } catch (error) {
      console.error("Failed to create Stripe order:", error);
      toast.error("Failed to initialize payment. Please try again.");
    }
  };

  const calculateCartTotals = () => {
    if (!cartData?.items) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };

    const subtotal = cartData.items.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );
    const shipping = shippingPreview?.data.total_shipping_fee ?? 0;

    // Get tax rate based on shipping address country (if available)
    const country = shippingAddress?.country;
    const tax = calculateTax(subtotal, country);
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const getTotals = () => {
    // If we have stored totals (from page refresh), use those
    if (storedTotals) {
      return storedTotals;
    }
    
    // Otherwise calculate from current cart data
    return calculateCartTotals();
  };

  const handlePaymentSuccess = () => {
    // Clear all checkout data from localStorage
    localStorage.removeItem("checkout_shipping_preview");
    localStorage.removeItem("checkout_shipping_address");
    localStorage.removeItem("checkout_payment_method");

    // Clear query parameters
    setSearchParams({});

    toast.success(
      `Payment successful! Your order${
        orderIds.length > 1 ? "s" : ""
      } has been placed.`
    );
    navigate("/dashboard/orders");
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const handlePaymentCancel = () => {
    // Clear payment session data from query parameters
    // setSearchParams({});
    // setStripeClientSecret(null);
    // setOrderIds([]);
    // setIsPaymentSessionRestored(false);
    setStoredTotals(null);

    // Navigate to home page since user can't change payment method
    navigate("/dashboard/home");
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Credit Card Payment
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i
            className={`${icons.spinner} text-2xl text-primary animate-spin`}
          />
        </div>
      </RFlex>
    );
  }

  if (error || !cartData || !cartData.items || cartData.items.length === 0) {
    // If we have a restored payment session, we can still proceed even with empty cart
    if (isPaymentSessionRestored && stripeClientSecret) {
      // Continue with the restored session
    } else {
      return (
        <RFlex className="flex-col h-full pb-20">
          <div className="bg-card border-b border-border p-4">
            <h1 className="text-xl font-semibold text-foreground">
              Credit Card Payment
            </h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <i className={`${icons.error} text-3xl text-red-500 mb-2`} />
              <p className="text-muted-foreground">No items in cart</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard/cart")}
                className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg"
              >
                Back to Cart
              </motion.button>
            </div>
          </div>
        </RFlex>
      );
    }
  }

  if (!shippingPreview || !shippingAddress) {
    return (
      <RFlex className="flex-col h-full pb-20">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Credit Card Payment
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i
            className={`${icons.spinner} text-2xl text-primary animate-spin`}
          />
        </div>
      </RFlex>
    );
  }

  const totals = getTotals();

  return (
    <RFlex className="flex-col h-full pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate("/dashboard/checkout/payment")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
          >
            <i className={`${icons.arrowLeft} text-muted-foreground`} />
          </motion.button>
          <h1 className="text-xl font-semibold text-foreground">
            Credit Card Payment
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {createStripeOrderMutation.isPending && !stripeClientSecret ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <i
                    className={`${icons.spinner} text-3xl text-primary animate-spin mb-4`}
                  />
                  <p className="text-muted-foreground">
                    Initializing payment...
                  </p>
                </div>
              </div>
            </motion.div>
          ) : stripeClientSecret ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Complete your payment
              </h2>
              <StripePayment
                clientSecret={stripeClientSecret}
                amount={totals.total}
                currency="USD"
                shippingAddress={shippingAddress}
                cartItems={cartData?.items || []}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="text-center">
                <i className={`${icons.error} text-3xl text-red-500 mb-4`} />
                <p className="text-muted-foreground mb-4">
                  Failed to initialize payment
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createStripeOrder}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </RFlex>
  );
};

export default StripeCheckout;
