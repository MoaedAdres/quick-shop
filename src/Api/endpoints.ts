import { get } from "@/Config/axios";
import type { SearchParams, RecommendedProductsParams } from "@/Types/types";

export const backApis = {
  // ------------------------------ Products ---------------------------------------------
  getRecommendedProducts: (params: RecommendedProductsParams) =>
    get("products", { params }),

  searchProducts: (params: SearchParams) =>
    get("products/products", { params }),

  getProductDetails: (productId: string | number) =>
    get(`products/${productId}`),

  // ------------------------------ Categories ---------------------------------------------
  getCategories: () => get("products/categories"),

  // ------------------------------ Cart ---------------------------------------------
  // TODO: Add cart endpoints when you provide them
  // getCart: () => get("cart"),
  // addToCart: (payload: AddToCartPayload) => post("cart/add", payload),
  // updateCartItem: (itemId: string, payload: UpdateCartItemPayload) => put(`cart/items/${itemId}`, payload),
  // removeFromCart: (itemId: string) => destroy(`cart/items/${itemId}`),

  // ------------------------------ Authentication ---------------------------------------------
  // TODO: Add auth endpoints when you provide them
  // login: (payload: LoginPayload) => post("auth/login", payload),
  // register: (payload: RegisterPayload) => post("auth/register", payload),
  // logout: () => post("auth/logout"),

  // ------------------------------ User Profile ---------------------------------------------
  // TODO: Add user profile endpoints when you provide them
  // getUserProfile: () => get("user/profile"),
  // updateUserProfile: (payload: UpdateProfilePayload) => put("user/profile", payload),

  // ------------------------------ Orders ---------------------------------------------
  // TODO: Add order endpoints when you provide them
  // getOrders: (params: OrdersFilters) => get("orders", { params }),
  // getOrderById: (orderId: string) => get(`orders/${orderId}`),
  // createOrder: (payload: CreateOrderPayload) => post("orders", payload),

  // ------------------------------ Wallet ---------------------------------------------
  // TODO: Add wallet endpoints when you provide them
  // getWallet: () => get("wallet"),
  // getWalletTransactions: (params: TransactionsFilters) => get("wallet/transactions", { params }),
  // addMoneyToWallet: (payload: AddMoneyPayload) => post("wallet/add-money", payload),
};
