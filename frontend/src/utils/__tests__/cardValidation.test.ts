import { validateCard, detectCardType, validateExpiryDate, validateCVV } from '../cardValidation'

describe('cardValidation', () => {
  describe('detectCardType', () => {
    test('should detect Visa cards', () => {
      expect(detectCardType('4111111111111111')).toBe('visa')
      expect(detectCardType('4242424242424242')).toBe('visa')
    })

    test('should detect MasterCard cards', () => {
      expect(detectCardType('5555555555554444')).toBe('mastercard')
      expect(detectCardType('5200828282828210')).toBe('mastercard')
    })

    test('should return unknown for invalid cards', () => {
      expect(detectCardType('1234567890123456')).toBe('unknown')
      expect(detectCardType('9999999999999999')).toBe('unknown')
    })
  })

  describe('validateCard', () => {
    test('should validate correct Visa card', () => {
      const result = validateCard('4242424242424242')
      expect(result.isValid).toBe(true)
      expect(result.cardType).toBe('visa')
      expect(result.errors).toHaveLength(0)
    })

    test('should validate correct MasterCard', () => {
      const result = validateCard('5555555555554444')
      expect(result.isValid).toBe(true)
      expect(result.cardType).toBe('mastercard')
      expect(result.errors).toHaveLength(0)
    })

    test('should reject invalid card number', () => {
      const result = validateCard('1234567890123456')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Número de tarjeta inválido')
    })

    test('should reject short card number', () => {
      const result = validateCard('424242424242')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El número debe tener entre 13 y 19 dígitos')
    })

    test('should reject empty card number', () => {
      const result = validateCard('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Número de tarjeta es requerido')
    })
  })

  describe('validateExpiryDate', () => {
    test('should validate future date', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 2)
      const month = String(futureDate.getMonth() + 1).padStart(2, '0')
      const year = String(futureDate.getFullYear()).slice(-2)
      
      expect(validateExpiryDate(`${month}/${year}`)).toBe(true)
    })

    test('should reject past date', () => {
      expect(validateExpiryDate('01/20')).toBe(false)
    })

    test('should reject invalid format', () => {
      expect(validateExpiryDate('1/25')).toBe(false)
      expect(validateExpiryDate('13/25')).toBe(false)
      expect(validateExpiryDate('00/25')).toBe(false)
    })
  })

  describe('validateCVV', () => {
    test('should validate 3-digit CVV', () => {
      expect(validateCVV('123')).toBe(true)
      expect(validateCVV('999')).toBe(true)
    })

    test('should validate 4-digit CVV', () => {
      expect(validateCVV('1234')).toBe(true)
      expect(validateCVV('9999')).toBe(true)
    })

    test('should reject invalid CVV', () => {
      expect(validateCVV('12')).toBe(false)
      expect(validateCVV('12345')).toBe(false)
      expect(validateCVV('abc')).toBe(false)
      expect(validateCVV('')).toBe(false)
    })
  })
})
