import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { icons } from "@/Constants/icons";
import { useGetCart, useCreateStripeOrder } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import StripePayment from "@/components/ui/stripe-payment";
import ShippingPreviewForm from "@/components/ui/shipping-preview-form";
import OrderSummaryModal from "@/components/ui/order-summary-modal";
import type {
  ShippingPreviewSuccess,
  ShippingPreviewError,
  ShippingAddress,
} from "@/Types/types";
import { toast } from "sonner";
import { calculateTax } from "@/Constants/tax";

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading, error } = useGetCart();
  const [shippingPreview, setShippingPreview] =
    useState<ShippingPreviewSuccess | null>(null);
  const [showShippingForm, setShowShippingForm] = useState(true);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [orderIds, setOrderIds] = useState<string[]>([]);

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(price);
  // };

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

  const handleShippingSuccess = (preview: ShippingPreviewSuccess) => {
    console.log("preview", preview);
    setShippingPreview(preview);
    setShowOrderSummaryModal(true);
  };

  const handleShippingError = (error: ShippingPreviewError) => {
    setShippingPreview(null);
    toast.error(error.message ?? "error when shipping preview");
  };

  const handlePaymentSuccess = () => {
    toast.success(`Payment successful! Your order${orderIds.length > 1 ? 's' : ''} has been placed.`);
    // Navigate to order confirmation or orders page
    navigate("/dashboard/orders");
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const handlePaymentCancel = () => {
    navigate("/dashboard/cart");
  };

  const createStripeOrderMutation = useCreateStripeOrder();

  const handleOrderSummaryContinue = async () => {
    if (!shippingAddress) return;

    try {
      const result = await createStripeOrderMutation.mutateAsync({
        payment_method: "stripe",
        delivery_address: shippingAddress,
      });

      setStripeClientSecret(result.data.client_secret);
      setOrderIds(result.data.order_ids);
      setShowOrderSummaryModal(false);
      setShowShippingForm(false);
      setShowPaymentForm(true);
    } catch (error) {
      console.error("Failed to create Stripe order:", error);
      toast.error("Failed to initialize payment. Please try again.");
    }
  };

  const handleOrderSummaryBack = () => {
    setShowOrderSummaryModal(false);
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Checkout</h1>
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
                  setShippingAddress={setShippingAddress}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Section */}
          {showPaymentForm && stripeClientSecret && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Payment
              </h2>
              <StripePayment
                clientSecret={stripeClientSecret}
                amount={totals.total}
                currency="USD"
                shippingAddress={shippingAddress!}
                cartItems={cartData.items}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Order Summary Modal */}
      {shippingPreview && shippingAddress && cartData && (
        <OrderSummaryModal
          isOpen={showOrderSummaryModal}
          onClose={handleOrderSummaryBack}
          onContinue={handleOrderSummaryContinue}
          shippingPreview={shippingPreview}
          shippingAddress={shippingAddress}
          cartItems={cartData.items}
          totals={totals}
          isLoading={createStripeOrderMutation.isPending}
        />
      )}
    </RFlex>
  );
};

export default Checkout;
