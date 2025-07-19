import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductSelection from './pages/ProductSelection'
import PaymentForm from './pages/PaymentForm'
import OrderSummary from './pages/OrderSummary'
import TransactionStatus from './pages/TransactionStatus'
import StockReturn from './pages/StockReturn'
import Layout from './components/Layout'
import { useAppSelector } from './hooks/redux'

function App() {
  const isLoading = useAppSelector(state => state.ui.loading)

  return (
    <Layout>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Procesando...</p>
          </div>
        </motion.div>
      )}
      
      <Routes>
        <Route path="/" element={<ProductSelection />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/summary" element={<OrderSummary />} />
        <Route path="/status" element={<TransactionStatus />} />
        <Route path="/stock-return" element={<StockReturn />} />
      </Routes>
    </Layout>
  )
}

export default App