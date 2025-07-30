export const categoryImages = {
  // Electronics
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&crop=center",
  computer: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop&crop=center",
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center",
  
  // Apparel & Fashion
  apparel: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center",
  clothing: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&crop=center",
  fashion: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=200&fit=crop&crop=center",
  
  // Home & Garden
  home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center",
  garden: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center",
  furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop&crop=center",
  
  // Beauty & Health
  beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop&crop=center",
  health: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
  
  // Sports & Fitness
  sport: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
  fitness: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
  
  // Toys & Hobbies
  toy: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop&crop=center",
  hobby: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop&crop=center",
  
  // Food & Grocery
  food: "https://images.unsplash.com/photo-1504674900240-8947e31be3f6?w=200&h=200&fit=crop&crop=center",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center",
  
  // Books & Office
  book: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=center",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop&crop=center",
  
  // Default
  default: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center"
} as const;

export const getCategoryImage = (categoryName: string): string => {
  const nameLower = categoryName.toLowerCase();
  
  if (nameLower.includes('electronics') || nameLower.includes('computer') || nameLower.includes('phone')) {
    return categoryImages.electronics;
  } else if (nameLower.includes('apparel') || nameLower.includes('clothing') || nameLower.includes('fashion')) {
    return categoryImages.apparel;
  } else if (nameLower.includes('home') || nameLower.includes('garden') || nameLower.includes('furniture')) {
    return categoryImages.home;
  } else if (nameLower.includes('beauty') || nameLower.includes('health')) {
    return categoryImages.beauty;
  } else if (nameLower.includes('sport') || nameLower.includes('fitness')) {
    return categoryImages.sport;
  } else if (nameLower.includes('toy') || nameLower.includes('hobby')) {
    return categoryImages.toy;
  } else if (nameLower.includes('food') || nameLower.includes('grocery')) {
    return categoryImages.food;
  } else if (nameLower.includes('book') || nameLower.includes('office')) {
    return categoryImages.book;
  } else {
    return categoryImages.default;
  }
}; 