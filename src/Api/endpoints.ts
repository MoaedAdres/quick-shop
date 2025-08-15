import { get, post, put, destroy } from "@/Config/axios";
import type {
  SearchParams,
  RecommendedProductsParams,
  AddToCartPayload,
  ShippingAddress,
  TelegramLoginPayload,
  RefreshTokenPayload,
  CreateCheckoutSessionPayload,
  CheckoutSessionResponse,
  ReferralSettingsPayload,
  TappingSettingsPayload,
  CryptoPaymentPayload,
} from "@/Types/types";

export const backApis = {
  // ------------------------------ Products ---------------------------------------------
  getRecommendedProducts: (params: RecommendedProductsParams) =>
    get("products/aliexpress/recommended", { params }),

  getProductsWithSearch: (params: SearchParams) =>
    get("products/aliexpress/products", { params }),

  getProductDetails: (productId: string | number) =>
    get(`products/aliexpress/products/${productId}`),

  // Printify Products
  getPrintifyProducts: (params: { page?: number; per_page?: number }) =>
    get("products/printify", { params }),

  getPrintifyProductDetails: (productId: string) =>
    get(`products/printify/${productId}`),

  // ------------------------------ Categories ---------------------------------------------
  getCategories: () => get("products/aliexpress/categories"),

  // ------------------------------ Cart ---------------------------------------------
  getCart: () => get("orders/cart"),
  addToCart: (payload: AddToCartPayload) => post("orders/cart/items", payload),
  removeFromCart: (itemId: number) => destroy(`orders/cart/items/${itemId}`),

  // ------------------------------ Shipping ---------------------------------------------
  shippingPreview: (payload: ShippingAddress) =>
    post("orders/shipping-preview", payload),

  // ------------------------------ Payment ---------------------------------------------
  createCheckoutSession: (
    payload: CreateCheckoutSessionPayload
  ): Promise<CheckoutSessionResponse> =>
    post("payments/create-checkout-session", payload),

  createStripeOrder: (payload: {
    payment_method: "stripe";
    delivery_address: ShippingAddress;
  }) => post("orders", payload),

  // ------------------------------ Authentication ---------------------------------------------
  telegramLogin: (payload: TelegramLoginPayload) =>
    post("users/telegram-login", payload),

  refreshToken: (payload: RefreshTokenPayload) =>
    post("users/refresh", payload),
  // TODO: Add auth endpoints when you provide them
  // login: (payload: LoginPayload) => post("auth/login", payload),
  // register: (payload: RegisterPayload) => post("auth/register", payload),
  // logout: () => post("auth/logout"),

  // ------------------------------ User Profile ---------------------------------------------
  // TODO: Add user profile endpoints when you provide them
  // getUserProfile: () => get("user/profile"),
  // updateUserProfile: (payload: UpdateProfilePayload) => put("user/profile", payload),

  // ------------------------------ Orders ---------------------------------------------
  getOrders: (status?: string) => get("orders", { params: { status } }),
  getOrderById: (orderId: number) => get(`orders/${orderId}`),

  // ------------------------------ Tap To Earn ---------------------------------------------
  getTappingInfo: () => get("tasks/info"),
  processTap: () => post("tasks/tap"),

  // ------------------------------ Admin Dashboard ---------------------------------------------
  getRecentOrders: () => get("admin-dashboard/recent-orders"),
  getRecentUsers: () => get("admin-dashboard/recent-users"),
  getReferralSettings: () => get("admin-dashboard/referrals/settings"),
  updateReferralSettings: (payload: ReferralSettingsPayload) => 
    put("admin-dashboard/referrals/settings", payload),
  getTappingSettings: () => get("admin-dashboard/tapping/settings"),
  updateTappingSettings: (payload: TappingSettingsPayload) => 
    put("admin-dashboard/tapping/settings", payload),

  // ------------------------------ Crypto Payments (NOWPayments) ---------------------------------------------
  createCryptoOrder: (payload: CryptoPaymentPayload) => post("orders", payload),
  getCryptoPaymentStatus: (paymentId: string) => get(`payments/crypto/${paymentId}/status`),
  getSupportedCurrencies: () => get("payments/crypto/currencies"),
};
