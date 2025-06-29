import type {
  InfiniteData,
  MutationFunction,
  MutationKey,
  InvalidateQueryFilters,
  QueryKey,
  QueryObserverSuccessResult,
} from "@tanstack/react-query";
import type { CSSProperties, ReactNode } from "react";

export type BreadCrumbObject = {
  path: string;
  title: string;
};

export interface RFlexProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: React.Ref<HTMLElement>;
}

export type RSearchInputProps = {
  searchData: string;
  handleSearchClicked: (value: string) => void;
  handleDataChanged: (value: string) => void;
  searchLoading?: boolean;
  placeholder?: string;
  inputDisabled?: boolean;
  className?: string;
  removeCloseIcon?: boolean;
  inputClassName?: string;
  hideClearIcon?: boolean;
};

// Product Types
export interface Product {
  title: string;
  product_id: string | number;
  main_image: string;
  small_images?: string[];
  category?: {
    id: number;
    name: string;
  };
  second_level_category?: {
    id: number;
    name: string;
  };
  sale_price: string;
  sale_price_currency: string;
  original_price: string;
  original_price_currency: string;
  original_price_target?: string;
  original_price_target_currency?: string;
  discount: string;
}

// Product Details Types
export interface ProductDetails {
  sku_info: {
    sku_id: string;
    sku_attr: string;
    offer_sale_price: string;
    price_include_tax: boolean;
    currency_code: string;
    sku_available_stock: number;
  };
  media_info: {
    images: string[];
    video: string | null;
  };
  package_info: {
    package_width: number;
    package_height: number;
    package_length: number;
    gross_weight: string;
  };
  title: string;
  sales_count: string;
  product_status_type: string;
  store_info: {
    store_name: string;
    store_country_code: string;
    item_as_described_rating: string;
    communication_rating: string;
    shipping_speed_rating: string;
    store_id: number;
  };
}

// Category Types
export interface Category {
  id: number;
  name: string;
  sub_categories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
}

// API Response Types
export interface ProductsResponse {
  data: {
    current_products_count: number;
    total_products_count: number;
    is_finished: boolean;
    products: Product[];
  };
  message: string | null;
}

export interface SearchProductsResponse {
  data: {
    page_size: number;
    total_products: number;
    page: number;
    products: Product[];
  };
  message: string | null;
}

export interface CategoriesResponse {
  data: Category[];
  message: string | null;
}

export interface ProductDetailsResponse {
  data: ProductDetails;
  message: string | null;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  page_size: number;
}

export interface SearchParams extends PaginationParams {
  search: string;
  local?: string;
  country?: string;
  currency?: string;
}

export interface RecommendedProductsParams extends PaginationParams {
  type: string;
}

// Cart Types
export interface CartProduct {
  id: number;
  name: string;
  price: string;
  supplier: {
    name: string;
    code: string;
  };
  product_id: string;
  sku_id?: string;
  sku_attr?: string;
}

export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  created_at: string;
}

export interface AddToCartPayload {
  source: string;
  product: {
    product_id: string;
    name: string;
    sku_id: string;
    sku_attr: string;
    price: number;
  };
  quantity: number;
}

// Shipping Types
export interface ShippingAddress {
  address: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  contact_person: string;
  full_name: string;
  mobile_no: string;
  phone_country: string;
  order_comment?: string;
}

export interface ShippingPreview {
  total_shipping_fee: number;
  currency: string;
  estimated_delivery_min_days: number;
  estimated_delivery_max_days: number;
  shipping_companies: string[];
}

export interface ShippingPreviewResponse {
  data: ShippingPreview;
  message: string;
}

// API Response Types
export interface CartResponse {
  data: Cart;
  message: string | null;
}

export interface ShippingPreviewResponse {
  data: ShippingPreview;
  message: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  defaultAddressId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Wallet Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// Hero Banner Types
export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
}

// Search Types
export interface SearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  sortBy?: "price" | "rating" | "newest" | "popular";
  sortOrder?: "asc" | "desc";
}

// Navigation Types
export type TabType = "home" | "cart" | "profile" | "wallet";

export interface TabItem {
  id: TabType;
  title: string;
  icon: string;
  path: string;
  badge?: number;
}

export type UseFetchDataParams<TData = any, _ = any, TSelected = any> = {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  enableCondition?: boolean;
  refetchOnMount?: boolean;
  retry?: number;
  onSuccessFn?: (data: TSelected) => void;
  onErrorFn?: (errorMessage: string) => void;
  selectFn?: (data: TData) => TSelected;
};

export type UseInfiniteDataParams<TQueryFnData, TError, TSelected> = {
  queryKey: QueryKey;
  queryFn: (context: { pageParam?: unknown }) => Promise<TQueryFnData>;
  enableCondition?: boolean;
  retry?: number;
  getNextPageParam: (
    lastPage: TQueryFnData,
    allPages: TQueryFnData[]
  ) => unknown;
  onSuccessFn?: (data: QueryObserverSuccessResult<TSelected, TError>) => void;
  onErrorFn?: (errorMessage: string) => void;
  selectFn?: (data: InfiniteData<TQueryFnData>) => TSelected;
  refetchOnMount?: boolean;
  initialPageParam?: unknown;
};
export type UseMutateDataOptions<
  TData = any,
  TVariables = any,
  TError = any
> = {
  mutationFn: MutationFunction<TData, TVariables>;
  mutationKey?: MutationKey;
  invalidateKeys?: InvalidateQueryFilters[]; // QueryKey[] is valid for invalidation
  displaySuccess?: boolean; // Whether to display a success message
  navigateToPath?: string; // Path to navigate after success
  onSuccessFn?: (data: TData, variables: TVariables) => void; // Custom onSuccess handler
  onErrorFn?: (errorMessage: TError, variables: TVariables) => void; // Custom onError handler
  dispatch?: boolean; // Whether to dispatch an action
  action?: (data: TData) => any; // Redux action creator
  downloadFile?: boolean;
  mimeType?: string;
  fileName?: string;
};
