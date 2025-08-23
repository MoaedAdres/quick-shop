import { motion } from "framer-motion";
import { useState } from "react";
import { icons } from "@/Constants/icons";
import { useDeleteCartItem } from "@/Api/queriesAndMutations";
import type { CartItem as CartItemType } from "@/Types/types";
import { truncateParagraph } from "@/Utils/helperFunctions";

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

const CartItem = ({ item, className = "" }: CartItemProps) => {
  const deleteCartItemMutation = useDeleteCartItem();

  // Simple inline SVG placeholder (gray background with image icon text)
  const fallbackImage: string =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="100%" height="100%" fill="#e5e7eb"/><g fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" font-size="10" text-anchor="middle"><text x="40" y="43">No Image</text></g></svg>'
    );

  const [imageSrc, setImageSrc] = useState<string>(
    item.product.image_url || fallbackImage
  );

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

  const getSupplierIcon = (supplierCode: string) => {
    switch (supplierCode) {
      case "aliexpress":
        return icons.aliexpress;
      case "printify":
        return icons.printify;
      default:
        return icons.shoppingBag;
    }
  };

  const getSupplierColor = (supplierCode: string) => {
    switch (supplierCode) {
      case "aliexpress":
        return "text-orange-500";
      case "printify":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-card rounded-lg p-4 border border-border ${className}`}
    >
      <div className="flex gap-3">
        {/* Product Image with fallback */}
        <div className="flex-shrink-0">
          <div className="w-20   h-20 rounded-md bg-muted flex items-center justify-center">
            <img
              src={imageSrc}
              alt={item.product.name}
              className="w-full h-full object-cover rounded-md"
              onError={() => setImageSrc(fallbackImage)}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
            {item.product.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <i
              className={`${getSupplierIcon(
                item.product.supplier.code
              )} ${getSupplierColor(item.product.supplier.code)}`}
            />
            <span>{item.product.supplier.name}</span>
          </div>

          {/* SKU Info */}
          {item.product.sku_attr && (
            <p
              title={item.product.sku_attr}
              className="text-xs text-muted-foreground mb-2"
            >
              SKU: {truncateParagraph(item.product.sku_attr, 20)}
            </p>
          )}

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
              {deleteCartItemMutation.isPending ? (
                <i className={`${icons.spinner} text-sm animate-spin`} />
              ) : (
                <i className={`${icons.delete} text-sm`} />
              )}
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
