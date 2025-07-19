import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CubeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const StockReturn: React.FC = () => {
  const navigate = useNavigate()

  const handleReturnRequest = () => {
    // Aquí iría la lógica para solicitar devolución
    console.log('Solicitud de devolución enviada')
    navigate('/')
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Devoluciones</h2>
        <p className="text-gray-600">Puedes solicitar la devolución de tu compra</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <div className="flex justify-center mb-4">
          <CubeIcon className="w-16 h-16 text-primary-600" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          Política de Devoluciones
        </h3>
        
        <p className="text-gray-600 mb-6">
          Tienes 30 días desde la fecha de compra para solicitar una devolución.
          El producto debe estar en perfectas condiciones.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleReturnRequest}
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Solicitar Devolución</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full btn btn-secondary"
          >
            Volver al Inicio
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default StockReturn