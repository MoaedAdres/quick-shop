import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Product, Category } from "@/Types/types";
import ApiService from "@/Services/api.service";

interface ProductsState {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalProducts: number;
    pageSize: number;
    isFinished: boolean;
  };
  
  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: Partial<ProductsState['pagination']>) => void;
  
  // API calls
  fetchRecommendedProducts: (page?: number, pageSize?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string, page?: number) => Promise<void>;
  
  // Computed
  getFilteredProducts: () => Product[];
}

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set, get) => ({
      products: [],
      categories: [],
      searchQuery: "",
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalProducts: 0,
        pageSize: 20,
        isFinished: false,
      },

      setProducts: (products) => set({ products }),
      setCategories: (categories) => set({ categories }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
      })),

      fetchRecommendedProducts: async (page = 1, pageSize = 20) => {
        try {
          set({ loading: true, error: null });
          const response = await ApiService.getRecommendedProducts({
            page,
            page_size: pageSize,
            type: 'GLOBAL_TOPSELLERS'
          });
          
          set({
            products: response.data.products,
            pagination: {
              currentPage: page,
              totalProducts: response.data.total_products_count,
              pageSize,
              isFinished: response.data.is_finished,
            },
            loading: false,
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch products' 
          });
        }
      },

      fetchCategories: async () => {
        try {
          set({ loading: true, error: null });
          const response = await ApiService.getCategories();
          set({ categories: response.data, loading: false });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch categories' 
          });
        }
      },

      searchProducts: async (query: string, page = 1) => {
        try {
          set({ loading: true, error: null });
          const response = await ApiService.searchProducts({
            search: query,
            page,
            page_size: 20,
            local: 'en_US',
            country: 'US',
            currency: 'USD'
          });
          
          set({
            products: response.data.products,
            searchQuery: query,
            pagination: {
              currentPage: response.data.page,
              totalProducts: response.data.total_products,
              pageSize: response.data.page_size,
              isFinished: false, // Search doesn't provide this info
            },
            loading: false,
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to search products' 
          });
        }
      },

      getFilteredProducts: () => {
        const { products, searchQuery } = get();
        if (!searchQuery.trim()) return products;
        
        return products.filter(product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      },
    }),
    { name: "products-devtools" }
  )
); 