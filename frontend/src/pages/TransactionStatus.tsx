import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { checkTransactionStatus } from '../store/slices/paymentSlice'

const TransactionStatus: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { transaction, loading } = useAppSelector(state => state.payment)

  useEffect(() => {
    if (transaction?.id) {
      const interval = setInterval(() => {
        dispatch(checkTransactionStatus(transaction.id))
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [transaction?.id, dispatch])

  if (!transaction) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          No se encontró información de la transacción
        </h2>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'APPROVED':
        return <CheckCircle size={64} className="text-success-600" />
      case 'DECLINED':
        return <XCircle size={64} className="text-error-600" />
      case 'PENDING':
        return <Clock size={64} className="text-warning-600" />
      default:
        return <RefreshCw size={64} className="text-gray-600" />
    }
  }

  const getStatusMessage = () => {
    switch (transaction.status) {
      case 'APPROVED':
        return {
          title: '¡Pago Exitoso!',
          description: 'Tu pago ha sido procesado correctamente',
          color: 'text-success-600'
        }
      case 'DECLINED':
        return {
          title: 'Pago Rechazado',
          description: 'Tu pago no pudo ser procesado',
          color: 'text-error-600'
        }
      case 'PENDING':
        return {
          title: 'Procesando Pago',
          description: 'Tu pago está siendo procesado',
          color: 'text-warning-600'
        }
      default:
        return {
          title: 'Estado Desconocido',
          description: 'Verificando el estado de tu pago',
          color: 'text-gray-600'
        }
    }
  }

  const status = getStatusMessage()

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          {getStatusIcon()}
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 ${status.color}`}>
          {status.title}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {status.description}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4">Detalles de la Transacción</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">ID de Transacción:</span>
            <span className="font-medium">{transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Monto:</span>
            <span className="font-medium">${transaction.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estado:</span>
            <span className={`font-medium ${status.color}`}>
              {transaction.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium">
              {new Date(transaction.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>

      {transaction.status === 'PENDING' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-warning-50 border-warning-200"
        >
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-warning-600"></div>
            <p className="text-warning-700">
              Estamos procesando tu pago. Por favor espera...
            </p>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {transaction.status === 'APPROVED' && (
          <button
            onClick={() => navigate('/stock-return')}
            className="w-full btn btn-secondary py-3 text-lg font-semibold"
          >
            Gestionar Devolución
          </button>
        )}
        
        <button
          onClick={() => navigate('/')}
          className="w-full btn btn-primary py-3 text-lg font-semibold"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}

export default TransactionStatus