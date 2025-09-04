import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/Types/types";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

const ProductCard = ({
  product,
  onClick,
  className = "",
}: ProductCardProps) => {
  const navigate = useNavigate();
  const {
    title,
    product_id,
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
      navigate(`/dashboard/product/${product_id}`);
    } else {
      navigate(`/dashboard/product/${product_id}`);
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
          referrerPolicy="no-referrer"
          src={main_image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-semibold px-1 py-0.5 rounded">
            {discount}%
          </div>
        )}

        {/* Quick Actions */}
        {/* <div className="absolute top-1 right-1 flex flex-col gap-1">
          <button
            className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle wishlist action
            }}
          >
            <i className={`${icons.heart} text-[10px] text-gray-600`} />
          </button>
        </div> */}
      </div>

      {/* Product Info */}
      <div className="p-2">
        {/* Product Title */}
        <h3 className="text-xs font-medium text-foreground line-clamp-2 mb-1 leading-tight">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-sm font-bold text-primary">
            {sale_price_currency} {parseFloat(sale_price).toFixed(2)}
          </span>

          {original_price &&
            parseFloat(original_price) > parseFloat(sale_price) && (
              <span className="text-xs text-muted-foreground line-through">
                {original_price_currency}{" "}
                {parseFloat(original_price).toFixed(2)}
              </span>
            )}
        </div>

        {/* Rating and Reviews */}
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`${icons.star} text-[10px] ${
                    i < 4 ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">(4.5)</span>
          </div>
        </div> */}
      </div>
    </motion.div>
  );
};

export default ProductCard;
