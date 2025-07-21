import { Result, ok, err, tryCatch } from '../result';

describe('Result (Railway Oriented Programming)', () => {
  describe('ok function', () => {
    test('should create successful result', () => {
      const result = ok('success value');
      
      expect(result.isError()).toBe(false);
      expect(result.getValue()).toBe('success value');
    });

    test('should work with complex objects', () => {
      const data = { id: 1, name: 'Test' };
      const result = ok(data);
      
      expect(result.isError()).toBe(false);
      expect(result.getValue()).toEqual(data);
    });
  });

  describe('err function', () => {
    test('should create error result', () => {
      const result = err('error message');
      
      expect(result.isError()).toBe(true);
      expect(result.getError()).toBe('error message');
    });

    test('should handle error objects', () => {
      const error = new Error('Test error');
      const result = err(error.message);
      
      expect(result.isError()).toBe(true);
      expect(result.getError()).toBe('Test error');
    });
  });

  describe('Result class', () => {
    test('should throw when getting value from error result', () => {
      const result = err('error');
      
      expect(() => result.getValue()).toThrow('Cannot get value from error result');
    });

    test('should throw when getting error from success result', () => {
      const result = ok('success');
      
      expect(() => result.getError()).toThrow('Cannot get error from success result');
    });

    test('should support chaining with map', () => {
      const result = ok(5);
      const mapped = result.map(x => x * 2);
      
      expect(mapped.isError()).toBe(false);
      expect(mapped.getValue()).toBe(10);
    });

    test('should not execute map on error result', () => {
      const result = err('error');
      const mapped = result.map(x => x * 2);
      
      expect(mapped.isError()).toBe(true);
      expect(mapped.getError()).toBe('error');
    });

    test('should support flatMap for chaining operations', () => {
      const result = ok(5);
      const chained = result.flatMap(x => ok(x.toString()));
      
      expect(chained.isError()).toBe(false);
      expect(chained.getValue()).toBe('5');
    });

    test('should propagate error in flatMap chain', () => {
      const result = ok(5);
      const chained = result.flatMap(x => err('operation failed'));
      
      expect(chained.isError()).toBe(true);
      expect(chained.getError()).toBe('operation failed');
    });
  });

  describe('tryCatch function', () => {
    test('should catch exceptions and convert to error result', () => {
      const result = tryCatch(() => {
        throw new Error('Something went wrong');
      });
      
      expect(result.isError()).toBe(true);
      expect(result.getError()).toBe('Something went wrong');
    });

    test('should return success result for successful operations', () => {
      const result = tryCatch(() => 42);
      
      expect(result.isError()).toBe(false);
      expect(result.getValue()).toBe(42);
    });
  });
});
