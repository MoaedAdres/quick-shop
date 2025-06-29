import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ProductsState {
  searchQuery: string;
  selectedCategory: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
}

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set) => ({
      searchQuery: "",
      selectedCategory: null,

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    { name: "products-devtools" }
  )
); 