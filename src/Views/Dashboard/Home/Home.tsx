import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useAuthStore } from "@/Stores/auth.store";
import { telegramService } from "@/Services/telegram.service";
import { 
  useGetRecommendedProducts, 
  useGetCategories, 
  useSearchProducts 
} from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import RSearchInput from "@/RComponents/RSearchInput";
import TopBar from "@/Views/Dashboard/Home/TopBar";
import ProductCard from "@/components/ui/product-card";
import CategoryCard from "@/components/ui/category-card";
import HeroBanner from "@/components/ui/hero-banner";

const Home = () => {
  const { user } = useAuthStore();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock hero banners (you can replace with API data later)
  const mockHeroBanners = [
    {
      id: "1",
      title: "Summer Sale",
      subtitle: "Up to 70% off",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
      link: "/sale"
    },
    {
      id: "2",
      title: "New Arrivals",
      subtitle: "Fresh styles for you",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop",
      link: "/new"
    }
  ];

  // React Query hooks
  const recommendedProductsQuery = useGetRecommendedProducts({
    page: 1,
    page_size: 20,
    type: 'GLOBAL_TOPSELLERS'
  });

  const categoriesQuery = useGetCategories();

  const searchProductsQuery = useSearchProducts({
    search: searchQuery,
    page: 1,
    page_size: 20,
    local: 'en_US',
    country: 'US',
    currency: 'USD'
  });

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

  const handleDebug = () => {
    telegramService.showAlert(`User Debug Info:
Telegram ID: ${user?.id || 'N/A'}
Name: ${user?.first_name || 'N/A'} ${user?.last_name || ''}
Username: ${user?.username || 'N/A'}
Language: ${user?.language_code || 'N/A'}
Premium: ${user?.is_premium || false}`);
  };

  const handleCategoryClick = (category: any) => {
    console.log('Selected category:', category);
    // TODO: Implement category filtering
  };

  const handleProductClick = (product: any) => {
    console.log('Selected product:', product);
    // TODO: Navigate to product details
  };

  // Get the appropriate data based on search state
  const products = searchQuery.trim() ? searchProductsQuery.data?.data?.products : recommendedProductsQuery.data?.data?.products;
  const categories = categoriesQuery.data?.data;
  const loading = searchQuery.trim() ? searchProductsQuery.isLoading : recommendedProductsQuery.isLoading;
  const error = searchQuery.trim() ? searchProductsQuery.error : recommendedProductsQuery.error;

  return (
    <RFlex className="flex-col h-full pb-20 md:pb-0">
      {/* Top Bar */}
      <TopBar />

      {/* Debug Button - Remove in production */}
      <div className="p-4 bg-red-100 border-b">
        <button 
          onClick={handleDebug}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm"
        >
          🐛 Show User Info
        </button>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="p-4">
          <RSearchInput
            searchData={searchQuery}
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <i className={`${icons.spinner} text-2xl text-primary`} />
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className={`${icons.error} text-red-500 mr-2`} />
                <span className="text-red-700">{(error as Error)?.message || 'An error occurred'}</span>
              </div>
            </div>
          )}

          {/* Category Shortcuts */}
          {categories && categories.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Shop by Category
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {categories.slice(0, 12).map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => handleCategoryClick(category)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {products && products.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {searchQuery.trim() ? 'Search Results' : 'Recommended Products'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.slice(0, 8).map((product) => (
                  <ProductCard 
                    key={product.product_id} 
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && products && products.length === 0 && searchQuery.trim() && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
            </div>
          )}

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
