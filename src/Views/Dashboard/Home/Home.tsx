import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useProductsStore } from "@/Stores/products.store";
import { mockProducts, mockCategories, mockHeroBanners } from "@/data/mock-data";
import RFlex from "@/RComponents/RFlex";
import RSearchInput from "@/RComponents/RSearchInput";
import TopBar from "@/Views/Dashboard/Home/TopBar";
import ProductCard from "@/components/ui/product-card";
import CategoryCard from "@/components/ui/category-card";
import HeroBanner from "@/components/ui/hero-banner";

const Home = () => {
  const { setProducts, setCategories, getFilteredProducts, setSearchQuery } = useProductsStore();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Initialize data
  useEffect(() => {
    setProducts(mockProducts);
    setCategories(mockCategories);
  }, [setProducts, setCategories]);

  // Auto-rotate hero banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => 
        prev === mockHeroBanners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredProducts = getFilteredProducts();
  const featuredProducts = filteredProducts.filter(product => product.isFeatured);

  return (
    <RFlex className="flex-col h-full pb-20 md:pb-0">
      {/* Top Bar */}
      <TopBar />

      {/* Search Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="p-4">
          <RSearchInput
            searchData=""
            handleSearchClicked={handleSearch}
            handleDataChanged={handleSearch}
            placeholder="Search products..."
            className="w-full"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Hero Banner */}
          <div className="h-48 md:h-64">
            <HeroBanner 
              banner={mockHeroBanners[currentBannerIndex]} 
              className="h-full"
            />
          </div>

          {/* Category Shortcuts */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Shop by Category
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {mockCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => {
                    // Handle category selection
                    console.log("Selected category:", category.id);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Featured Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Recommended Products */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recommended for You
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Promotional Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white"
            >
              <div className="flex items-center gap-3">
                <i className={`${icons.truck} text-2xl`} />
                <div>
                  <h3 className="font-semibold">Free Shipping</h3>
                  <p className="text-sm opacity-90">On orders over $50</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white"
            >
              <div className="flex items-center gap-3">
                <i className={`${icons.gift} text-2xl`} />
                <div>
                  <h3 className="font-semibold">New Arrivals</h3>
                  <p className="text-sm opacity-90">Check out the latest trends</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </RFlex>
  );
};

export default Home;
