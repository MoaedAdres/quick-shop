import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { icons } from "@/Constants/icons";
import type { PrintifyProduct } from "@/Types/types";

interface PrintifyProductCardProps {
  product: PrintifyProduct;
  onClick?: () => void;
}

const PrintifyProductCard = ({ product, onClick }: PrintifyProductCardProps) => {
  const navigate = useNavigate();
  
  // Get the default image (first image that is default)
  const defaultImage = product.images.find(img => img.is_default)?.src || product.images[0]?.src;
  
  // Get the default variant (first enabled variant)
  const defaultVariant = product.variants.find(v => v.is_enabled) || product.variants[0];
  
  // Format price (price is in cents, so divide by 100)
  const formattedPrice = defaultVariant ? `$${(defaultVariant.price / 100).toFixed(2)}` : "N/A";

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick();
      navigate(`/dashboard/printify-product/${product.id}`);

    } else {
      navigate(`/dashboard/printify-product/${product.id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="bg-card rounded-lg overflow-hidden border border-border cursor-pointer transition-all hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden">
        {defaultImage ? (
          <img
            src={defaultImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <i className={`${icons.image} text-2xl text-muted-foreground`} />
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-background/80 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <i className={`${icons.heart} text-sm text-muted-foreground`} />
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formattedPrice}
          </span>
          
          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
          >
            <i className={`${icons.cart} text-sm text-primary-foreground`} />
          </motion.button>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded-full">
                +{product.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PrintifyProductCard; 