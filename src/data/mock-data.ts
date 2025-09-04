import type { Product, Category, HeroBanner, User } from "@/Types/types";

// Mock Categories
export const mockCategories: Category[] = [
  {
    name: "Home Improvement",
    category_id: "13",
  },
  {
    name: "Home & Garden",
    category_id: "15",
  },
  {
    name: "Sports & Entertainment",
    category_id: "18",
  },
  {
    name: "Office & School Supplies",
    category_id: "21",
  },
  {
    name: "Toys & Hobbies",
    category_id: "26",
  },
  {
    name: "Security & Protection",
    category_id: "30",
  },
  {
    name: "Automobiles, Parts & Accessories",
    category_id: "34",
  },
  {
    name: "Jewelry & Accessories",
    category_id: "36",
  },
  {
    name: "Lights & Lighting",
    category_id: "39",
  },
  {
    name: "Consumer Electronics",
    category_id: "44",
  },
  {
    name: "Beauty & Health",
    category_id: "66",
  },
  {
    name: "Weddings & Events",
    category_id: "320",
  },
  {
    name: "Shoes",
    category_id: "322",
  },
  {
    name: "Electronic Components & Supplies",
    category_id: "502",
  },
  {
    name: "Phones & Telecommunications",
    category_id: "509",
  },
  {
    name: "Mother & Kids",
    category_id: "1501",
  },
  {
    name: "Furniture",
    category_id: "1503",
  },
  {
    name: "Watches",
    category_id: "1511",
  },
  {
    name: "Luggage & Bags",
    category_id: "1524",
  },
  {
    name: "Women's Clothing",
    category_id: "200000345",
  },
];

// Mock Hero Banners
export const mockHeroBanners: HeroBanner[] = [
  {
    id: "summer-sale",
    title: "Summer Sale",
    subtitle: "Up to 70% off on selected items",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    link: "/category/sale",
    backgroundColor: "#ff6b6b",
    textColor: "white",
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Discover the latest trends",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop",
    link: "/category/new",
    backgroundColor: "#4ecdc4",
    textColor: "white",
  },
  {
    id: "free-shipping",
    title: "Free Shipping",
    subtitle: "On orders over $50",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    backgroundColor: "#45b7d1",
    textColor: "white",
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 1,
    product_id: "1005005965122809",
    title: "Wireless Bluetooth Headphones",
    main_image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    sale_price: "89.99",
    sale_price_currency: "USD",
    original_price: "129.99",
    original_price_currency: "USD",
    discount: 31,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    product_id: "1005005965122810",
    title: "Premium Cotton T-Shirt",
    main_image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Apparel",
    sale_price: "24.99",
    sale_price_currency: "USD",
    original_price: "34.99",
    original_price_currency: "USD",
    discount: 29,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 3,
    product_id: "1005005965122811",
    title: "Smart LED Desk Lamp",
    main_image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    category: "Home & Decor",
    sale_price: "59.99",
    sale_price_currency: "USD",
    original_price: "59.99",
    original_price_currency: "USD",
    discount: 0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 4,
    product_id: "1005005965122812",
    title: "Organic Face Cream",
    main_image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    category: "Beauty",
    sale_price: "34.99",
    sale_price_currency: "USD",
    original_price: "34.99",
    original_price_currency: "USD",
    discount: 0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 5,
    product_id: "1005005965122813",
    title: "Yoga Mat Premium",
    main_image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    category: "Sports",
    sale_price: "29.99",
    sale_price_currency: "USD",
    original_price: "39.99",
    original_price_currency: "USD",
    discount: 25,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 6,
    product_id: "1005005965122814",
    title: "Bestseller Novel",
    main_image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    category: "Books",
    sale_price: "19.99",
    sale_price_currency: "USD",
    original_price: "19.99",
    original_price_currency: "USD",
    discount: 0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 7,
    product_id: "1005005965122815",
    title: "Wireless Charging Pad",
    main_image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    category: "Electronics",
    sale_price: "49.99",
    sale_price_currency: "USD",
    original_price: "69.99",
    original_price_currency: "USD",
    discount: 29,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 8,
    product_id: "1005005965122816",
    title: "Denim Jacket Classic",
    main_image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
    category: "Apparel",
    sale_price: "79.99",
    sale_price_currency: "USD",
    original_price: "79.99",
    original_price_currency: "USD",
    discount: 0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

// Mock User
export const mockUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  phone: "+1 (555) 123-4567",
  addresses: [
    {
      id: "addr-1",
      type: "home",
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      isDefault: true,
    },
    {
      id: "addr-2",
      type: "work",
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      country: "USA",
      isDefault: false,
    },
  ],
  defaultAddressId: "addr-1",
  createdAt: "2024-01-01T10:00:00Z",
  updatedAt: "2024-01-01T10:00:00Z",
};
