import { ok, err, tryCatch, asyncTryCatch } from './entities/result'

describe('Result Comprehensive Coverage', () => {
  describe('Ok functionality', () => {
    test('should create and handle ok results', () => {
      const result = ok(42)
      expect(result.isOk()).toBe(true)
      expect(result.isError()).toBe(false)
      expect(result.getValue()).toBe(42)
    })

    test('should handle map operations', () => {
      const result = ok(5)
      const mapped = result.map((x: number) => x * 2)
      expect(mapped.getValue()).toBe(10)
    })

    test('should handle mapError operations', () => {
      const result = ok(5)
      const mapped = result.mapError((e: string) => `Error: ${e}`)
      expect(mapped.getValue()).toBe(5)
    })

    test('should handle flatMap operations', () => {
      const result = ok(5)
      const chained = result.flatMap((x: number) => ok(x.toString()))
      expect(chained.getValue()).toBe('5')
    })

    test('should handle flatMap with error', () => {
      const result = ok(5)
      const chained = result.flatMap((x: number) => err('failed'))
      expect(chained.isError()).toBe(true)
      expect(chained.getError()).toBe('failed')
    })

    test('should handle fold operations', () => {
      const result = ok(10)
      const folded = result.fold(
        value => `Success: ${value}`,
        error => `Error: ${error}`
      )
      expect(folded).toBe('Success: 10')
    })

    test('should handle tap operations', () => {
      let sideEffect = ''
      const result = ok('test')
      const tapped = result.tap(value => {
        sideEffect = `Tapped: ${value}`
      })
      expect(sideEffect).toBe('Tapped: test')
      expect(tapped.getValue()).toBe('test')
    })

    test('should handle tapError operations', () => {
      let sideEffect = ''
      const result = ok('test')
      const tapped = result.tapError(error => {
        sideEffect = `Error: ${error}`
      })
      expect(sideEffect).toBe('')
      expect(tapped.getValue()).toBe('test')
    })

    test('should handle tap with exception', () => {
      const result = ok('test')
      const tapped = result.tap(() => {
        throw new Error('Tap error')
      })
      expect(tapped.getValue()).toBe('test')
    })

    test('should throw when getting error from success', () => {
      const result = ok('test')
      expect(() => result.getError()).toThrow('Cannot get error from success result')
    })
  })

  describe('Err functionality', () => {
    test('should create and handle err results', () => {
      const result = err('error message')
      expect(result.isOk()).toBe(false)
      expect(result.isError()).toBe(true)
      expect(result.getError()).toBe('error message')
    })

    test('should handle map operations', () => {
      const result = err('failed')
      const mapped = result.map((x: number) => x * 2)
      expect(mapped.isError()).toBe(true)
      expect(mapped.getError()).toBe('failed')
    })

    test('should handle mapError operations', () => {
      const result = err('original')
      const mapped = result.mapError((e: string) => `Modified: ${e}`)
      expect(mapped.getError()).toBe('Modified: original')
    })

    test('should handle flatMap operations', () => {
      const result = err('failed')
      const chained = result.flatMap((x: number) => ok(x.toString()))
      expect(chained.isError()).toBe(true)
      expect(chained.getError()).toBe('failed')
    })

    test('should handle fold operations', () => {
      const result = err('failed')
      const folded = result.fold(
        value => `Success: ${value}`,
        error => `Error: ${error}`
      )
      expect(folded).toBe('Error: failed')
    })

    test('should handle tap operations', () => {
      let sideEffect = ''
      const result = err('failed')
      const tapped = result.tap(value => {
        sideEffect = `Tapped: ${value}`
      })
      expect(sideEffect).toBe('')
      expect(tapped.getError()).toBe('failed')
    })

    test('should handle tapError operations', () => {
      let sideEffect = ''
      const result = err('failed')
      const tapped = result.tapError(error => {
        sideEffect = `Error: ${error}`
      })
      expect(sideEffect).toBe('Error: failed')
      expect(tapped.getError()).toBe('failed')
    })

    test('should handle tapError with exception', () => {
      const result = err('failed')
      const tapped = result.tapError(() => {
        throw new Error('Tap error')
      })
      expect(tapped.getError()).toBe('failed')
    })

    test('should throw when getting value from error', () => {
      const result = err('failed')
      expect(() => result.getValue()).toThrow('Cannot get value from error result')
    })
  })

  describe('tryCatch functionality', () => {
    test('should handle successful operations', () => {
      const result = tryCatch(() => 42)
      expect(result.isOk()).toBe(true)
      expect(result.getValue()).toBe(42)
    })

    test('should handle exceptions', () => {
      const result = tryCatch(() => {
        throw new Error('Something went wrong')
      })
      expect(result.isError()).toBe(true)
      expect(result.getError()).toBeInstanceOf(Error)
    })

    test('should handle exceptions with error mapper', () => {
      const result = tryCatch(
        () => {
          throw new Error('Something went wrong')
        },
        (error) => `Mapped: ${(error as Error).message}`
      )
      expect(result.isError()).toBe(true)
      expect(result.getError()).toBe('Mapped: Something went wrong')
    })
  })

  describe('asyncTryCatch functionality', () => {
    test('should handle successful async operations', async () => {
      const result = await asyncTryCatch(() => Promise.resolve(42))
      expect(result.isOk()).toBe(true)
      expect(result.getValue()).toBe(42)
    })

    test('should handle async exceptions', async () => {
      const result = await asyncTryCatch(() => Promise.reject(new Error('Async error')))
      expect(result.isError()).toBe(true)
      expect(result.getError()).toBeInstanceOf(Error)
    })

    test('should handle async exceptions with error mapper', async () => {
      const result = await asyncTryCatch(
        () => Promise.reject(new Error('Async error')),
        (error) => `Mapped: ${(error as Error).message}`
      )
      expect(result.isError()).toBe(true)
      expect(result.getError()).toBe('Mapped: Async error')
    })
  })
})
