import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useAuthStore } from "@/Stores/auth.store";
import {
  useGetRecommendedProducts,
  useGetSelectedProductsInfinite,
  useGetPrintifyProductsInfinite,
} from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import TopBar from "@/Views/Dashboard/Home/TopBar";
import ProductCard from "@/components/ui/product-card";
import PrintifyProductCard from "@/components/ui/printify-product-card";
import CategoryCard from "@/components/ui/category-card";
import HeroBanner from "@/components/ui/hero-banner";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import type { Product, PrintifyProduct, Category } from "@/Types/types";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const Home = () => {
  const { login, isLoading } = useAuthStore();
  const isAuthenticated = true;
  const navigate = useNavigate();

  // Mock hero banners (you can replace with API data later)
  const mockHeroBanners = [
    {
      id: "1",
      title: "Customized Clothing",
      subtitle: "Personalized fashion for everyone",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&q=80",
      link: "/customized-clothing",
    },
    {
      id: "2",
      title: "Dropshipping Products",
      subtitle: "Quality products, fast delivery",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop&q=80",
      link: "/dropshipping",
    },
    {
      id: "3",
      title: "Virtual Gift Cards",
      subtitle: "Perfect gifts for any occasion",
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=400&fit=crop&q=80",
    },
  ];

  // Featured categories for the home page
  const featuredCategories = [
    { name: "Jewelry & Accessories", category_id: "36" },
    { name: "Consumer Electronics", category_id: "44" },
    { name: "Home Improvement", category_id: "13" },
    { name: "Sports & Entertainment", category_id: "18" },
    { name: "Office & School Supplies", category_id: "21" },
  ];

  // React Query hooks
  const recommendedProductsQuery = useGetRecommendedProducts({
    type: "GLOBAL_TOPSELLERS",
  });

  const selectedProductsQuery = useGetSelectedProductsInfinite({
    page_size: 20,
  });

  const printifyProductsQuery = useGetPrintifyProductsInfinite({
    page_size: 20,
  });

  // Intersection Observer for infinite scroll - Selected Products
  const { ref: lastSelectedElementRef, inView: selectedInView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Intersection Observer for infinite scroll - Printify
  const { ref: lastPrintifyElementRef, inView: printifyInView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Trigger fetch when last element comes into view - Selected Products
  useEffect(() => {
    if (
      selectedInView &&
      selectedProductsQuery.hasNextPage &&
      !selectedProductsQuery.isFetchingNextPage
    ) {
      selectedProductsQuery.fetchNextPage();
    }
  }, [
    selectedInView,
    selectedProductsQuery.hasNextPage,
    selectedProductsQuery.isFetchingNextPage,
    selectedProductsQuery.fetchNextPage,
    selectedProductsQuery,
  ]);

  // Trigger fetch when last element comes into view - Printify
  useEffect(() => {
    if (
      printifyInView &&
      printifyProductsQuery.hasNextPage &&
      !printifyProductsQuery.isFetchingNextPage
    ) {
      printifyProductsQuery.fetchNextPage();
    }
  }, [
    printifyInView,
    printifyProductsQuery.hasNextPage,
    printifyProductsQuery.isFetchingNextPage,
    printifyProductsQuery.fetchNextPage,
    printifyProductsQuery,
  ]);

  //   const handleDebug = () => {
  //     telegramService.showAlert(`User Debug Info:
  // Telegram ID: ${user?.id || "N/A"}
  // Name: ${user?.first_name || "N/A"} ${user?.last_name || ""}
  // Username: ${user?.username || "N/A"}
  // Language: ${user?.language_code || "N/A"}
  // Premium: ${user?.is_premium || false}`);
  //   };

  const handleProductClick = (product: any) => {
    console.log("Selected product:", product);
    // TODO: Navigate to product details
  };

  const handleCategoryClick = (category: Category) => {
    navigate(`/dashboard/search?category=${category.category_id}`);
  };

  const handleViewAllCategories = () => {
    navigate("/dashboard/search");
  };

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  // Get the appropriate data - products is already the flattened array from selectFn
  const recommendedProducts = recommendedProductsQuery.data || [];
  const selectedProducts = selectedProductsQuery.data || [];
  const printifyProducts = printifyProductsQuery.data || [];

  return (
    <RFlex className="flex-col h-full pb-20 relative">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Hero Banner */}
          <div className="h-48 md:h-64">
            <HeroBanner banners={mockHeroBanners} className="h-full" />
          </div>

          {/* Selected Products - AliExpress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Selected Products
              </h2>
            </div>

            {selectedProductsQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <i
                  className={`${icons.spinner} text-2xl text-primary animate-spin`}
                />
                <span className="ml-2 text-muted-foreground">
                  Loading selected products...
                </span>
              </div>
            ) : selectedProducts.length > 0 ? (
              /* Horizontal Scrollable Products */
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                  {selectedProducts.map((product: Product, index: number) => (
                    <div
                      key={product.product_id}
                      className="flex-shrink-0 w-48 md:w-56"
                      ref={
                        index === selectedProducts.length - 1 ? lastSelectedElementRef : null
                      }
                    >
                      <ProductCard
                        product={product}
                        onClick={() => handleProductClick(product)}
                      />
                    </div>
                  ))}

                  {/* Loading more indicator */}
                  {selectedProductsQuery.isFetchingNextPage && (
                    <div className="flex-shrink-0 w-48 md:w-56 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <i
                          className={`${icons.spinner} text-xl text-primary animate-spin`}
                        />
                        <span className="text-xs text-muted-foreground">
                          Loading more...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <span className="text-muted-foreground">
                  No selected products available
                </span>
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Shop by Category
              </h2>
            </div>

            {/* Mobile Layout - Stack vertically */}
            <div className="block md:hidden space-y-4 shadow-lg rounded-xl p-4">
              {/* Featured Category Swiper */}
              <div className="relative">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={16}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  modules={[Autoplay, Pagination]}
                  className="h-64 rounded-lg overflow-hidden"
                >
                  {featuredCategories.map((category: Category) => (
                    <SwiperSlide key={category.category_id}>
                      <div
                        className="h-full w-full cursor-pointer overflow-hidden"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className="h-full w-full">
                          <CategoryCard
                            category={category}
                            classNameImage="m-0"
                            classNameName="mb-6"
                          />
                        </div>
                      </div>
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

              {/* Category Grid - 2 columns on mobile */}
              <div className="grid grid-cols-2 gap-3">
                {featuredCategories.slice(0, 4).map((category) => (
                  <div
                    key={category.category_id}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>

              {/* View All button - Full width */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-4 flex items-center justify-center cursor-pointer"
                onClick={handleViewAllCategories}
              >
                <div className="text-center text-white">
                  <i className={`${icons.arrowRight} text-lg mr-2`} />
                  <span className="text-sm font-semibold">
                    View All Categories
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Desktop Layout - Side by side */}
            <div className="hidden md:flex gap-6 shadow-lg rounded-xl p-4">
              {/* Left side - Category swiper (60% of space) */}
              <div className="w-3/5">
                <div className="relative">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={16}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    modules={[Autoplay, Pagination]}
                    className="h-96 rounded-lg overflow-hidden"
                  >
                    {featuredCategories.map((category: Category) => (
                      <SwiperSlide key={category.category_id}>
                        <div
                          className="h-full w-full cursor-pointer overflow-hidden"
                          onClick={() => handleCategoryClick(category)}
                        >
                          <div className="h-full w-full">
                            <CategoryCard
                              category={category}
                              classNameImage="m-0"
                              classNameName="mb-6"
                            />
                          </div>
                        </div>
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
              </div>

              {/* Right side - Featured categories grid (40% of space) */}
              <div className="w-2/5">
                <div className="grid grid-cols-3 gap-3 h-96">
                  {/* First row */}
                  <div
                    onClick={() => handleCategoryClick(featuredCategories[0])}
                  >
                    <CategoryCard category={featuredCategories[0]} />
                  </div>
                  <div
                    onClick={() => handleCategoryClick(featuredCategories[1])}
                  >
                    <CategoryCard category={featuredCategories[1]} />
                  </div>
                  <div
                    onClick={() => handleCategoryClick(featuredCategories[2])}
                  >
                    <CategoryCard category={featuredCategories[2]} />
                  </div>

                  {/* Second row */}
                  <div
                    onClick={() => handleCategoryClick(featuredCategories[3])}
                  >
                    <CategoryCard category={featuredCategories[3]} />
                  </div>
                  <div
                    onClick={() => handleCategoryClick(featuredCategories[4])}
                  >
                    <CategoryCard category={featuredCategories[4]} />
                  </div>

                  {/* View All button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-card border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-lg p-1 cursor-pointer transition-all duration-200 h-full flex flex-col group"
                    onClick={handleViewAllCategories}
                  >
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                          <i
                            className={`${icons.arrowRight} text-xl text-primary`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        View All
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Products - Printify */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Recommended by Printify
              </h2>
            </div>

            {printifyProductsQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <i
                  className={`${icons.spinner} text-2xl text-primary animate-spin`}
                />
                <span className="ml-2 text-muted-foreground">
                  Loading Printify products...
                </span>
              </div>
            ) : printifyProducts.length > 0 ? (
              /* Horizontal Scrollable Products */
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                  {printifyProducts.map(
                    (product: PrintifyProduct, index: number) => (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-48 md:w-56"
                        ref={
                          index === printifyProducts.length - 1
                            ? lastPrintifyElementRef
                            : null
                        }
                      >
                        <PrintifyProductCard product={product} />
                      </div>
                    )
                  )}

                  {/* Loading more indicator */}
                  {printifyProductsQuery.isFetchingNextPage && (
                    <div className="flex-shrink-0 w-48 md:w-56 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <i
                          className={`${icons.spinner} text-xl text-primary animate-spin`}
                        />
                        <span className="text-xs text-muted-foreground">
                          Loading more...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <span className="text-muted-foreground">
                  No Printify products available
                </span>
              </div>
            )}
          </div>

          {/* Recommended Products - Grid Layout */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Recommended Products
              </h2>
            </div>

            {recommendedProductsQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <i
                  className={`${icons.spinner} text-2xl text-primary animate-spin`}
                />
                <span className="ml-2 text-muted-foreground">
                  Loading recommended products...
                </span>
              </div>
            ) : recommendedProducts.length > 0 ? (
              <>
                {/* Grid Layout - 3 rows, 5 columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {recommendedProducts
                    .slice(0, 15)
                    .map((product: Product) => (
                      <div
                        key={product.product_id}
                      >
                        <ProductCard
                          product={product}
                          onClick={() => handleProductClick(product)}
                        />
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-8">
                <span className="text-muted-foreground">
                  No recommended products available
                </span>
              </div>
            )}
          </div>

          {/* Promotional Banners */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border/20 rounded-lg p-6 text-white"
            >
              <div className="flex items-center gap-3">
                <i className={`${icons.gift} text-2xl`} />
                <div>
                  <h3 className="font-semibold">New Arrivals</h3>
                  <p className="text-sm opacity-90">
                    Check out the latest trends
                  </p>
                </div>
              </div>
            </motion.div>
          </div> */}
        </div>
      </div>

      {/* Login Modal Overlay */}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-card rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center border border-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Login Required
            </h2>
            <p className="mb-4 text-muted-foreground">
              Please login to continue
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full mb-2"
            >
              {isLoading ? "Logging in..." : "Login with Telegram"}
            </Button>
          </div>
        </div>
      )}
    </RFlex>
  );
};

export default Home;
