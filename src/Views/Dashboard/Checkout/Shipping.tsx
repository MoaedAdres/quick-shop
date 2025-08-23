import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { icons } from "@/Constants/icons";
import { useGetCart, useCreateStripeOrder, useCreateCryptoOrder } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import ShippingPreviewForm from "@/components/ui/shipping-preview-form";
import OrderSummaryModal from "@/components/ui/order-summary-modal";
import type {
  ShippingPreviewSuccess,
  ShippingPreviewError,
  ShippingAddress,
} from "@/Types/types";
import { toast } from "sonner";
import { calculateTax } from "@/Constants/tax";

const Shipping = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading, error } = useGetCart();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [shippingPreview, setShippingPreview] = useState<ShippingPreviewSuccess | null>(null);
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  const createStripeOrderMutation = useCreateStripeOrder();
  const createCryptoOrderMutation = useCreateCryptoOrder();

  const handleShippingSuccess = (preview: ShippingPreviewSuccess) => {
    console.log("preview", preview);
    setShippingPreview(preview);
    setShowOrderSummaryModal(true);
  };

  const handleShippingError = (_: ShippingPreviewError) => {
    toast.error("Some items are out of stock or not available in your area");
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

  const handleOrderSummaryContinue = () => {
    if (!shippingAddress) return;

    // Store shipping data in localStorage for next steps
    localStorage.setItem('checkout_shipping_preview', JSON.stringify(shippingPreview));
    localStorage.setItem('checkout_shipping_address', JSON.stringify(shippingAddress));
    
    setShowOrderSummaryModal(false);
    navigate("/dashboard/checkout/payment");
  };

  const handleOrderSummaryBack = () => {
    setShowOrderSummaryModal(false);
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Shipping Information</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i className={`${icons.spinner} text-2xl text-primary animate-spin`} />
        </div>
      </RFlex>
    );
  }

  if (error || !cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <RFlex className="flex-col h-full pb-20">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Shipping Information</h1>
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

  return (
    <RFlex className="flex-col h-full pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate("/dashboard/cart")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
          >
            <i className={`${icons.arrowLeft} text-muted-foreground`} />
          </motion.button>
          <h1 className="text-xl font-semibold text-foreground">Shipping Information</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Enter your shipping details
            </h2>
            <ShippingPreviewForm
              onSuccess={handleShippingSuccess}
              onError={handleShippingError}
              setShippingAddress={setShippingAddress}
            />
          </motion.div>
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
          totals={calculateCartTotals()}
          isLoading={createStripeOrderMutation.isPending || createCryptoOrderMutation.isPending}
        />
      )}
    </RFlex>
  );
};

export default Shipping;
