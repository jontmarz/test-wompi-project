import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../hooks/redux'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const cartItems = useAppSelector(state => state.cart.items)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  
  const showBackButton = location.pathname !== '/'
  const showCart = location.pathname === '/'
  
  return (
    <div className="container-desktop mobile-container">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-900">
              Wompi Store
            </h1>
          </div>
          
          {showCart && (
            <button
              onClick={() => navigate('/summary')}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export default Layout