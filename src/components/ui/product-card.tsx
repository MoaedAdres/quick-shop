import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import type { Product } from "@/Types/types";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

const ProductCard = ({ product, onClick, className = "" }: ProductCardProps) => {
  const {
    title,
    main_image,
    sale_price,
    sale_price_currency,
    original_price,
    original_price_currency,
    discount,
  } = product;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`bg-card rounded-lg overflow-hidden shadow-sm border border-border cursor-pointer ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={main_image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        
        {/* Discount Badge */}
        {discount && discount !== "0%" && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discount}
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <i className={`${icons.heart} text-sm text-gray-600`} />
          </button>
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <i className={`${icons.info} text-sm text-gray-600`} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Product Title */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 leading-tight">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-primary">
            {sale_price_currency} {parseFloat(sale_price).toFixed(2)}
          </span>
          
          {original_price && parseFloat(original_price) > parseFloat(sale_price) && (
            <span className="text-sm text-muted-foreground line-through">
              {original_price_currency} {parseFloat(original_price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`${icons.star} text-xs ${
                    i < 4 ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">(4.5)</span>
          </div>
          
          <button className="text-xs text-primary hover:underline">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 