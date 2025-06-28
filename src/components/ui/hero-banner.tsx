import { motion } from "framer-motion";
import type { HeroBanner as HeroBannerType } from "@/Types/types";

interface HeroBannerProps {
  banner: HeroBannerType;
  className?: string;
}

const HeroBanner = ({ banner, className = "" }: HeroBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{
        backgroundColor: banner.backgroundColor || "var(--primary)",
        color: banner.textColor || "white",
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative p-6 flex flex-col justify-center h-full">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold mb-2"
        >
          {banner.title}
        </motion.h2>
        
        {banner.subtitle && (
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm opacity-90 mb-4"
          >
            {banner.subtitle}
          </motion.p>
        )}

        {banner.link && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary px-4 py-2 rounded-md font-medium text-sm w-fit"
          >
            Shop Now
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default HeroBanner; 