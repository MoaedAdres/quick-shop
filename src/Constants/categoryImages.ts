// Category Images Object
export const categoryImages = {
  electronics:
    "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop&auto=format",
  apparel:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&auto=format",
  home: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop&auto=format",
  beauty:
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop&auto=format",
  sport:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
  toy: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop&auto=format",
  food: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format",
  book: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format",
  security:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&auto=format",
  jewelry:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&auto=format",
  automation:
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format",
  automotive:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop&auto=format",
  baby: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop&auto=format",
  pet: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=400&h=300&fit=crop&auto=format",
  tools:
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop&auto=format",
  music:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format",
  art: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&auto=format",
  outdoor:
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&auto=format",
  gaming:
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&auto=format",
  photography:
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&auto=format",
  kitchen:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format",
  bathroom:
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&auto=format",
  shoes:
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format",
  bags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&auto=format",
  watches:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&auto=format",
  lighting:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format",
  furniture:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format",
  wedding:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&auto=format",
  underwear:
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop&auto=format",
  hair: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop&auto=format",
  industrial:
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop&auto=format",
  motorcycle:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format",
  virtual:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop&auto=format",
  novelty:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format",
  secondhand:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&auto=format",
  default:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&auto=format",
};

// Category Image Function
export const getCategoryImage = (categoryName: string): string => {
  const nameLower = categoryName.toLowerCase();

  // Electronics & Technology
  if (
    nameLower.includes("electronics") ||
    nameLower.includes("computer") ||
    nameLower.includes("phone")
  ) {
    return categoryImages.electronics;
  }
  // Consumer Electronics specifically
  else if (nameLower.includes("consumer electronics")) {
    return categoryImages.electronics;
  }
  // Phone accessories
  else if (nameLower.includes("telecommunications accessories")) {
    return categoryImages.electronics;
  }
  // Components
  else if (nameLower.includes("components") || nameLower.includes("supplies")) {
    return categoryImages.electronics;
  }

  // Apparel & Clothing
  else if (
    nameLower.includes("apparel") ||
    nameLower.includes("clothing") ||
    nameLower.includes("fashion")
  ) {
    return categoryImages.apparel;
  } else if (
    nameLower.includes("women's clothing") ||
    nameLower.includes("men's clothing")
  ) {
    return categoryImages.apparel;
  } else if (
    nameLower.includes("sportswear") ||
    (nameLower.includes("sports") && nameLower.includes("clothing"))
  ) {
    return categoryImages.sport;
  }

  // Home & Living
  else if (
    nameLower.includes("home") ||
    nameLower.includes("garden") ||
    nameLower.includes("furniture")
  ) {
    return categoryImages.home;
  } else if (nameLower.includes("appliances")) {
    return categoryImages.home;
  } else if (nameLower.includes("improvement")) {
    return categoryImages.tools;
  }

  // Beauty & Health
  else if (nameLower.includes("beauty") || nameLower.includes("health")) {
    return categoryImages.beauty;
  }

  // Sports & Fitness
  else if (
    nameLower.includes("sport") ||
    nameLower.includes("fitness") ||
    nameLower.includes("entertainment")
  ) {
    return categoryImages.sport;
  }

  // Toys & Hobbies
  else if (nameLower.includes("toy") || nameLower.includes("hobby")) {
    return categoryImages.toy;
  }

  // Food & Grocery
  else if (nameLower.includes("food") || nameLower.includes("grocery")) {
    return categoryImages.food;
  }

  // Books & Office
  else if (
    nameLower.includes("book") ||
    nameLower.includes("office") ||
    nameLower.includes("school")
  ) {
    return categoryImages.book;
  } else if (nameLower.includes("cultural merchandise")) {
    return categoryImages.book;
  }

  // Security & Safety
  else if (
    nameLower.includes("security") ||
    nameLower.includes("safety") ||
    nameLower.includes("protection")
  ) {
    return categoryImages.security;
  }
  // Automotive
  else if (
    nameLower.includes("automobile") ||
    nameLower.includes("car") ||
    nameLower.includes("automotive")
  ) {
    return categoryImages.automotive;
  }
  // Jewelry & Accessories
  else if (nameLower.includes("jewelry") || nameLower.includes("accessories")) {
    return categoryImages.jewelry;
  }

  // Smart/Virtual Products
  else if (
    nameLower.includes("automation") ||
    nameLower.includes("smart") ||
    nameLower.includes("virtual")
  ) {
    return categoryImages.virtual;
  } else if (nameLower.includes("motorcycle")) {
    return categoryImages.motorcycle;
  }

  // Baby & Kids
  else if (
    nameLower.includes("baby") ||
    nameLower.includes("kids") ||
    nameLower.includes("mother")
  ) {
    return categoryImages.baby;
  }

  // Pets
  else if (nameLower.includes("pet") || nameLower.includes("pets")) {
    return categoryImages.pet;
  }

  // Tools & Hardware
  else if (nameLower.includes("tools") || nameLower.includes("hardware")) {
    return categoryImages.tools;
  } else if (
    nameLower.includes("industrial") ||
    nameLower.includes("business")
  ) {
    return categoryImages.industrial;
  }

  // Music & Instruments
  else if (nameLower.includes("music") || nameLower.includes("instruments")) {
    return categoryImages.music;
  }

  // Art & Crafts
  else if (nameLower.includes("art") || nameLower.includes("crafts")) {
    return categoryImages.art;
  }

  // Outdoor & Camping
  else if (nameLower.includes("outdoor") || nameLower.includes("camping")) {
    return categoryImages.outdoor;
  }

  // Gaming
  else if (nameLower.includes("gaming") || nameLower.includes("games")) {
    return categoryImages.gaming;
  }

  // Photography & Camera
  else if (nameLower.includes("photography") || nameLower.includes("camera")) {
    return categoryImages.photography;
  }

  // Kitchen & Cooking
  else if (nameLower.includes("kitchen") || nameLower.includes("cooking")) {
    return categoryImages.kitchen;
  }

  // Bathroom & Personal Care
  else if (nameLower.includes("bathroom") || nameLower.includes("personal")) {
    return categoryImages.bathroom;
  }

  // Specific Categories
  else if (nameLower.includes("shoes")) {
    return categoryImages.shoes;
  } else if (nameLower.includes("bags") || nameLower.includes("luggage")) {
    return categoryImages.bags;
  } else if (nameLower.includes("watches")) {
    return categoryImages.watches;
  } else if (nameLower.includes("lights") || nameLower.includes("lighting")) {
    return categoryImages.lighting;
  } else if (nameLower.includes("wedding") || nameLower.includes("events")) {
    return categoryImages.wedding;
  } else if (nameLower.includes("underwear")) {
    return categoryImages.underwear;
  } else if (nameLower.includes("hair") || nameLower.includes("wigs")) {
    return categoryImages.hair;
  } else if (
    nameLower.includes("novelty") ||
    nameLower.includes("special use")
  ) {
    return categoryImages.novelty;
  } else if (nameLower.includes("second-hand")) {
    return categoryImages.secondhand;
  }

  // Default fallback
  else {
    return categoryImages.default;
  }
};
