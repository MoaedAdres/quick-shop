import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useDeleteCartItem } from "@/Api/queriesAndMutations";
import type { CartItem as CartItemType } from "@/Types/types";

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

const CartItem = ({ item, className = "" }: CartItemProps) => {
  const deleteCartItemMutation = useDeleteCartItem();

  const handleRemove = () => {
    deleteCartItemMutation.mutate(item.id);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price));
  };

  const calculateTotalPrice = () => {
    return parseFloat(item.product.price) * item.quantity;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-card rounded-lg p-4 border border-border ${className}`}
    >
      <div className="flex gap-3">
        {/* Product Image - Using a placeholder since API doesn't provide image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
            <i className={`${icons.shoppingBag} text-2xl text-muted-foreground`} />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
            {item.product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            {item.product.supplier.name}
          </p>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-primary">
              {formatPrice(item.product.price)}
            </span>
          </div>

          {/* Quantity Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Qty:</span>
              <span className="w-8 text-center text-sm font-medium text-foreground">
                {item.quantity}
              </span>
            </div>

            {/* Remove Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              disabled={deleteCartItemMutation.isPending}
              className="text-red-500 hover:text-red-600 p-1 disabled:opacity-50"
            >
              <i className={`${icons.delete} text-sm`} />
            </motion.button>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex-shrink-0 text-right">
          <div className="font-semibold text-primary">
            {formatPrice(calculateTotalPrice().toString())}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem; 