import api from '@/Config/axios';
import type { 
  ProductsResponse, 
  CategoriesResponse, 
  ProductDetailsResponse, 
  SearchProductsResponse,
  SearchParams,
  RecommendedProductsParams
} from '@/Types/types';

export class ApiService {
  // Get recommended products
  static async getRecommendedProducts(params: RecommendedProductsParams): Promise<ProductsResponse> {
    const { page, page_size, type } = params;
    const response = await api.get(`/products?page=${page}&page_size=${page_size}&type=${type}`);
    return response.data;
  }

  // Get all categories
  static async getCategories(): Promise<CategoriesResponse> {
    const response = await api.get('/products/categories');
    return response.data;
  }

  // Search products
  static async searchProducts(params: SearchParams): Promise<SearchProductsResponse> {
    const { search, local = 'en_US', country = 'US', currency = 'USD', page, page_size } = params;
    const response = await api.get(`/products/products?search=${encodeURIComponent(search)}&local=${local}&country=${country}&currency=${currency}&page=${page}&page_size=${page_size}`);
    return response.data;
  }

  // Get product details
  static async getProductDetails(productId: string | number): Promise<ProductDetailsResponse> {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  }
}

export default ApiService; 