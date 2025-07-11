import { useAuthStore } from "@/Stores/auth.store";
import { useGetRecommendedProducts, useGetCategories, useSearchProducts } from "@/Api/queriesAndMutations";
import TopBar from "./TopBar";
import CustomInput from "./CustomInput";
import ProductCard from "@/components/ui/product-card";
import CategoryCard from "@/components/ui/category-card";
import HeroBanner from "@/components/ui/hero-banner";
import RFlex from "@/RComponents/RFlex";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const [searchQuery, _] = useState("");

  // Data fetching hooks
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

  // Get the appropriate data based on search state
  const products = searchQuery.trim() ? searchProductsQuery.data?.data?.products : recommendedProductsQuery.data?.data?.products;
  const categories = categoriesQuery.data?.data;
  const loading = searchQuery.trim() ? searchProductsQuery.isLoading : recommendedProductsQuery.isLoading;
  const error = searchQuery.trim() ? searchProductsQuery.error : recommendedProductsQuery.error;

  // Mock hero banners (replace with API data if available)
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

  const [currentBannerIndex, _2] = useState(0);

  // Auto-rotate hero banners
  // (You can add useEffect for auto-rotation if desired)

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <RFlex className="flex-col h-full pb-20 md:pb-0 relative">
      {/* Top Bar */}
      <TopBar />

      {/* Search Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="p-4">
          <CustomInput />
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
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
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
                    onClick={() => {}}
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
                    onClick={() => {}}
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
        </div>
      </div>

      {/* Login Modal Overlay */}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="mb-4 text-gray-600">Please login to continue</p>
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
