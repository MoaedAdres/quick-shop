import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { icons } from "@/Constants/icons";
import { useGetCart } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import StripePayment from "@/components/ui/stripe-payment";
import ShippingPreviewForm from "@/components/ui/shipping-preview-form";
import type {
  ShippingPreviewSuccess,
  ShippingPreviewError,
  ShippingAddress,
} from "@/Types/types";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading, error } = useGetCart();
  const [shippingPreview, setShippingPreview] = useState<ShippingPreviewSuccess | null>(null);
  const [shippingError, setShippingError] = useState<ShippingPreviewError | null>(null);
  const [showShippingForm, setShowShippingForm] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateCartTotals = () => {
    if (!cartData?.items) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };

    const subtotal = cartData.items.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );
    const shipping = shippingPreview?.data.total_shipping_fee ?? 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handleShippingSuccess = (preview: ShippingPreviewSuccess) => {
    setShippingPreview(preview);
    setShippingError(null);
    setShowShippingForm(false);
  };

  const handleShippingError = (error: ShippingPreviewError) => {
    setShippingError(error);
    setShippingPreview(null);
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment successful! Your order has been placed.");
    // Navigate to order confirmation or orders page
    navigate("/dashboard/orders");
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const handlePaymentCancel = () => {
    navigate("/dashboard/cart");
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Checkout</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i className={`${icons.spinner} text-2xl text-primary animate-spin`} />
        </div>
      </RFlex>
    );
  }

  if (error || !cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Checkout</h1>
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

  const totals = calculateCartTotals();

  return (
    <RFlex className="flex-col h-full pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
          >
            <i className={`${icons.arrowLeft} text-muted-foreground`} />
          </motion.button>
          <h1 className="text-xl font-semibold text-foreground">Checkout</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Shipping Form */}
          <AnimatePresence>
            {showShippingForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Shipping Information
                </h2>
                <ShippingPreviewForm
                  onSuccess={(preview) => handleShippingSuccess(preview)}
                  onError={handleShippingError}
                />
              </motion.div>
            )}
          </AnimatePresence>

          
          {/* Payment Section */}
          {!showShippingForm && shippingAddress && shippingPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Payment
              </h2>
              <StripePayment
                amount={totals.total}
                currency="USD"
                shippingAddress={shippingAddress}
                cartItems={cartData.items}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            </motion.div>
          )}

          {/* Error Display */}
          {shippingError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <i className={`${icons.error} text-red-500 mr-2`} />
                <span className="text-red-700">{shippingError.message}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </RFlex>
  );
};

export default Checkout; 