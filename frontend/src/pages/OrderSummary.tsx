import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { createTransaction } from '../store/slices/paymentSlice'
import { clearCart } from '../store/slices/cartSlice'

const OrderSummary: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector(state => state.cart)
  const { paymentData } = useAppSelector(state => state.payment)

  const handleConfirmOrder = async () => {
    if (!paymentData) {
      navigate('/payment')
      return
    }

    try {
      await dispatch(createTransaction(paymentData))
      dispatch(clearCart())
      navigate('/status')
    } catch (error) {
      console.error('Error creating transaction:', error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Tu carrito está vacío
        </h2>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Ir a comprar
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resumen de Compra</h2>
        <p className="text-gray-600">Revisa tu pedido antes de confirmar</p>
      </div>

      {/* Items del carrito */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4">Productos</h3>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.product.price.toLocaleString()} x {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-semibold">
                ${(item.product.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Información de pago */}
      {paymentData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Información de Pago</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Tarjeta:</span> **** **** **** {paymentData.cardNumber.slice(-4)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Titular:</span> {paymentData.customerData.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {paymentData.customerData.email}
            </p>
          </div>
        </motion.div>
      )}

      {/* Dirección de envío */}
      {paymentData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Dirección de Envío</h3>
          <div className="text-sm space-y-1">
            <p>{paymentData.shippingAddress.address}</p>
            <p>{paymentData.shippingAddress.city}, {paymentData.shippingAddress.zipCode}</p>
            <p>{paymentData.shippingAddress.country}</p>
          </div>
        </motion.div>
      )}

      {/* Total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-gray-50"
      >
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-primary-600">
            ${total.toLocaleString()}
          </span>
        </div>
      </motion.div>

      <div className="space-y-3">
        {!paymentData && (
          <button
            onClick={() => navigate('/payment')}
            className="w-full btn btn-primary py-3 text-lg font-semibold"
          >
            Agregar Información de Pago
          </button>
        )}
        
        {paymentData && (
          <button
            onClick={handleConfirmOrder}
            className="w-full btn btn-primary py-3 text-lg font-semibold"
          >
            Confirmar Pedido
          </button>
        )}
        
        <button
          onClick={() => navigate('/')}
          className="w-full btn btn-secondary py-3 text-lg font-semibold"
        >
          Continuar Comprando
        </button>
      </div>
    </div>
  )
}

export default OrderSummary