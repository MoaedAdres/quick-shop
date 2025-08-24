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

// Printify Product Types
export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  options: PrintifyProductOption[];
  variants: PrintifyProductVariant[];
  images: PrintifyProductImage[];
  created_at: string;
  updated_at: string;
  visible: boolean;
  is_locked: boolean;
  blueprint_id: number;
  user_id: number;
  shop_id: number;
  print_provider_id: number;
}

export interface PrintifyProductOption {
  name: string;
  type: string;
  values: PrintifyProductOptionValue[];
  display_in_preview: boolean;
}

export interface PrintifyProductOptionValue {
  id: number;
  title: string;
  colors?: string[];
}

export interface PrintifyProductVariant {
  id: number;
  sku: string;
  cost: number;
  price: number;
  title: string;
  grams: number;
  is_enabled: boolean;
  is_default: boolean;
  is_available: boolean;
  is_printify_express_eligible: boolean;
  options: number[];
  quantity: number;
}

export interface PrintifyProductImage {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
  is_selected_for_publishing: boolean;
  order: number | null;
}

export interface PrintifyProductsResponse {
  data: {
    current_page: number;
    data: PrintifyProduct[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  message: string | null;
}

// Printify Product Details Types
export interface PrintifyProductDetails extends PrintifyProduct {
  print_areas: PrintifyPrintArea[];
  print_details: any[];
  sales_channel_properties: any[];
  is_printify_express_eligible: boolean;
  is_printify_express_enabled: boolean;
  is_economy_shipping_eligible: boolean;
  is_economy_shipping_enabled: boolean;
  is_deleted: boolean;
  original_product_id: string;
  views: PrintifyView[];
}

export interface PrintifyPrintArea {
  variant_ids: number[];
  placeholders: PrintifyPlaceholder[];
  font_color: string;
  font_family: string;
  background: string;
}

export interface PrintifyPlaceholder {
  position: string;
  images: PrintifyPlaceholderImage[];
}

export interface PrintifyPlaceholderImage {
  id: string;
  name: string;
  type: string;
  height: number;
  width: number;
  x: number;
  y: number;
  scale: number;
  angle: number;
  src: string;
  font_family?: string;
  font_size?: number;
  font_weight?: number;
  font_color?: string;
  font_style?: string;
  input_text?: string;
  text_align?: string;
}

export interface PrintifyView {
  id: number;
  label: string;
  position: string;
  files: PrintifyViewFile[];
}

export interface PrintifyViewFile {
  src: string;
  variant_ids: number[];
}

export interface PrintifyProductDetailsResponse {
  data: PrintifyProductDetails;
  message: string | null;
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
    page: number;
    page_size: number;
    total_products: number;
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
  cat_id?: number;
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
  image_url?: string;
}

export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
}

export interface CartResponse {
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
    image_url?: string;
  };
  quantity: number;
}

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

export interface UnshippableProduct {
  product: {
    id: number;
    product: CartProduct;
    quantity: number;
  };
  reason: string;
}

export interface ShippingPreviewError {
  message: string;
  data: {
    unshippable_products: UnshippableProduct[];
  };
}

export interface ShippingPreviewSuccess {
  data: {
    total_shipping_fee: number;
    currency: string;
    estimated_delivery_min_days: number;
    estimated_delivery_max_days: number;
    shipping_companies: string[];
  };
  message: string;
}

// Shipping Types
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

// User Address Types
export interface UserAddress {
  id: number;
  address: string;
  address2?: string | null;
  city: string;
  province: string;
  country: string;
  zip: string;
  contact_person: string;
  full_name: string;
  mobile_no: string;
  phone_country: string;
}

export interface CreateAddressPayload {
  address: string;
  address2?: string | null;
  city: string;
  province: string;
  country: string;
  zip: string;
  contact_person: string;
  full_name: string;
  mobile_no: string;
  phone_country: string;
}

export interface AddressesResponse {
  data: UserAddress[];
  message: string | null;
}

export interface CreateAddressResponse {
  data: UserAddress;
  message: string | null;
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
export interface OrderItem {
  id: number;
  product: CartProduct;
  quantity: number;
}

export interface Order {
  id: number;
  user: number;
  status:
    | "pending"
    | "processing"
    | "paid"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "fulfillment_failed"
    | "Payment_failed";
  payment_method: "crypto" | "stripe";
  paid_at: string | null;
  payment_reference: string;
  supplier: {
    name: string;
    code: string;
  };
  items_price: number;
  shipping_fee: number;
  total_price: number;
  product_total: number;
  currency: string;
  estimated_delivery_min_days: number;
  estimated_delivery_max_days: number;
  full_name: string;
  country: string;
  province: string;
  city: string;
  address: string;
  address2: string | null;
  zip: string;
  mobile_no: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  failure_reason: string | null;
}

export interface OrdersResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Order[];
  };
  message: string | null;
}

export interface OrderDetailsResponse {
  data: Order;
  message: string | null;
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
  refetchInterval?: number | false;
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
  dontShowError?: boolean;
};

export interface TelegramLoginPayload {
  telegram_id: string;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: string;
  hash: string;
  referral_code?: string;
}

export interface TelegramLoginResponse {
  data: {
    user: {
      id: number;
      telegram_id: string;
      firstname: string;
      lastname: string;
      picture_url: string;
      referral_code: string;
    };
    access_token: string;
    refresh_token: string;
  };
  message: string | null;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

// Stripe Payment Types
export interface CreateCheckoutSessionPayload {
  amount: number;
  currency: string;
  shipping_address: ShippingAddress;
  items: CartItem[];
  success_url: string;
  cancel_url: string;
}

export interface CheckoutSessionResponse {
  data: {
    session_id: string;
    url: string;
  };
  message: string | null;
}

export interface StripeOrderResponse {
  data: {
    client_secret: string;
    order_ids: string[];
  };
}

// Tap To Earn Types
export interface TappingInfoResponse {
  data: {
    user_state: {
      current_taps: number;
      remaining_taps_today: number;
    };
    settings: {
      points_per_tap: number;
      taps_for_reward: number;
      reward_amount: number;
      daily_tap_limit: number;
    };
  };
  message: string | null;
}

export interface TappingStatusResponse {
  data: {
    status: boolean;
  };
  message: string | null;
}

export interface ProcessTapResponse {
  data: {
    reward_issued: boolean;
    reward_amount: string;
    new_balance: number;
    current_taps: number;
    remaining_taps_today: number;
    taps_for_reward: number;
  };
  message: string | null;
}

export interface StripePaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

// Admin Dashboard Types
export interface AdminUser {
  id: number;
  username: string;
  firstname: string | null;
  lastname: string | null;
  balance: string;
  referral_code: string;
  created_at: string;
}

export interface AdminOrder {
  id: number;
  user: {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
  };
  status: string;
  total_price: number;
  payment_method: string;
  created_at: string;
  supplier: {
    name: string;
    code: string;
  };
  failure_reason: string | null;
}

export interface AdminRecentOrdersResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: AdminOrder[];
  };
  message: string | null;
}

export interface AdminRecentUsersResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: AdminUser[];
  };
  message: string | null;
}

export interface ReferralSettings {
  reward_amount: string;
}

export interface ReferralSettingsResponse {
  data: ReferralSettings;
  message: string | null;
}

export interface ReferralSettingsPayload {
  reward_amount: number;
}

export interface TappingSettings {
  points_per_tap: number;
  taps_for_reward: number;
  reward_amount: number;
  daily_tap_limit: number;
}

export interface TappingSettingsResponse {
  data: TappingSettings;
  message: string | null;
}

export interface TappingSettingsPayload {
  points_per_tap: number;
  taps_for_reward: number;
  reward_amount: number;
  daily_tap_limit: number;
}

// NOWPayments Crypto Payment Types
export interface CryptoPaymentPayload {
  payment_method: "crypto";
  pay_currency: string;
  delivery_address: ShippingAddress;
}

export interface CryptoPaymentResponse {
  data: {
    payment_id: string;
    payment_status: string;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    amount_received: number;
    pay_currency: string;
    order_id: string;
    order_description: string;
    payin_extra_id: string | null;
    ipn_callback_url: string | null;
    customer_email: string | null;
    created_at: string;
    updated_at: string;
    purchase_id: string;
    smart_contract: string | null;
    network: string;
    network_precision: number | null;
    time_limit: string | null;
    burning_percent: number | null;
    expiration_estimate_date: string;
    is_fixed_rate: boolean;
    is_fee_paid_by_user: boolean;
    valid_until: string;
    type: string;
    product: string;
    origin_ip: string;
  };
  message: string;
}

export interface CryptoPaymentStatus {
  payment_id: string;
  payment_status: 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired';
  pay_address: string;
  price_amount: number;
  pay_amount: number;
  amount_received: number;
  pay_currency: string;
  order_id: string;
  network: string;
  created_at: string;
  updated_at: string;
  expiration_estimate_date: string;
  valid_until: string;
}

export interface SupportedCurrency {
  id: string;
  name: string;
  symbol: string;
  network: string;
  is_popular: boolean;
  logo_url: string;
}
