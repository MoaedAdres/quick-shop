import { backApis } from "./endpoints";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useInfiniteData } from "@/hooks/use-infinit-data";
import { useMutateData } from "@/hooks/use-mutate-data";
import type {
  ProductsResponse,
  CategoriesResponse,
  ProductDetailsResponse,
  SearchProductsResponse,
  SearchParams,
  RecommendedProductsParams,
  CartResponse,
  AddToCartPayload,
  ShippingAddress,
  TelegramLoginPayload,
  TelegramLoginResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  OrdersResponse,
  OrderDetailsResponse,
  Order,
  ShippingPreviewSuccess,
  Product,
  CreateCheckoutSessionPayload,
  CheckoutSessionResponse,
  StripeOrderResponse,
  PrintifyProductsResponse,
  PrintifyProduct,
  PrintifyProductDetailsResponse,
  TappingInfoResponse,
  ProcessTapResponse,
  AdminRecentOrdersResponse,
  AdminRecentUsersResponse,
  ReferralSettingsResponse,
  ReferralSettingsPayload,
  TappingSettingsResponse,
  TappingSettingsPayload,
  CryptoPaymentResponse,
  CryptoPaymentPayload,
  CryptoPaymentStatus,
  SupportedCurrency,
  TappingStatusResponse,
  PaginationParams,
  AddressesResponse,
  CreateAddressResponse,
  CreateAddressPayload,
} from "@/Types/types";

// Query Keys
export const queryKeys = {
  products: {
    all: ["products"] as const,
    recommended: (params: RecommendedProductsParams) =>
      ["products", "recommended", params] as const,
    search: (params: SearchParams) => ["products", "search", params] as const,
    details: (productId: string | number) =>
      ["products", "details", productId] as const,
  },
  categories: {
    all: ["categories"] as const,
    products: (categoryId: string, params: PaginationParams) =>
      ["categories", "products", categoryId, params] as const,
  },
  cart: {
    all: ["cart"] as const,
  },
  auth: {
    all: ["auth"] as const,
  },
  wallet: {
    all: ["wallet"] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (status?: string) => ["orders", "list", status] as const,
    details: (orderId: number) => ["orders", "details", orderId] as const,
  },
  payments: {
    all: ["payments"] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    info: ["tasks", "info"] as const,
    status: ["tasks", "status"] as const,
  },
  admin: {
    all: ["admin"] as const,
    recentOrders: ["admin", "recent-orders"] as const,
    recentUsers: ["admin", "recent-users"] as const,
    referralSettings: ["admin", "referral-settings"] as const,
    tappingSettings: ["admin", "tapping-settings"] as const,
  },
  crypto: {
    all: ["crypto"] as const,
    paymentStatus: (paymentId: string) =>
      ["crypto", "payment-status", paymentId] as const,
    currencies: ["crypto", "currencies"] as const,
  },
};

// ------------------------------ Products Queries ---------------------------------------------

export const useGetRecommendedProducts = (
  params: RecommendedProductsParams
) => {
  return useFetchData<ProductsResponse>({
    queryKey: queryKeys.products.recommended(params),
    queryFn: async () => {
      const response = await backApis.getRecommendedProducts(params);
      return response.data;
    },
  });
};

export const useGetRecommendedProductsInfinite = (
  params: Omit<RecommendedProductsParams, "page">
) => {
  return useInfiniteData<ProductsResponse, unknown, Product[]>({
    queryKey: queryKeys.products.recommended({ ...params, page: 1 }),
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const response = await backApis.getRecommendedProducts({
        ...params,
        page: (pageParam as number) ?? 1,
      });
      return response.data;
    },
    selectFn: (data) => data.pages.flatMap((page) => page.data.products),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ProductsResponse) => {
      if (lastPage?.data?.total_products <= lastPage?.data?.page_size) {
        return undefined;
      }
      return lastPage?.data?.page + 1;
    },
  });
};

export const useGetPrintifyProductsInfinite = (params: {
  page_size?: number;
}) => {
  return useInfiniteData<PrintifyProductsResponse, unknown, PrintifyProduct[]>({
    queryKey: ["products", "printify", params],
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const response = await backApis.getPrintifyProducts({
        page: (pageParam as number) ?? 1,
        per_page: params.page_size || 20,
      });
      return response.data;
    },
    selectFn: (data) => data.pages.flatMap((page) => page.data.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PrintifyProductsResponse) => {
      if (lastPage?.data?.current_page >= lastPage?.data?.last_page) {
        return undefined;
      }
      return lastPage?.data?.current_page + 1;
    },
  });
};

export const useSearchProducts = (
  params: SearchParams,
  enabled: boolean = false
) => {
  return useInfiniteData<SearchProductsResponse, unknown, Product[]>({
    queryKey: queryKeys.products.search(params),
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const response = await backApis.getProductsWithSearch({
        ...params,
        page: (pageParam as number) ?? 1,
      });
      return response.data;
    },
    enableCondition: enabled,
    selectFn: (data) => data.pages.flatMap((page) => page.data.products),
    initialPageParam: 1,
    getNextPageParam: (lastPage: SearchProductsResponse) => {
      if (lastPage?.data?.total_products <= lastPage?.data?.page_size) {
        return undefined;
      }
      return Number(lastPage?.data?.page) + 1;
    },
  });
};

export const useGetProductDetails = (productId: string | number) => {
  return useFetchData<ProductDetailsResponse>({
    queryKey: queryKeys.products.details(productId),
    queryFn: async () => {
      const response = await backApis.getProductDetails(productId);
      return response.data;
    },
    enableCondition: !!productId, // Only run if productId exists
  });
};

export const useGetPrintifyProductDetails = (productId: string) => {
  return useFetchData<PrintifyProductDetailsResponse>({
    queryKey: ["products", "printify", "details", productId],
    queryFn: async () => {
      const response = await backApis.getPrintifyProductDetails(productId);
      return response.data;
    },
    enableCondition: !!productId, // Only run if productId exists
  });
};

// ------------------------------ Categories Queries ---------------------------------------------

export const useGetCategories = () => {
  return useFetchData<CategoriesResponse>({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const response = await backApis.getCategories();
      return response.data;
    },
  });
};

export const useGetCategoryProducts = (
  categoryId: string,
  pageSize: number,
  enabled: boolean
) => {
  return useInfiniteData<ProductsResponse, unknown, Product[]>({
    queryKey: queryKeys.categories.products(categoryId, {
      page: 1,
      page_size: pageSize || 20,
    }),
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const response = await backApis.getCategoryProducts(categoryId, {
        page: (pageParam as number) ?? 1,
        page_size: pageSize || 20,
      });
      return response.data;
    },
    enableCondition: enabled,
    selectFn: (data) => data.pages.flatMap((page) => page.data.products),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ProductsResponse) => {
      if (lastPage?.data?.total_products <= lastPage?.data?.page_size) {
        return undefined;
      }
      return Number(lastPage?.data?.page) + 1;
    },
  });
};

// ------------------------------ Cart Queries & Mutations ---------------------------------------------

export const useGetCart = (enabled = true) => {
  return useFetchData<CartResponse>({
    queryKey: queryKeys.cart.all,
    queryFn: async () => {
      const response = await backApis.getCart();
      return response.data;
    },
    enableCondition: enabled,
  });
};

export const useAddToCart = () => {
  return useMutateData({
    mutationFn: (payload: AddToCartPayload) => backApis.addToCart(payload),
    invalidateKeys: [{ queryKey: queryKeys.cart.all }],
    displaySuccess: false, // Disable automatic success toast
  });
};

export const useDeleteCartItem = () => {
  return useMutateData({
    mutationFn: (itemId: number) => backApis.removeFromCart(itemId),
    invalidateKeys: [{ queryKey: queryKeys.cart.all }],
    displaySuccess: false,
  });
};

// ------------------------------ Payment Mutations ---------------------------------------------

export const useCreateCheckoutSession = () => {
  return useMutateData<CheckoutSessionResponse, CreateCheckoutSessionPayload>({
    mutationFn: async (payload) => {
      const response = await backApis.createCheckoutSession(payload);
      return response;
    },
    displaySuccess: false,
  });
};

export const useCreateStripeOrder = () => {
  return useMutateData<
    StripeOrderResponse,
    { payment_method: "stripe"; delivery_address: ShippingAddress }
  >({
    mutationFn: async (payload) => {
      const response = await backApis.createStripeOrder(payload);
      return response.data;
    },
    displaySuccess: false,
  });
};

// ------------------------------ Authentication Mutations ---------------------------------------------

export const useTelegramLogin = () => {
  return useMutateData<TelegramLoginResponse, TelegramLoginPayload>({
    mutationFn: async (payload) => {
      const response = await backApis.telegramLogin(payload);
      return response?.data;
    },
    displaySuccess: true,
  });
};

export const useRefreshToken = () => {
  return useMutateData<RefreshTokenResponse, RefreshTokenPayload>({
    mutationFn: async (payload) => {
      const response = await backApis.refreshToken(payload);
      return response?.data;
    },
    displaySuccess: false,
  });
};

// ------------------------------ User Profile Queries & Mutations ---------------------------------------------

// TODO: Add when you provide user profile endpoints
// export const useGetUserProfile = () => {
//   return useFetchData<UserProfileResponse>({
//     queryKey: queryKeys.auth.all,
//     queryFn: () => backApis.getUserProfile(),
//   });
// };

// export const useUpdateUserProfile = () => {
//   return useMutateData({
//     mutationFn: (payload: UpdateProfilePayload) => backApis.updateUserProfile(payload),
//     invalidateKeys: [queryKeys.auth.all],
//     displaySuccess: true,
//   });
// };

// ------------------------------ Wallet Queries & Mutations ---------------------------------------------

// TODO: Add when you provide wallet endpoints
// export const useGetWallet = () => {
//   return useFetchData<WalletResponse>({
//     queryKey: queryKeys.wallet.all,
//     queryFn: () => backApis.getWallet(),
//   });
// };

// export const useGetWalletTransactions = (params: TransactionsFilters) => {
//   return useFetchData<WalletTransactionsResponse>({
//     queryKey: [...queryKeys.wallet.all, "transactions", params],
//     queryFn: () => backApis.getWalletTransactions(params),
//   });
// };

// export const useAddMoneyToWallet = () => {
//   return useMutateData({
//     mutationFn: (payload: AddMoneyPayload) => backApis.addMoneyToWallet(payload),
//     displaySuccess: true,
//   });
// };

// Shipping Mutations
export const useShippingPreview = () => {
  return useMutateData<ShippingPreviewSuccess, ShippingAddress>({
    mutationFn: async (address: ShippingAddress) => {
      const response = await backApis.shippingPreview(address);
      return response?.data;
    },
  });
};

// ------------------------------ Orders Queries ---------------------------------------------

export const useGetOrders = (status?: string) => {
  return useFetchData<OrdersResponse, Error, Order[]>({
    queryKey: queryKeys.orders.list(status),
    queryFn: async () => {
      const response = await backApis.getOrders(status);
      return response?.data?.data?.results;
    },
  });
};

export const useGetOrderDetails = (orderId: number) => {
  return useFetchData<OrderDetailsResponse, Error, Order>({
    queryKey: queryKeys.orders.details(orderId),
    queryFn: async () => {
      const response = await backApis.getOrderById(orderId);
      return response?.data?.data;
    },
  });
};

// ------------------------------ Tap To Earn Queries & Mutations ---------------------------------------------

export const useGetTappingInfo = () => {
  return useFetchData<TappingInfoResponse>({
    queryKey: queryKeys.tasks.info,
    queryFn: async () => {
      const response = await backApis.getTappingInfo();
      return response.data;
    },
  });
};

export const useProcessTap = () => {
  return useMutateData<ProcessTapResponse>({
    mutationFn: async () => {
      const response = await backApis.processTap();
      return response.data;
    },
    invalidateKeys: [{ queryKey: queryKeys.tasks.info }],
    displaySuccess: false, // We'll handle success display manually
  });
};

export const useGetTappingStatus = () => {
  return useFetchData<TappingStatusResponse>({
    queryKey: queryKeys.tasks.status,
    queryFn: async () => {
      const response = await backApis.getTappingStatus();
      return response.data;
    },
  });
};
// ------------------------------ Admin Dashboard Queries & Mutations ---------------------------------------------

export const useGetRecentOrders = () => {
  return useFetchData<AdminRecentOrdersResponse>({
    queryKey: queryKeys.admin.recentOrders,
    queryFn: async () => {
      const response = await backApis.getRecentOrders();
      return response.data;
    },
  });
};

export const useGetRecentUsers = () => {
  return useFetchData<AdminRecentUsersResponse>({
    queryKey: queryKeys.admin.recentUsers,
    queryFn: async () => {
      const response = await backApis.getRecentUsers();
      return response.data;
    },
  });
};

export const useGetReferralSettings = () => {
  return useFetchData<ReferralSettingsResponse>({
    queryKey: queryKeys.admin.referralSettings,
    queryFn: async () => {
      const response = await backApis.getReferralSettings();
      return response.data;
    },
  });
};

export const useUpdateReferralSettings = () => {
  return useMutateData<ReferralSettingsResponse, ReferralSettingsPayload>({
    mutationFn: async (payload) => {
      const response = await backApis.updateReferralSettings(payload);
      return response.data;
    },
    invalidateKeys: [{ queryKey: queryKeys.admin.referralSettings }],
    displaySuccess: true,
  });
};

export const useGetTappingSettings = () => {
  return useFetchData<TappingSettingsResponse>({
    queryKey: queryKeys.admin.tappingSettings,
    queryFn: async () => {
      const response = await backApis.getTappingSettings();
      return response.data;
    },
  });
};

export const useUpdateTappingSettings = () => {
  return useMutateData<TappingSettingsResponse, TappingSettingsPayload>({
    mutationFn: async (payload) => {
      const response = await backApis.updateTappingSettings(payload);
      return response.data;
    },
    invalidateKeys: [{ queryKey: queryKeys.admin.tappingSettings }],
    displaySuccess: true,
  });
};

// ------------------------------ Crypto Payment Queries & Mutations ---------------------------------------------

export const useCreateCryptoOrder = () => {
  return useMutateData<CryptoPaymentResponse, CryptoPaymentPayload>({
    mutationFn: async (payload) => {
      const response = await backApis.createCryptoOrder(payload);
      return response.data;
    },
    displaySuccess: false, // We'll handle success display manually
  });
};

export const useGetCryptoPaymentStatus = (
  paymentId: string,
  enabled = false
) => {
  return useFetchData<{ data: CryptoPaymentStatus }>({
    queryKey: queryKeys.crypto.paymentStatus(paymentId),
    queryFn: async () => {
      const response = await backApis.getCryptoPaymentStatus(paymentId);
      return response.data;
    },
    enableCondition: enabled && !!paymentId,
    refetchOnMount: true,
  });
};

export const useGetSupportedCurrencies = () => {
  return useFetchData<{ data: SupportedCurrency[] }>({
    queryKey: queryKeys.crypto.currencies,
    queryFn: async () => {
      const response = await backApis.getSupportedCurrencies();
      return response.data;
    },
  });
};

// ------------------------------ Address Management Queries & Mutations ---------------------------------------------

export const useGetUserAddresses = () => {
  return useFetchData<AddressesResponse>({
    queryKey: ["user-addresses"],
    queryFn: async () => {
      const response = await backApis.getUserAddresses();
      return response.data;
    },
  });
};

export const useCreateAddress = () => {
  return useMutateData<CreateAddressResponse, CreateAddressPayload>({
    mutationFn: async (payload) => {
      const response = await backApis.createAddress(payload);
      return response.data;
    },
    invalidateKeys: [{ queryKey: ["user-addresses"] }],
    displaySuccess: false,
  });
};
