import { Result, ok, err, tryCatch } from './result'

describe('Result (Railway Oriented Programming)', () => {
  test('ok should create successful result', () => {
    const result = ok('success value')
    
    expect(result.isError()).toBe(false)
    expect(result.getValue()).toBe('success value')
  })

  test('err should create error result', () => {
    const result = err('error message')
    
    expect(result.isError()).toBe(true)
    expect(result.getError()).toBe('error message')
  })

  test('should throw when getting value from error result', () => {
    const result = err('error')
    
    expect(() => result.getValue()).toThrow('Cannot get value from error result')
  })

  test('should throw when getting error from success result', () => {
    const result = ok('success')
    
    expect(() => result.getError()).toThrow('Cannot get error from success result')
  })

  test('should support chaining with map', () => {
    const result = ok(5)
    const mapped = result.map((x: number) => x * 2)
    
    expect(mapped.isError()).toBe(false)
    expect(mapped.getValue()).toBe(10)
  })

  test('should not execute map on error result', () => {
    const result = err('error')
    const mapped = result.map((x: number) => x * 2)
    
    expect(mapped.isError()).toBe(true)
    expect(mapped.getError()).toBe('error')
  })

  test('should support flatMap for chaining operations', () => {
    const result = ok(5)
    const chained = result.flatMap(x => ok(x.toString()))
    
    expect(chained.isError()).toBe(false)
    expect(chained.getValue()).toBe('5')
  })

  test('should propagate error in flatMap chain', () => {
    const result = ok(5)
    const chained = result.flatMap(x => err('operation failed'))
    
    expect(chained.isError()).toBe(true)
    expect(chained.getError()).toBe('operation failed')
  })

  test('tryCatch should catch exceptions and convert to error result', () => {
    const result = tryCatch(() => {
      throw new Error('Something went wrong')
    })
    
    expect(result.isError()).toBe(true)
    expect(result.getError()).toBeInstanceOf(Error)
    expect((result.getError() as Error).message).toBe('Something went wrong')
  })

  test('tryCatch should return success result for successful operations', () => {
    const result = tryCatch(() => 42)
    
    expect(result.isError()).toBe(false)
    expect(result.getValue()).toBe(42)
  })

  test('should support fold method', () => {
    const successResult = ok(10)
    const errorResult = err('failed')

    const successFolded = successResult.fold(
      value => `Success: ${value}`,
      error => `Error: ${error}`
    )

    const errorFolded = errorResult.fold(
      value => `Success: ${value}`,
      error => `Error: ${error}`
    )

    expect(successFolded).toBe('Success: 10')
    expect(errorFolded).toBe('Error: failed')
  })

  test('should support tap method', () => {
    let sideEffect = ''
    const result = ok('test')
    
    const tapped = result.tap(value => {
      sideEffect = `Tapped: ${value}`
    })
    
    expect(sideEffect).toBe('Tapped: test')
    expect(tapped.getValue()).toBe('test')
  })

  test('should support tapError method', () => {
    let sideEffect = ''
    const result = err('failed')
    
    const tapped = result.tapError(error => {
      sideEffect = `Error tapped: ${error}`
    })
    
    expect(sideEffect).toBe('Error tapped: failed')
    expect(tapped.getError()).toBe('failed')
  })
})
