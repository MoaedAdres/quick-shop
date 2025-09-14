import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { icons } from "@/Constants/icons";
import {
  useGetCart,
  useCreateStripeOrder,
  useCreateCryptoOrder,
} from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import ShippingPreviewForm from "@/components/ui/shipping-preview-form";
import OrderSummaryModal from "@/components/ui/order-summary-modal";
import type {
  ShippingPreviewSuccess,
  ShippingAddress,
  UnshippableProduct,
} from "@/Types/types";
import { toast } from "sonner";

const Shipping = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading, error } = useGetCart();
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [shippingPreview, setShippingPreview] =
    useState<ShippingPreviewSuccess | null>(null);
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorData, setErrorData] = useState<{
    unshippable_products: UnshippableProduct[];
  } | null>(null);
  const createStripeOrderMutation = useCreateStripeOrder();
  const createCryptoOrderMutation = useCreateCryptoOrder();

  const handleShippingSuccess = (preview: ShippingPreviewSuccess) => {
    console.log("preview", preview);
    setShippingPreview(preview);
    setShowOrderSummaryModal(true);
  };

  const handleShippingError = (error: any) => {
    console.log("error1234", error);

    // Check if it's an Axios error with response data
    if (
      error.response?.data?.data &&
      "unshippable_products" in error.response.data.data
    ) {
      setErrorData(
        error.response.data.data as {
          unshippable_products: UnshippableProduct[];
        }
      );
      setShowErrorModal(true);
    } else {
      // Fallback error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Some items are out of stock or not available in your area";
      toast.error(errorMessage);
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
    // const country = shippingAddress?.country;
    const tax = 0
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handleOrderSummaryContinue = () => {
    if (!shippingAddress) return;

    // Store shipping data in localStorage for next steps
    localStorage.setItem(
      "checkout_shipping_preview",
      JSON.stringify(shippingPreview)
    );
    localStorage.setItem(
      "checkout_shipping_address",
      JSON.stringify(shippingAddress)
    );

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
          <h1 className="text-xl font-semibold text-foreground">
            Shipping Information
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
    return (
      <RFlex className="flex-col h-full pb-20">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Shipping Information
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
          <h1 className="text-xl font-semibold text-foreground">
            Shipping Information
          </h1>
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
          isLoading={
            createStripeOrderMutation.isPending ||
            createCryptoOrderMutation.isPending
          }
        />
      )}

      {/* Error Modal */}
      {showErrorModal && errorData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          onClick={() => setShowErrorModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <i className={`${icons.error} text-red-600 text-lg`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Shipping Issues Found
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Some items cannot be shipped to your address
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <i className={`${icons.close} text-muted-foreground`} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The following items cannot be shipped to your address or are
                  out of stock. Please remove them from your cart to continue.
                </p>

                <div className="space-y-3">
                  {errorData.unshippable_products.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-muted/30 rounded-lg p-4 border border-red-200"
                    >
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product.product.image_url ? (
                            <img
                              src={item.product.product.image_url}
                              alt={item.product.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <i
                              className={`${icons.shoppingBag} text-muted-foreground`}
                            />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                            {item.product.product.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>Qty: {item.product.quantity}</span>
                            <span>•</span>
                            <span>
                              $
                              {parseFloat(item.product.product.price).toFixed(
                                2
                              )}
                            </span>
                          </div>

                          {/* Error Reason */}
                          <div className="flex items-start gap-2">
                            <i
                              className={`${icons.error} text-red-500 text-xs mt-0.5`}
                            />
                            <span className="text-xs text-red-600 font-medium">
                              {item.reason}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/dashboard/cart")}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium"
              >
                Go to Cart to Remove Items
              </motion.button>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </RFlex>
  );
};

export default Shipping;
