import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Cart, CartItem, Product } from "@/Types/types";

interface CartState {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
};

const calculateCartTotals = (items: CartItem[]): Omit<Cart, 'items'> => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shipping,
    tax,
    total,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    devtools(
      (set, get) => ({
        cart: initialCart,
        
        addToCart: (product: Product, quantity = 1) => {
          set((state) => {
            const existingItem = state.cart.items.find(
              (item) => item.productId === product.id
            );

            let newItems: CartItem[];

            if (existingItem) {
              // Update existing item quantity
              newItems = state.cart.items.map((item) =>
                item.productId === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      totalPrice: (item.quantity + quantity) * item.price,
                    }
                  : item
              );
            } else {
              // Add new item
              const newItem: CartItem = {
                id: `${product.id}-${Date.now()}`,
                productId: product.id,
                product,
                quantity,
                price: product.price,
                totalPrice: product.price * quantity,
              };
              newItems = [...state.cart.items, newItem];
            }

            const totals = calculateCartTotals(newItems);

            return {
              cart: {
                items: newItems,
                ...totals,
              },
            };
          });
        },

        removeFromCart: (productId: string) => {
          set((state) => {
            const newItems = state.cart.items.filter(
              (item) => item.productId !== productId
            );
            const totals = calculateCartTotals(newItems);

            return {
              cart: {
                items: newItems,
                ...totals,
              },
            };
          });
        },

        updateQuantity: (productId: string, quantity: number) => {
          if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
          }

          set((state) => {
            const newItems = state.cart.items.map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    quantity,
                    totalPrice: item.price * quantity,
                  }
                : item
            );
            const totals = calculateCartTotals(newItems);

            return {
              cart: {
                items: newItems,
                ...totals,
              },
            };
          });
        },

        clearCart: () => {
          set({ cart: initialCart });
        },

        getCartItemCount: () => {
          return get().cart.totalItems;
        },

        getCartTotal: () => {
          return get().cart.total;
        },
      }),
      { name: "cart-devtools" }
    ),
    {
      name: "cart-storage",
    }
  )
); 