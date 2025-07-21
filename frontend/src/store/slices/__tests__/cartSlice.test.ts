import cartReducer, { addToCart, removeFromCart, clearCart, updateQuantity } from '../cartSlice'
import { Product } from '../../../types'

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  image: 'test.jpg',
  stock: 10,
  category: 'electronics'
}

describe('cartSlice', () => {
  const initialState = {
    items: [],
    total: 0,
  }

  test('should return the initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  test('should handle addToCart', () => {
    const actual = cartReducer(initialState, addToCart({ product: mockProduct, quantity: 1 }))
    expect(actual.items).toHaveLength(1)
    expect(actual.items[0]).toEqual({
      product: mockProduct,
      quantity: 1
    })
    expect(actual.total).toBe(100)
  })

  test('should increase quantity when adding same product', () => {
    const stateWithItem = {
      items: [{ product: mockProduct, quantity: 1 }],
      total: 100,
    }
    
    const actual = cartReducer(stateWithItem, addToCart({ product: mockProduct, quantity: 1 }))
    expect(actual.items).toHaveLength(1)
    expect(actual.items[0].quantity).toBe(2)
    expect(actual.total).toBe(200)
  })

  test('should handle removeFromCart', () => {
    const stateWithItem = {
      items: [{ product: mockProduct, quantity: 2 }],
      total: 200,
    }
    
    const actual = cartReducer(stateWithItem, removeFromCart('1'))
    expect(actual.items).toHaveLength(0)
    expect(actual.total).toBe(0)
  })

  test('should handle updateQuantity', () => {
    const stateWithItem = {
      items: [{ product: mockProduct, quantity: 1 }],
      total: 100,
    }
    
    const actual = cartReducer(stateWithItem, updateQuantity({ productId: '1', quantity: 3 }))
    expect(actual.items[0].quantity).toBe(3)
    expect(actual.total).toBe(300)
  })

  test('should handle clearCart', () => {
    const stateWithItems = {
      items: [{ product: mockProduct, quantity: 2 }],
      total: 200,
    }
    
    const actual = cartReducer(stateWithItems, clearCart())
    expect(actual.items).toHaveLength(0)
    expect(actual.total).toBe(0)
  })
})
