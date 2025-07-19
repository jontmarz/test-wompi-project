export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
  category: string
}

export interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardType: 'visa' | 'mastercard' | 'unknown'
  customerData: {
    name: string
    email: string
    phone: string
  }
  shippingAddress: {
    address: string
    city: string
    zipCode: string
    country: string
  }
}

export interface Transaction {
  id: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED'
  amount: number
  currency: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
  wompiTransactionId?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface CardValidation {
  isValid: boolean
  cardType: 'visa' | 'mastercard' | 'unknown'
  errors: string[]
}