import type { Product, Category, HeroBanner, User } from "@/Types/types";

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    sub_categories: [
      { id: 1, name: "Smartphones" },
      { id: 2, name: "Laptops" },
      { id: 3, name: "Accessories" },
    ],
  },
  {
    id: 2,
    name: "Apparel",
    sub_categories: [
      { id: 4, name: "Men's Clothing" },
      { id: 5, name: "Women's Clothing" },
      { id: 6, name: "Kids' Clothing" },
    ],
  },
  {
    id: 3,
    name: "Home & Decor",
    sub_categories: [
      { id: 7, name: "Furniture" },
      { id: 8, name: "Kitchen" },
      { id: 9, name: "Lighting" },
    ],
  },
  {
    id: 4,
    name: "Beauty",
    sub_categories: [
      { id: 10, name: "Skincare" },
      { id: 11, name: "Makeup" },
      { id: 12, name: "Haircare" },
    ],
  },
  {
    id: 5,
    name: "Sports",
    sub_categories: [
      { id: 13, name: "Fitness" },
      { id: 14, name: "Outdoor" },
      { id: 15, name: "Team Sports" },
    ],
  },
  {
    id: 6,
    name: "Books",
    sub_categories: [
      { id: 16, name: "Fiction" },
      { id: 17, name: "Non-Fiction" },
      { id: 18, name: "Educational" },
    ],
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
    title: "Wireless Bluetooth Headphones",
    product_id: "1005005965122809",
    main_image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    small_images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    ],
    category: {
      id: 1,
      name: "Electronics",
    },
    second_level_category: {
      id: 1,
      name: "Smartphones",
    },
    sale_price: "89.99",
    sale_price_currency: "USD",
    original_price: "129.99",
    original_price_currency: "USD",
    original_price_target: "129.99",
    original_price_target_currency: "USD",
    discount: "31",
  },
  {
    title: "Premium Cotton T-Shirt",
    product_id: "1005005965122810",
    main_image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    small_images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    ],
    category: {
      id: 2,
      name: "Apparel",
    },
    second_level_category: {
      id: 4,
      name: "Men's Clothing",
    },
    sale_price: "24.99",
    sale_price_currency: "USD",
    original_price: "34.99",
    original_price_currency: "USD",
    original_price_target: "34.99",
    original_price_target_currency: "USD",
    discount: "29",
  },
  {
    title: "Smart LED Desk Lamp",
    product_id: "1005005965122811",
    main_image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    small_images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    ],
    category: {
      id: 3,
      name: "Home & Decor",
    },
    second_level_category: {
      id: 9,
      name: "Lighting",
    },
    sale_price: "59.99",
    sale_price_currency: "USD",
    original_price: "59.99",
    original_price_currency: "USD",
    discount: "0",
  },
  {
    title: "Organic Face Cream",
    product_id: "1005005965122812",
    main_image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    small_images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    ],
    category: {
      id: 4,
      name: "Beauty",
    },
    second_level_category: {
      id: 10,
      name: "Skincare",
    },
    sale_price: "34.99",
    sale_price_currency: "USD",
    original_price: "34.99",
    original_price_currency: "USD",
    discount: "0",
  },
  {
    title: "Yoga Mat Premium",
    product_id: "1005005965122813",
    main_image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    small_images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    ],
    category: {
      id: 5,
      name: "Sports",
    },
    second_level_category: {
      id: 13,
      name: "Fitness",
    },
    sale_price: "29.99",
    sale_price_currency: "USD",
    original_price: "39.99",
    original_price_currency: "USD",
    original_price_target: "39.99",
    original_price_target_currency: "USD",
    discount: "25",
  },
  {
    title: "Bestseller Novel",
    product_id: "1005005965122814",
    main_image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    small_images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    ],
    category: {
      id: 6,
      name: "Books",
    },
    second_level_category: {
      id: 16,
      name: "Fiction",
    },
    sale_price: "19.99",
    sale_price_currency: "USD",
    original_price: "19.99",
    original_price_currency: "USD",
    discount: "0",
  },
  {
    title: "Wireless Charging Pad",
    product_id: "1005005965122815",
    main_image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    small_images: [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    ],
    category: {
      id: 1,
      name: "Electronics",
    },
    second_level_category: {
      id: 3,
      name: "Accessories",
    },
    sale_price: "49.99",
    sale_price_currency: "USD",
    original_price: "69.99",
    original_price_currency: "USD",
    original_price_target: "69.99",
    original_price_target_currency: "USD",
    discount: "29",
  },
  {
    title: "Denim Jacket Classic",
    product_id: "1005005965122816",
    main_image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
    small_images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
    ],
    category: {
      id: 2,
      name: "Apparel",
    },
    second_level_category: {
      id: 4,
      name: "Men's Clothing",
    },
    sale_price: "79.99",
    sale_price_currency: "USD",
    original_price: "79.99",
    original_price_currency: "USD",
    discount: "0",
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
