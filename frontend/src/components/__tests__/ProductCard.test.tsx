import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ProductCard from '../ProductCard'
import { Product } from '../../types'
import cartSlice from '../../store/slices/cartSlice'
import '@testing-library/jest-dom'

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  image: 'test.jpg',
  stock: 10,
  category: 'electronics'
}

const createMockStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice,
    },
    preloadedState: {
      cart: {
        items: [],
        total: 0,
      },
    },
  })
}

describe('ProductCard', () => {
  test('renders product information correctly', () => {
    const store = createMockStore()
    
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Stock: 10')).toBeInTheDocument()
  })
  
  test('shows "Sin stock" when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    const store = createMockStore()
    
    render(
      <Provider store={store}>
        <ProductCard product={outOfStockProduct} />
      </Provider>
    )
    
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
    expect(screen.queryByTestId('add-to-cart-button')).not.toBeInTheDocument()
  })

  test('shows add to cart button when stock is available', () => {
    const store = createMockStore()
    
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )
    
    const addButton = screen.getByTestId('add-to-cart-button')
    expect(addButton).toBeInTheDocument()
    expect(addButton).toHaveTextContent('Agregar')
  })

  test('dispatches addToCart action when button is clicked', () => {
    const store = createMockStore()
    const dispatch = jest.spyOn(store, 'dispatch')
    
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )
    
    const addButton = screen.getByTestId('add-to-cart-button')
    fireEvent.click(addButton)
    
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'cart/addToCart',
        payload: mockProduct
      })
    )
  })
})
