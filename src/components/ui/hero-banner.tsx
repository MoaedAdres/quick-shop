import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { HeroBanner as HeroBannerType } from "@/Types/types";

// Import Swiper styles
import "swiper/css";
// import "swiper/css/navigation";
import "swiper/css/pagination";

interface HeroBannerProps {
  banners: HeroBannerType[];
  className?: string;
}

const HeroBanner = ({ banners, className = "" }: HeroBannerProps) => {
  return (
    <div className={`relative ${className}`}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-lg overflow-hidden border border-border/20 h-full"
              style={{
                backgroundColor: "#0B0A12",
                color: banner.textColor || "white",
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover lg:object-fill"
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

                {banner.link ? (
                  ""
                ) : (
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-foreground/70 text-sm font-medium"
                  >
                    Coming Soon...
                  </motion.span>
                )}
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Styles */}
      <style>{`
         .swiper-pagination-bullet {
           background: rgba(255, 255, 255, 0.5) !important;
           opacity: 1 !important;
         }
         .swiper-pagination-bullet-active {
           background: var(--primary) !important;
         }
       `}</style>
    </div>
  );
};

export default HeroBanner;
