import { CardValidation } from '../types'

export const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | 'unknown' => {
  const cleaned = cardNumber.replace(/\s+/g, '')
  
  if (cleaned.startsWith('4')) {
    return 'visa'
  } else if (cleaned.startsWith('5') || cleaned.startsWith('2')) {
    return 'mastercard'
  }
  
  return 'unknown'
}

export const validateCard = (cardNumber: string): CardValidation => {
  const cleaned = cardNumber.replace(/\s+/g, '')
  const errors: string[] = []
  
  // Validar que no esté vacío
  if (!cleaned) {
    errors.push('Número de tarjeta es requerido')
    return {
      isValid: false,
      cardType: 'unknown',
      errors,
    }
  }
  
  // Detectar tipo de tarjeta
  const cardType = detectCardType(cleaned)
  
  // Validar longitud
  if (cleaned.length < 13 || cleaned.length > 19) {
    errors.push('El número debe tener entre 13 y 19 dígitos')
  }
  
  // Validar solo números
  if (!/^\d+$/.test(cleaned)) {
    errors.push('Solo se permiten números')
  }
  
  // Algoritmo de Luhn
  if (!luhnCheck(cleaned)) {
    errors.push('Número de tarjeta inválido')
  }
  
  return {
    isValid: errors.length === 0,
    cardType,
    errors,
  }
}

export const validateExpiryDate = (expiryDate: string): boolean => {
  const match = expiryDate.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  
  const month = parseInt(match[1], 10)
  const year = parseInt(`20${match[2]}`, 10)
  
  if (month < 1 || month > 12) return false
  
  const now = new Date()
  const expiry = new Date(year, month - 1)
  
  return expiry > now
}

export const validateCVV = (cvv: string): boolean => {
  const cleaned = cvv.replace(/\s+/g, '')
  return /^\d{3,4}$/.test(cleaned)
}

function luhnCheck(cardNumber: string): boolean {
  let sum = 0
  let isEven = false
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i))
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s+/g, '')
  const match = cleaned.match(/\d{1,4}/g)
  return match ? match.join(' ') : ''
}

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
  }
  return cleaned
}