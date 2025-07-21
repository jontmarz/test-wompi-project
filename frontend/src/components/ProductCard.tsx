import React from 'react'
import { useAppDispatch } from '../hooks/redux'
import { addToCart } from '../store/slices/cartSlice'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch()

  const handleAddToCart = () => {
    if (product.stock > 0) {
      dispatch(addToCart(product))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            ${product.price.toLocaleString()}
          </span>
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              data-testid="add-to-cart-button"
            >
              Agregar
            </button>
          ) : (
            <span className="text-red-500 font-medium">Sin stock</span>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Stock: {product.stock}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
