import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import {
  useGetCategories,
  useGetCategoryProducts,
  useSearchProducts,
} from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import RSearchInput from "@/RComponents/RSearchInput";
import CategoryCard from "@/components/ui/category-card";
import ProductCard from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const navigate = useNavigate();

  // React Query hooks
  const categoriesQuery = useGetCategories();

  // Search products query - only enabled when there's a search query and no selected category
  const searchProductsQuery = useSearchProducts(
    {
      search: searchQuery,
      page: 1,
      page_size: 20,
      local: "en_US",
      country: "US",
      currency: "USD",
    },
    !!searchQuery.trim() && !selectedCategory
  );

  // Category products query - only enabled when a category is selected
  const categoryProductsQuery = useGetCategoryProducts(
    selectedCategory?.id,
    20,
    !!selectedCategory?.id
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null); // Clear category when searching
  };

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when selecting category
  };

  const handleProductClick = (product: any) => {
    console.log("Selected product:", product);
    // TODO: Navigate to product details
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Intersection Observer for infinite scroll
  const { ref: lastElementRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: false,
  });

  // Trigger fetch when last element comes into view
  useEffect(() => {
    if (!inView) return;

    if (searchQuery.trim() && !selectedCategory) {
      // Handle search infinite scroll
      if (
        searchProductsQuery.hasNextPage &&
        !searchProductsQuery.isFetchingNextPage &&
        !searchProductsQuery.isLoading
      ) {
        searchProductsQuery.fetchNextPage();
      }
    } else if (selectedCategory) {
      // Handle category infinite scroll
      if (
        categoryProductsQuery.hasNextPage &&
        !categoryProductsQuery.isFetchingNextPage &&
        !categoryProductsQuery.isLoading
      ) {
        categoryProductsQuery.fetchNextPage();
      }
    }
  }, [inView]); // Only depend on inView to prevent multiple triggers

  // Determine which data to display
  const getDisplayData = () => {
    if (searchQuery.trim() && !selectedCategory) {
      // Show search results
      return {
        products: searchProductsQuery.data || [],
        loading: searchProductsQuery.isLoading,
        error: searchProductsQuery.error,
        isFetchingMore: searchProductsQuery.isFetchingNextPage,
        hasNextPage: searchProductsQuery.hasNextPage,
      };
    } else if (selectedCategory) {
      // Show category products
      return {
        products: categoryProductsQuery.data || [],
        loading: categoryProductsQuery.isLoading,
        error: categoryProductsQuery.error,
        isFetchingMore: categoryProductsQuery.isFetchingNextPage,
        hasNextPage: categoryProductsQuery.hasNextPage,
      };
    }
    return {
      products: [],
      loading: false,
      error: null,
      isFetchingMore: false,
      hasNextPage: false,
    };
  };

  const categories = categoriesQuery.data?.data;
  const displayData = getDisplayData();

  return (
    <RFlex className="flex-col h-full pb-20 relative">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackClick}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center cursor-pointer"
          >
            <i className={`${icons.arrowLeft} text-muted-foreground`} />
          </motion.button>
          <h1 className="text-xl font-bold text-foreground">Search</h1>
        </div>

        {/* Search Input */}
        <RSearchInput
          searchData={searchQuery}
          handleSearchClicked={handleSearch}
          handleDataChanged={handleSearch}
          placeholder="Search products..."
          className="w-full"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!searchQuery.trim() && !selectedCategory ? (
          // Show categories when no search or category selected
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Browse Categories
            </h2>
            {categories && categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CategoryCard
                      category={category}
                      onClick={() => handleCategoryClick(category)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className={`${icons.spinner} text-2xl text-primary mb-2`} />
                <p className="text-muted-foreground">Loading categories...</p>
              </div>
            )}
          </div>
        ) : (
          // Show search results or category products
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {selectedCategory
                  ? `${selectedCategory.name} Products`
                  : `Search Results for "${searchQuery}"`}
              </h2>
              {(searchQuery.trim() || selectedCategory) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Loading State */}
            {displayData.loading && !displayData.isFetchingMore && (
              <div className="flex items-center justify-center py-8">
                <i className={`${icons.spinner} text-2xl text-primary`} />
                <span className="ml-2 text-muted-foreground">Loading...</span>
              </div>
            )}

            {/* Error State */}
            {displayData.error && (
              <div className="bg-card border border-red-200/20 rounded-lg p-4">
                <div className="flex items-center">
                  <i className={`${icons.error} text-red-500 mr-2`} />
                  <span className="text-red-400">
                    {(displayData.error as Error)?.message ||
                      "An error occurred"}
                  </span>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {displayData.products && displayData.products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayData.products.map((product, index) => (
                  <div
                    key={product.product_id}
                    ref={
                      index === displayData.products.length - 1
                        ? lastElementRef
                        : undefined
                    }
                  >
                    <ProductCard
                      product={product}
                      onClick={() => handleProductClick(product)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Loading more indicator */}
            {displayData.isFetchingMore && (
              <div className="flex items-center justify-center py-4">
                <i
                  className={`${icons.spinner} text-xl text-primary animate-spin`}
                />
                <span className="ml-2 text-muted-foreground">
                  Loading more...
                </span>
              </div>
            )}

            {/* No Results */}
            {!displayData.loading &&
              !displayData.error &&
              displayData.products &&
              displayData.products.length === 0 &&
              (searchQuery.trim() || selectedCategory) && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery.trim()
                      ? `No products found for "${searchQuery}"`
                      : `No products found in ${selectedCategory?.name}`}
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </RFlex>
  );
};

export default SearchPage;
