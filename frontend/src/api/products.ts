import { api } from './index'
import { Product, ApiResponse } from '../types'

export const productsApi = {
  getProducts: () => api.get<ApiResponse<Product[]>>('/products'),
  getProduct: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
}