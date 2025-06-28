import type { Product, Category, HeroBanner, User } from "@/Types/types";
import { icons } from "@/Constants/icons";

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    icon: icons.electronics,
    productCount: 45,
  },
  {
    id: "apparel",
    name: "Apparel",
    icon: icons.apparel,
    productCount: 32,
  },
  {
    id: "home-decor",
    name: "Home & Decor",
    icon: icons.homeDecor,
    productCount: 28,
  },
  {
    id: "beauty",
    name: "Beauty",
    icon: icons.beauty,
    productCount: 19,
  },
  {
    id: "sports",
    name: "Sports",
    icon: icons.sports,
    productCount: 23,
  },
  {
    id: "books",
    name: "Books",
    icon: icons.books,
    productCount: 15,
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
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and long battery life.",
    price: 89.99,
    originalPrice: 129.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    ],
    category: "electronics",
    tags: ["wireless", "bluetooth", "noise-cancellation"],
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    isOnSale: true,
    discountPercentage: 31,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Premium Cotton T-Shirt",
    description:
      "Comfortable and stylish cotton t-shirt perfect for everyday wear.",
    price: 24.99,
    originalPrice: 34.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    ],
    category: "apparel",
    tags: ["cotton", "comfortable", "casual"],
    rating: 4.2,
    reviewCount: 89,
    inStock: true,
    stockCount: 50,
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 29,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    name: "Smart LED Desk Lamp",
    description:
      "Modern LED desk lamp with adjustable brightness and color temperature.",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    ],
    category: "home-decor",
    tags: ["led", "adjustable", "modern"],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockCount: 15,
    isFeatured: true,
    isOnSale: false,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "4",
    name: "Organic Face Cream",
    description: "Natural and organic face cream for all skin types.",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    ],
    category: "beauty",
    tags: ["organic", "natural", "face-cream"],
    rating: 4.3,
    reviewCount: 67,
    inStock: true,
    stockCount: 30,
    isFeatured: false,
    isOnSale: false,
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "5",
    name: "Yoga Mat Premium",
    description:
      "Non-slip yoga mat perfect for home workouts and studio sessions.",
    price: 29.99,
    originalPrice: 39.99,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    ],
    category: "sports",
    tags: ["yoga", "non-slip", "workout"],
    rating: 4.6,
    reviewCount: 94,
    inStock: true,
    stockCount: 40,
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 25,
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "6",
    name: "Bestseller Novel",
    description: "Award-winning novel that has captured readers worldwide.",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    ],
    category: "books",
    tags: ["bestseller", "award-winning", "fiction"],
    rating: 4.8,
    reviewCount: 203,
    inStock: false,
    stockCount: 0,
    isFeatured: true,
    isOnSale: false,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
  },
  {
    id: "7",
    name: "Wireless Charging Pad",
    description:
      "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 49.99,
    originalPrice: 69.99,
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    ],
    category: "electronics",
    tags: ["wireless", "charging", "qi-enabled"],
    rating: 4.4,
    reviewCount: 78,
    inStock: true,
    stockCount: 20,
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 29,
    createdAt: "2024-01-22T10:00:00Z",
    updatedAt: "2024-01-22T10:00:00Z",
  },
  {
    id: "8",
    name: "Denim Jacket Classic",
    description: "Timeless denim jacket perfect for any casual occasion.",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
    ],
    category: "apparel",
    tags: ["denim", "jacket", "classic"],
    rating: 4.1,
    reviewCount: 45,
    inStock: true,
    stockCount: 35,
    isFeatured: false,
    isOnSale: false,
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
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
