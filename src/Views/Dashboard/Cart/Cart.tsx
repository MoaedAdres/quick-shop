import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useGetCart } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import CartItem from "@/components/ui/cart-item";
import ShippingPreviewForm from "@/components/ui/shipping-preview-form";
import type {
  ShippingPreviewSuccess,
  ShippingPreviewError,
} from "@/Types/types";

const Cart = () => {
  const { data: cartData, isLoading, error } = useGetCart();
  const cart = cartData;
  const [shippingPreview, setShippingPreview] =
    useState<ShippingPreviewSuccess | null>(null);
  const [shippingError, setShippingError] =
    useState<ShippingPreviewError | null>(null);
  const [showShippingForm, setShowShippingForm] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateCartTotals = () => {
    if (!cart?.items) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };

    const subtotal = cart.items.reduce(
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

  const handleCheckout = () => {
    if (!shippingPreview) {
      setShowShippingForm(true);
      return;
    }
    // Handle checkout logic
    console.log("Proceeding to checkout...");
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Shopping Cart
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

  if (error) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Shopping Cart
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className={`${icons.error} text-3xl text-red-500 mb-2`} />
            <p className="text-muted-foreground">Failed to load cart</p>
          </div>
        </div>
      </RFlex>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Shopping Cart
          </h1>
        </div>

        {/* Empty Cart */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className={`${icons.cart} text-3xl text-muted-foreground`} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to add items to your cart
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        </div>
      </RFlex>
    );
  }

  const totals = calculateCartTotals();

  return (
    <RFlex className="flex-col h-full pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            Shopping Cart
          </h1>
          <span className="text-sm text-muted-foreground">
            {cart.items.length} item{cart.items.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <AnimatePresence>
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="border-t border-border p-4 space-y-4">
        {/* Shipping Error */}
        {shippingError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
          >
            <h3 className="text-red-700 font-medium mb-2">
              Shipping Not Available
            </h3>
            <p className="text-red-600 text-sm mb-3">{shippingError.message}</p>
            <div className="space-y-2">
              {shippingError.data.unshippable_products.map((item) => (
                <div key={item.id} className="text-sm text-red-600">
                  • {item.product.name}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Shipping Preview */}
        {shippingPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
          >
            <h3 className="text-green-700 font-medium mb-2">
              Shipping Information
            </h3>
            <div className="space-y-2 text-sm text-green-600">
              <p>
                Estimated Delivery:{" "}
                {shippingPreview.data.estimated_delivery_min_days}-
                {shippingPreview.data.estimated_delivery_max_days} days
              </p>
              <p>
                Shipping Companies:{" "}
                {shippingPreview.data.shipping_companies.join(", ")}
              </p>
              <p>
                Shipping Fee:{" "}
                {formatPrice(shippingPreview.data.total_shipping_fee)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Shipping Form */}
        {showShippingForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-lg p-4 mb-4"
          >
            <h3 className="font-medium mb-4">Enter Shipping Details</h3>
            <ShippingPreviewForm
              onSuccess={handleShippingSuccess}
              onError={handleShippingError}
            />
          </motion.div>
        )}

        {/* Cart Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">{formatPrice(totals.shipping)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (8%)</span>
            <span className="font-medium">{formatPrice(totals.tax)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">{formatPrice(totals.total)}</span>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {totals.subtotal < 50 && !shippingPreview && (
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <i className={`${icons.truck} text-primary`} />
              <span className="text-sm font-medium text-foreground">
                Free shipping on orders over $50
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(totals.subtotal / 50) * 100}%` }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Add {formatPrice(50 - totals.subtotal)} more for free shipping
            </p>
          </div>
        )}

        {/* Checkout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckout}
          className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg"
        >
          {!shippingPreview
            ? "Calculate Shipping"
            : `Checkout - ${formatPrice(totals.total)}`}
        </motion.button>

        {/* Continue Shopping */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.history.back()}
          className="w-full bg-muted text-muted-foreground py-3 rounded-lg font-medium"
        >
          Continue Shopping
        </motion.button>
      </div>
    </RFlex>
  );
};

export default Cart;
