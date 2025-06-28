import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Product, Category, SearchFilters } from "@/Types/types";

interface ProductsState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  searchQuery: string;
  filters: SearchFilters;
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  getFilteredProducts: () => Product[];
  getProductsByCategory: (categoryId: string) => Product[];
  getProductById: (id: string) => Product | undefined;
}

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set, get) => ({
      products: [],
      categories: [],
      featuredProducts: [],
      searchQuery: "",
      filters: {},
      isLoading: false,

      setProducts: (products: Product[]) => {
        const featuredProducts = products.filter((product) => product.isFeatured);
        set({ products, featuredProducts });
      },

      setCategories: (categories: Category[]) => {
        set({ categories });
      },

      setSearchQuery: (searchQuery: string) => {
        set({ searchQuery });
      },

      setFilters: (filters: Partial<SearchFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      getFilteredProducts: () => {
        const { products, searchQuery, filters } = get();
        let filtered = [...products];

        // Search by name or description
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (product) =>
              product.name.toLowerCase().includes(query) ||
              product.description.toLowerCase().includes(query) ||
              product.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        // Filter by category
        if (filters.category) {
          filtered = filtered.filter(
            (product) => product.category === filters.category
          );
        }

        // Filter by price range
        if (filters.priceRange) {
          filtered = filtered.filter(
            (product) =>
              product.price >= filters.priceRange!.min &&
              product.price <= filters.priceRange!.max
          );
        }

        // Filter by rating
        if (filters.rating) {
          filtered = filtered.filter(
            (product) => product.rating >= filters.rating!
          );
        }

        // Filter by stock
        if (filters.inStock !== undefined) {
          filtered = filtered.filter(
            (product) => product.inStock === filters.inStock
          );
        }

        // Sort products
        if (filters.sortBy) {
          filtered.sort((a, b) => {
            const order = filters.sortOrder === "desc" ? -1 : 1;
            
            switch (filters.sortBy) {
              case "price":
                return (a.price - b.price) * order;
              case "rating":
                return (a.rating - b.rating) * order;
              case "newest":
                return (
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
                ) * order;
              case "popular":
                return (a.reviewCount - b.reviewCount) * order;
              default:
                return 0;
            }
          });
        }

        return filtered;
      },

      getProductsByCategory: (categoryId: string) => {
        const { products } = get();
        return products.filter((product) => product.category === categoryId);
      },

      getProductById: (id: string) => {
        const { products } = get();
        return products.find((product) => product.id === id);
      },
    }),
    { name: "products-devtools" }
  )
); 