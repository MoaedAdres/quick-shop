import { motion } from "framer-motion";
import { getCategoryImage } from "@/Constants/categoryImages";
import type { Category } from "@/Types/types";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  className?: string;
}

const CategoryCard = ({ category, onClick, className = "" }: CategoryCardProps) => {
  const { name, sub_categories } = category;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Get category image based on name
  const getCategoryImageUrl = (categoryName: string) => {
    return getCategoryImage(categoryName);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`bg-transparent rounded-lg p-4 text-center cursor-pointer border-none hover:border-primary/50 transition-colors ${className}`}
    >
      {/* Category Image */}
      <div className="w-12 h-12 mx-auto mb-3 rounded-full overflow-hidden">
        <img 
          src={getCategoryImageUrl(name)} 
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Category Name */}
      <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-1">
        {name}
      </h3>

      {/* Sub-categories Count */}
      <p className="text-xs text-muted-foreground">
        {sub_categories?.length || 0} sub-categories
      </p>
    </motion.div>
  );
};

export default CategoryCard; 