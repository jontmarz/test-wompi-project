import { ok, err } from './result'

describe('Result Simple Tests', () => {
  test('basic ok functionality', () => {
    const result = ok(42)
    expect(result.isOk()).toBe(true)
    expect(result.isError()).toBe(false)
    expect(result.getValue()).toBe(42)
  })

  test('basic err functionality', () => {
    const result = err('error message')
    expect(result.isOk()).toBe(false)
    expect(result.isError()).toBe(true)
    expect(result.getError()).toBe('error message')
  })

  test('map on success', () => {
    const result = ok(5).map((x: number) => x * 2)
    expect(result.getValue()).toBe(10)
  })

  test('map on error', () => {
    const result = err('failed').map((x: number) => x * 2)
    expect(result.isError()).toBe(true)
    expect(result.getError()).toBe('failed')
  })

  test('flatMap success', () => {
    const result = ok(5).flatMap((x: number) => ok(x.toString()))
    expect(result.getValue()).toBe('5')
  })

  test('flatMap error', () => {
    const result = err('failed').flatMap((x: number) => ok(x.toString()))
    expect(result.isError()).toBe(true)
  })

  test('mapError functionality', () => {
    const result = err('original').mapError((e: string) => `modified: ${e}`)
    expect(result.getError()).toBe('modified: original')
  })
})
