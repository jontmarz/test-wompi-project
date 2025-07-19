import { Result } from '../entities/result';

export interface PaymentRequest {
  amount: number;
  currency: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  customerData: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export interface PaymentGateway {
  processPayment(request: PaymentRequest): Promise<Result<PaymentResponse, string>>;
  getPaymentStatus(id: string): Promise<Result<PaymentResponse, string>>;
}