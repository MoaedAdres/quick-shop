import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useCartStore } from "@/Stores/cart.store";
import type { Product } from "@/Types/types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  const { addToCart } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(product);
    
    // Reset animation state after a short delay
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={i} className={`${icons.star} text-yellow-400 text-xs`} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className={`${icons.starHalf} text-yellow-400 text-xs`} />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className={`${icons.star} text-gray-300 text-xs`} />
      );
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        
        {/* Sale Badge */}
        {product.isOnSale && product.discountPercentage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            -{product.discountPercentage}%
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Category */}
        <div className="text-xs text-muted-foreground mb-1">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2 text-foreground">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            !product.inStock
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : isAddingToCart
              ? "bg-green-500 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center gap-2">
              <i className={`${icons.check} text-sm`} />
              Added!
            </div>
          ) : !product.inStock ? (
            "Out of Stock"
          ) : (
            <div className="flex items-center justify-center gap-2">
              <i className={`${icons.add} text-sm`} />
              Add to Cart
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard; 