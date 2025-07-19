import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchProducts } from '../store/slices/productsSlice'
import { addToCart, updateQuantity } from '../store/slices/cartSlice'
import { Product } from '../types'

const ProductSelection: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items: products, loading, error } = useAppSelector(state => state.products)
  const cartItems = useAppSelector(state => state.cart.items)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }))
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return
    dispatch(updateQuantity({ productId, quantity }))
  }

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-error-50 border border-error-200 rounded-lg m-4">
        <p className="text-error-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Productos Disponibles</h2>
        <p className="text-gray-600">Selecciona los productos que deseas comprar</p>
      </div>

      <div className="grid gap-4">
        {products.map((product) => {
          const cartQuantity = getCartQuantity(product.id)
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-primary-600">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                {cartQuantity === 0 ? (
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <ShoppingCart size={16} />
                    <span>Agregar al carrito</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleUpdateQuantity(product.id, cartQuantity - 1)}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{cartQuantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(product.id, cartQuantity + 1)}
                      disabled={cartQuantity >= product.stock}
                      className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductSelection