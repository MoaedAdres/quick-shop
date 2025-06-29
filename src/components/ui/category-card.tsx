import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
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

  // Get category icon based on name
  const getCategoryIcon = (categoryName: string) => {
    const nameLower = categoryName.toLowerCase();
    
    if (nameLower.includes('electronics') || nameLower.includes('computer') || nameLower.includes('phone')) {
      return icons.electronics;
    } else if (nameLower.includes('apparel') || nameLower.includes('clothing') || nameLower.includes('fashion')) {
      return icons.apparel;
    } else if (nameLower.includes('home') || nameLower.includes('garden') || nameLower.includes('furniture')) {
      return icons.homeDecor;
    } else if (nameLower.includes('beauty') || nameLower.includes('health')) {
      return icons.beauty;
    } else if (nameLower.includes('sport') || nameLower.includes('fitness')) {
      return icons.sports;
    } else if (nameLower.includes('toy') || nameLower.includes('hobby')) {
      return icons.toys;
    } else if (nameLower.includes('food') || nameLower.includes('grocery')) {
      return icons.food;
    } else if (nameLower.includes('book') || nameLower.includes('office')) {
      return icons.books;
    } else {
      return icons.homeDecor; // Default icon
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`bg-card rounded-lg p-4 text-center cursor-pointer border border-border hover:border-primary/50 transition-colors ${className}`}
    >
      {/* Category Icon */}
      <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
        <i className={`${getCategoryIcon(name)} text-xl text-primary`} />
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