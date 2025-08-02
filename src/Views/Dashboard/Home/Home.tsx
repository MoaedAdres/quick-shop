import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useAuthStore } from "@/Stores/auth.store";
import { useGetRecommendedProductsInfinite } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import TopBar from "@/Views/Dashboard/Home/TopBar";
import ProductCard from "@/components/ui/product-card";
import HeroBanner from "@/components/ui/hero-banner";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Home = () => {
  const { login, isLoading } = useAuthStore();
  const isAuthenticated = true;

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

  // React Query hooks
  const recommendedProductsQuery = useGetRecommendedProductsInfinite({
    page_size: 20,
    type: "GLOBAL_TOPSELLERS",
  });

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

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  // Get the appropriate data
  const products = recommendedProductsQuery.data;

  return (
    <RFlex className="flex-col h-full pb-20 md:pb-0 relative">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Hero Banner */}
          <div className="h-48 md:h-64">
            <HeroBanner banners={mockHeroBanners} className="h-full" />
          </div>

          {/* Loading State */}
          {recommendedProductsQuery.isLoading && (
            <div className="flex items-center justify-center py-8">
              <i className={`${icons.spinner} text-2xl text-primary`} />
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          )}
          {/* Products */}
          {products && products.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Recommended Products
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Promotional Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <motion.div
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
            </motion.div> */}

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
          </div>
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
