import { backApis } from "./endpoints";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useInfiniteData } from "@/hooks/use-infinit-data";
import type {
  ProductsResponse,
  CategoriesResponse,
  ProductDetailsResponse,
  SearchProductsResponse,
  SearchParams,
  RecommendedProductsParams,
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
  return useInfiniteData<ProductsResponse>({
    queryKey: queryKeys.products.recommended({ ...params, page: 1 }),
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const response = await backApis.getRecommendedProducts({ 
        ...params, 
        page: (pageParam as number) ?? 1
      });
      return response.data;
    },
    getNextPageParam: (lastPage: ProductsResponse) => {
      if (lastPage?.data?.is_finished) {
        return undefined;
      }
      return (lastPage as any)?.nextPage ?? undefined;
    },
  });
};

export const useSearchProducts = (params: SearchParams) => {
  return useFetchData<SearchProductsResponse>({
    queryKey: queryKeys.products.search(params),
    queryFn: async () => {
      const response = await backApis.searchProducts(params);
      return response.data;
    },
    enableCondition: !!params.search.trim(), // Only run if search query exists
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

// ------------------------------ Cart Queries & Mutations ---------------------------------------------

// TODO: Add when you provide cart endpoints
// export const useGetCart = () => {
//   return useFetchData<CartResponse>({
//     queryKey: queryKeys.cart.all,
//     queryFn: () => backApis.getCart(),
//   });
// };

// export const useAddToCart = () => {
//   return useMutateData({
//     mutationFn: (payload: AddToCartPayload) => backApis.addToCart(payload),
//     invalidateKeys: [queryKeys.cart.all],
//     displaySuccess: true,
//   });
// };

// export const useUpdateCartItem = () => {
//   return useMutateData({
//     mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateCartItemPayload }) =>
//       backApis.updateCartItem(itemId, payload),
//     invalidateKeys: [queryKeys.cart.all],
//     displaySuccess: true,
//   });
// };

// export const useRemoveFromCart = () => {
//   return useMutateData({
//     mutationFn: (itemId: string) => backApis.removeFromCart(itemId),
//     invalidateKeys: [queryKeys.cart.all],
//     displaySuccess: true,
//   });
// };

// ------------------------------ Authentication Mutations ---------------------------------------------

// TODO: Add when you provide auth endpoints
// export const useLogin = () => {
//   return useMutateData({
//     mutationFn: (payload: LoginPayload) => backApis.login(payload),
//     displaySuccess: true,
//     onSuccessFn: (data) => {
//       // Handle successful login
//       // Store tokens, update user state, etc.
//     },
//   });
// };

// export const useRegister = () => {
//   return useMutateData({
//     mutationFn: (payload: RegisterPayload) => backApis.register(payload),
//     displaySuccess: true,
//   });
// };

// export const useLogout = () => {
//   return useMutateData({
//     mutationFn: () => backApis.logout(),
//     onSuccessFn: () => {
//       // Clear user state, tokens, etc.
//     },
//   });
// };

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
//     invalidateKeys: [queryKeys.wallet.all],
//     displaySuccess: true,
//   });
// };
