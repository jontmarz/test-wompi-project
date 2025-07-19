import { api } from './index'
import { PaymentData, Transaction, ApiResponse } from '../types'

export const paymentsApi = {
  createTransaction: (data: PaymentData) => 
    api.post<ApiResponse<Transaction>>('/payments/create', data),
  
  getTransactionStatus: (id: string) => 
    api.get<ApiResponse<Transaction>>(`/payments/status/${id}`),
}