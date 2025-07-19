import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCartIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchProducts } from '../store/slices/productsSlice'
import { addToCart, updateQuantity } from '../store/slices/cartSlice'
import { Product } from '../types'

const ProductSelection: React.FC = () => {
  // console.log('ProductSelection component rendered')
  
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: products, loading, error } = useAppSelector((state) => state.products)
  const cart = useAppSelector((state) => state.cart.items)
  
  /* console.log('Redux products state:', products)
  console.log('Loading:', loading)
  console.log('Error:', error) */
  
  useEffect(() => {
    // console.log('useEffect - fetching products')
    dispatch(fetchProducts())
  }, [dispatch])

  const getCartQuantity = (productId: string): number => {
    const cartItem = cart.find(item => item.product.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product)
    dispatch(addToCart({
      product: product,
      quantity: 1
    }))
  }

  const handleUpdateQuantity = (productId: string, change: number) => {
    const currentQuantity = getCartQuantity(productId)
    const newQuantity = currentQuantity + change
    
    if (newQuantity >= 0) {
      dispatch(updateQuantity({ productId: productId, quantity: newQuantity }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => dispatch(fetchProducts())}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Selecciona tus Productos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestra selección de productos premium y añade los que más te gusten al carrito
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const cartQuantity = getCartQuantity(product.id)
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.stock < 10 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                        ¡Pocas unidades!
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>

                    {cartQuantity === 0 ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        {product.stock === 0 ? 'Sin Stock' : 'Añadir al Carrito'}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleUpdateQuantity(product.id, -1)}
                          className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <MinusIcon className="w-5 h-5" />
                        </button>
                        
                        <span className="text-lg font-semibold px-4">
                          {cartQuantity}
                        </span>
                        
                        <button
                          onClick={() => handleUpdateQuantity(product.id, 1)}
                          disabled={cartQuantity >= product.stock}
                          className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            id="card-button"
            onClick={() => navigate('/summary')}
            className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="w-6 h-6" />
              <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductSelection