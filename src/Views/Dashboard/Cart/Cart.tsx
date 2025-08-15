import { motion, AnimatePresence } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useGetCart } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import CartItem from "@/components/ui/cart-item";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { data: cartData, isLoading, error } = useGetCart();
  const cart = cartData;
  const navigate = useNavigate();
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
    const tax = subtotal;
    const total = subtotal;

    return { subtotal, tax, total };
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20">
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
      <RFlex className="flex-col h-full pb-20">
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
      <RFlex className="flex-col h-full pb-20">
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
    <RFlex className="flex-col h-full pb-20">
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
        {/* Shipping Preview */}
        {/* {shippingPreview && (
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
        )} */}

        {/* Shipping Form */}

        {/* Cart Totals */}
        <div className="flex justify-between text-base font-semibold pt-2  border-border">
          <span>Total</span>
          <span className="text-primary">{formatPrice(totals.total)}</span>
        </div>

        {/* Checkout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard/checkout")}
          className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg"
        >
          Checkout - {formatPrice(totals.total)}
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
