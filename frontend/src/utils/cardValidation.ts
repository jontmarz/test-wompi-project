import { CardValidation } from '../types'

export const validateCard = (cardNumber: string): CardValidation => {
  const cleaned = cardNumber.replace(/\s+/g, '')
  const errors: string[] = []
  
  // Detectar tipo de tarjeta
  let cardType: 'visa' | 'mastercard' | 'unknown' = 'unknown'
  
  if (cleaned.startsWith('4')) {
    cardType = 'visa'
  } else if (cleaned.startsWith('5') || cleaned.startsWith('2')) {
    cardType = 'mastercard'
  }
  
  // Validar longitud
  if (cleaned.length < 13 || cleaned.length > 19) {
    errors.push('Número de tarjeta inválido')
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