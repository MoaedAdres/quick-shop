import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CartState {
  // UI State only
  isCartOpen: boolean;
  
  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    devtools(
      (set, _) => ({
        isCartOpen: false,
        
        openCart: () => set({ isCartOpen: true }),
        closeCart: () => set({ isCartOpen: false }),
        toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      }),
      { name: "cart-devtools" }
    ),
    {
      name: "cart-ui-storage",
    }
  )
); 