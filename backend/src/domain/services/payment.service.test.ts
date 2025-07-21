import { PaymentService } from './payment.service'
import { PaymentGateway, PaymentRequest } from '../ports/payment.gateway'
import { ProductRepository } from '../ports/product.repository'
import { err, ok } from '../entities/result'

describe('PaymentService', () => {
  let paymentService: PaymentService
  let mockPaymentGateway: jest.Mocked<PaymentGateway>
  let mockProductRepository: jest.Mocked<ProductRepository>

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
    
    paymentService = new PaymentService(mockPaymentGateway, mockProductRepository)
  })

  test('should process payment successfully', async () => {
    const mockPaymentRequest: PaymentRequest = {
      amount: 1000,
      currency: 'COP',
      cardNumber: '4111111111111111',
      expiryDate: '12/25',
      cvv: '123',
      customerData: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '1234567890'
      }
    }

    const mockCartItems = [
      { id: '1', name: 'Product 1', price: 500, quantity: 2 }
    ]

    const mockPaymentResponse = {
      id: 'payment_123',
      status: 'APPROVED',
      amount: 1000,
      currency: 'COP',
      paymentMethod: 'CARD'
    }

    // Mock product repository to return success for stock validation
    mockProductRepository.findById.mockResolvedValue(ok({
      id: '1',
      name: 'Product 1',
      price: 500,
      stock: 10,
      category: 'test',
      description: 'test product',
      image: 'test.jpg'
    }))

    mockPaymentGateway.processPayment.mockResolvedValue(ok(mockPaymentResponse))

    const result = await paymentService.processPayment(mockPaymentRequest, mockCartItems)

    expect(result.isError()).toBe(false)
    expect(mockPaymentGateway.processPayment).toHaveBeenCalledWith(mockPaymentRequest)
  })

  test('should handle payment processing error', async () => {
    const mockPaymentRequest: PaymentRequest = {
      amount: 1000,
      currency: 'COP',
      cardNumber: '4111111111111111',
      expiryDate: '12/25',
      cvv: '123',
      customerData: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '1234567890'
      }
    }

    const mockCartItems = [
      { id: '1', name: 'Product 1', price: 500, quantity: 2 }
    ]

    // Mock product repository to return success for stock validation
    mockProductRepository.findById.mockResolvedValue(ok({
      id: '1',
      name: 'Product 1',
      price: 500,
      stock: 10,
      category: 'test',
      description: 'test product',
      image: 'test.jpg'
    }))

    mockPaymentGateway.processPayment.mockResolvedValue(err('Payment failed'))

    const result = await paymentService.processPayment(mockPaymentRequest, mockCartItems)

    expect(result.isError()).toBe(true)
    expect(result.getError()).toBe('Payment failed')
  })
})
})
