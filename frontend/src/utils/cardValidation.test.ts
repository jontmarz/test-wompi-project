import { validateCard } from './cardValidation'

describe('Card Validation', () => {
  test('should validate Visa card', () => {
    const result = validateCard('4242424242424242')
    expect(result.isValid).toBe(true)
    expect(result.cardType).toBe('visa')
  })

  test('should validate MasterCard', () => {
    const result = validateCard('5555555555554444')
    expect(result.isValid).toBe(true)
    expect(result.cardType).toBe('mastercard')
  })

  test('should reject invalid card', () => {
    const result = validateCard('1234567890123456')
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  test('should reject empty card', () => {
    const result = validateCard('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Número de tarjeta es requerido')
  })
})
