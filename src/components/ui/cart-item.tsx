import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useCartStore } from "@/Stores/cart.store";
import type { CartItem as CartItemType } from "@/Types/types";

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

const CartItem = ({ item, className = "" }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-card rounded-lg p-4 border border-border ${className}`}
    >
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-16 h-16 rounded-md object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
            {item.product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            {item.product.category}
          </p>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-primary">
              {formatPrice(item.price)}
            </span>
            {item.product.originalPrice && item.product.originalPrice > item.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(item.product.originalPrice)}
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className={`${icons.remove} text-xs`} />
              </motion.button>
              
              <span className="w-8 text-center text-sm font-medium text-foreground">
                {item.quantity}
              </span>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.product.stockCount}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className={`${icons.add} text-xs`} />
              </motion.button>
            </div>

            {/* Remove Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="text-red-500 hover:text-red-600 p-1"
            >
              <i className={`${icons.delete} text-sm`} />
            </motion.button>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex-shrink-0 text-right">
          <div className="font-semibold text-primary">
            {formatPrice(item.totalPrice)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem; 