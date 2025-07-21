import { configureStore } from '@reduxjs/toolkit'
import productsReducer, { fetchProducts } from '../productsSlice'

describe('ProductsSlice', () => {
  let store: any

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productsReducer,
      },
    })
  })

  test('should return the initial state', () => {
    const state = store.getState().products
    expect(state.items).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  test('should handle fetchProducts.pending', () => {
    store.dispatch(fetchProducts.pending('', undefined))
    const state = store.getState().products
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  test('should handle fetchProducts.fulfilled', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100, description: 'Test', image: 'test.jpg', stock: 10 },
      { id: '2', name: 'Product 2', price: 200, description: 'Test 2', image: 'test2.jpg', stock: 5 }
    ]
    
    store.dispatch(fetchProducts.fulfilled(mockProducts, '', undefined))
    const state = store.getState().products
    expect(state.loading).toBe(false)
    expect(state.items).toEqual(mockProducts)
    expect(state.error).toBeNull()
  })

  test('should handle fetchProducts.rejected', () => {
    const errorMessage = 'Failed to fetch products'
    store.dispatch(fetchProducts.rejected(new Error(errorMessage), '', undefined))
    const state = store.getState().products
    expect(state.loading).toBe(false)
    expect(state.error).toBe(errorMessage)
  })
})
