import { motion } from "framer-motion";
import { getCategoryImage } from "@/Constants/categoryImages";
import type { Category } from "@/Types/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  className?: string;
  classNameImage?: string;
  classNameName?: string;
}

const CategoryCard = ({
  category,
  onClick,
  className = "",
  classNameImage = "",
  classNameName = "",
}: CategoryCardProps) => {
  const { name, category_id } = category;

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
      className={`bg-card rounded-lg p-1 text-center cursor-pointer hover:border hover:!border-border/50 transition-all duration-200 shadow-lg hover:shadow-xl ${className}`}
    >
      {/* Category Image */}
      <div
        className={cn(
          "mx-auto mb-3 rounded-[8px] overflow-hidden",
          classNameImage
        )}
      >
        <img
          src={getCategoryImageUrl(name)}
          alt={name}
          className="w-full h-full object-fill"
          loading="lazy"
        />
      </div>

      {/* Category Name */}
      <div className="p-2">
        <h3
          className={cn(
            "font-medium text-sm text-foreground mb-1 line-clamp-1",
            classNameName
          )}
        >
          {name}
        </h3>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
