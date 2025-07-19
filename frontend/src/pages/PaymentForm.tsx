import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { CreditCardIcon, UserIcon, TruckIcon } from '@heroicons/react/24/outline'
import { useAppDispatch } from '../hooks/redux'
import { setPaymentData } from '../store/slices/paymentSlice'
import { validateCard, formatCardNumber, formatExpiryDate } from '../utils/cardValidation'

const schema = yup.object({
  cardNumber: yup.string().required('Número de tarjeta requerido'),
  expiryDate: yup.string().required('Fecha de expiración requerida'),
  cvv: yup.string().required('CVV requerido').min(3, 'CVV debe tener 3 o 4 dígitos'),
  name: yup.string().required('Nombre requerido'),
  email: yup.string().email('Email inválido').required('Email requerido'),
  phone: yup.string().required('Teléfono requerido'),
  address: yup.string().required('Dirección requerida'),
  city: yup.string().required('Ciudad requerida'),
  zipCode: yup.string().required('Código postal requerido'),
  country: yup.string().required('País requerido'),
})

type FormData = yup.InferType<typeof schema>

const PaymentForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [cardValidation, setCardValidation] = useState({ isValid: true, cardType: 'unknown' as const })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const cardNumber = watch('cardNumber')
  const expiryDate = watch('expiryDate')

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setValue('cardNumber', formatted)
    
    const validation = validateCard(formatted)
    setCardValidation(validation)
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setValue('expiryDate', formatted)
  }

  const onSubmit = (data: FormData) => {
    const paymentData = {
      cardNumber: data.cardNumber,
      expiryDate: data.expiryDate,
      cvv: data.cvv,
      cardType: cardValidation.cardType,
      customerData: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      shippingAddress: {
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        country: data.country,
      },
    }

    dispatch(setPaymentData(paymentData))
    navigate('/summary')
  }

  const getCardLogo = () => {
    switch (cardValidation.cardType) {
      case 'visa':
      return (
        <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
        alt="Visa"
        className="h-5"
        />
      )
      case 'mastercard':
      return (
        <img
        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
        alt="Mastercard"
        className="h-5"
        />
      )
      default:
      return '💳'
    }
  }

  return (
    <div className="w-full max-w-full md:max-w-2xl md:w-1/2 mx-auto p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Datos de Pago</h2>
        <p className="text-gray-600">Ingresa tu información de pago y envío</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Datos de Tarjeta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <CreditCardIcon className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">Datos de Tarjeta</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Tarjeta
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('cardNumber')}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  className={`input ${errors.cardNumber ? 'border-error-500' : ''}`}
                />
                <div className="absolute right-3 top-2.5 text-sm">
                  {getCardLogo()}
                </div>
              </div>
              {errors.cardNumber && (
                <p className="text-sm text-error-600 mt-1">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Expiración
                </label>
                <input
                  type="text"
                  {...register('expiryDate')}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                  placeholder="MM/AA"
                  className={`input ${errors.expiryDate ? 'border-error-500' : ''}`}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-error-600 mt-1">{errors.expiryDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  {...register('cvv')}
                  maxLength={4}
                  placeholder="123"
                  className={`input ${errors.cvv ? 'border-error-500' : ''}`}
                />
                {errors.cvv && (
                  <p className="text-sm text-error-600 mt-1">{errors.cvv.message}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Datos del Cliente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <UserIcon className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">Datos del Cliente</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="Juan Pérez"
                className={`input ${errors.name ? 'border-error-500' : ''}`}
              />
              {errors.name && (
                <p className="text-sm text-error-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="juan@email.com"
                className={`input ${errors.email ? 'border-error-500' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-error-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="+57 300 123 4567"
                className={`input ${errors.phone ? 'border-error-500' : ''}`}
              />
              {errors.phone && (
                <p className="text-sm text-error-600 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dirección de Envío */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <TruckIcon className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">Dirección de Envío</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                {...register('address')}
                placeholder="Calle 123 #45-67"
                className={`input ${errors.address ? 'border-error-500' : ''}`}
              />
              {errors.address && (
                <p className="text-sm text-error-600 mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  {...register('city')}
                  placeholder="Bogotá"
                  className={`input ${errors.city ? 'border-error-500' : ''}`}
                />
                {errors.city && (
                  <p className="text-sm text-error-600 mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  {...register('zipCode')}
                  placeholder="110001"
                  className={`input ${errors.zipCode ? 'border-error-500' : ''}`}
                />
                {errors.zipCode && (
                  <p className="text-sm text-error-600 mt-1">{errors.zipCode.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <select
                {...register('country')}
                className={`input ${errors.country ? 'border-error-500' : ''}`}
              >
                <option value="">Seleccionar país</option>
                <option value="CO">Colombia</option>
                <option value="US">Estados Unidos</option>
                <option value="MX">México</option>
              </select>
              {errors.country && (
                <p className="text-sm text-error-600 mt-1">{errors.country.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        <button
          type="submit"
          className="w-full btn btn-primary py-3 text-lg font-semibold"
        >
          Continuar al Resumen
        </button>
      </form>
    </div>
  )
}

export default PaymentForm