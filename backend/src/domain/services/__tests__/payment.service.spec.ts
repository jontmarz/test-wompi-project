import { PaymentService } from '../payment.service'
import { PaymentGateway, PaymentRequest } from '../../ports/payment.gateway'
import { ProductRepository } from '../../ports/product.repository'
import { ok, err } from '../../entities/result'

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockPaymentGateway: jest.Mocked<PaymentGateway>;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockPaymentGateway = {
      processPayment: jest.fn(),
      getPaymentStatus: jest.fn(),
    }

    mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    }

    paymentService = new PaymentService(
      mockPaymentGateway,
      mockProductRepository
    )
  })

  describe('processPayment', () => {
    const mockPaymentRequest: PaymentRequest = {
      amount: 100,
      currency: 'COP',
      cardNumber: '4242424242424242',
      expiryDate: '12/25',
      cvv: '123',
      customerData: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '3001234567',
      },
    }

    it('should process payment successfully', async () => {
      const mockPaymentResponse = {
        id: 'payment-123',
        status: 'APPROVED',
        amount: 100,
        currency: 'COP',
        paymentMethod: 'CARD',
      }

      mockPaymentGateway.processPayment.mockResolvedValue(ok(mockPaymentResponse))

      const result = await paymentService.processPayment(mockPaymentRequest)

      expect(result.isError()).toBe(false)
      if (!result.isError()) {
        expect(result.getValue()).toEqual(mockPaymentResponse)
      }
      expect(mockPaymentGateway.processPayment).toHaveBeenCalledWith(mockPaymentRequest)
    })

    it('should handle payment gateway errors', async () => {
      mockPaymentGateway.processPayment.mockResolvedValue(err('Payment failed'))

      const result = await paymentService.processPayment(mockPaymentRequest)

      expect(result.isError()).toBe(true)
      if (result.isError()) {
        expect(result.getError()).toBe('Payment failed')
      }
    })

    it('should validate payment amount', async () => {
      const invalidRequest = { ...mockPaymentRequest, amount: -100 }

      const result = await paymentService.processPayment(invalidRequest)

      expect(result.isError()).toBe(true)
      if (result.isError()) {
        expect(result.getError()).toContain('Amount must be positive')
      }
    })

    it('should validate customer email', async () => {
      const invalidRequest = {
        ...mockPaymentRequest,
        customerData: { ...mockPaymentRequest.customerData, email: 'invalid-email' }
      }

      const result = await paymentService.processPayment(invalidRequest)

      expect(result.isError()).toBe(true)
      if (result.isError()) {
        expect(result.getError()).toContain('Invalid email format')
      }
    })
  })

  describe('getPaymentStatus', () => {
    it('should return payment status', async () => {
      const mockStatus = {
        id: 'payment-123',
        status: 'APPROVED',
        amount: 100,
        currency: 'COP',
        paymentMethod: 'CARD',
      }

      mockPaymentGateway.getPaymentStatus.mockResolvedValue(ok(mockStatus))

      const result = await paymentService.getPaymentStatus('payment-123')

      expect(result.isError()).toBe(false)
      if (!result.isError()) {
        expect(result.getValue()).toEqual(mockStatus)
      }
    })

    it('should handle payment not found', async () => {
      mockPaymentGateway.getPaymentStatus.mockResolvedValue(err('Payment not found'))

      const result = await paymentService.getPaymentStatus('non-existent')

      expect(result.isError()).toBe(true)
      if (result.isError()) {
        expect(result.getError()).toBe('Payment not found')
      }
    })
  })
})
