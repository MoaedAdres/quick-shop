import { motion } from "framer-motion";
import type { Category } from "@/Types/types";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  className?: string;
}

const CategoryCard = ({ category, onClick, className = "" }: CategoryCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-card rounded-lg p-4 border border-border cursor-pointer hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Category Icon */}
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <i className={`${category.icon} text-primary text-xl`} />
        </div>

        {/* Category Name */}
        <h3 className="font-medium text-sm text-foreground mb-1">
          {category.name}
        </h3>

        {/* Product Count */}
        <p className="text-xs text-muted-foreground">
          {category.productCount} items
        </p>
      </div>
    </motion.div>
  );
};

export default CategoryCard; 