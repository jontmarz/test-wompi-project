// Frontend tests
// src/components/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../store'
import ProductCard from '../ProductCard'
import { Product } from '../../types'

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  image: 'test.jpg',
  stock: 10
}

describe('ProductCard', () => {
  test('renders product information', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
  })
  
  test('shows out of stock when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(
      <Provider store={store}>
        <ProductCard product={outOfStockProduct} />
      </Provider>
    )
    
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })
})
