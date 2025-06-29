import { motion, AnimatePresence } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useGetCart } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import CartItem from "@/components/ui/cart-item";

const Cart = () => {
  const { data: cartData, isLoading, error } = useGetCart();
  const cart = cartData?.data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateCartTotals = () => {
    if (!cart?.items) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    
    const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handleCheckout = () => {
    // Handle checkout logic
    console.log("Proceeding to checkout...");
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Shopping Cart</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i className={`${icons.spinner} text-2xl text-primary`} />
        </div>
      </RFlex>
    );
  }

  if (error) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Shopping Cart</h1>
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

  if (!cart || cart.items.length === 0) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Shopping Cart</h1>
        </div>

        {/* Empty Cart */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
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
          <h1 className="text-xl font-semibold text-foreground">Shopping Cart</h1>
          <span className="text-sm text-muted-foreground">
            {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}
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
      <div className="bg-card border-t border-border p-4 space-y-4">
        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground">
              {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">{formatPrice(totals.tax)}</span>
          </div>
          <div className="border-t border-border pt-2">
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{formatPrice(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {totals.subtotal < 50 && (
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