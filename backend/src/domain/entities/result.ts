// Railway Oriented Programming Result type
export abstract class Result<T, E> {
  abstract isOk(): boolean;
  abstract isError(): boolean;
  abstract getValue(): T;
  abstract getError(): E;
  abstract map<U>(fn: (value: T) => U): Result<U, E>;
  abstract mapError<F>(fn: (error: E) => F): Result<T, F>;
  abstract flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
  abstract fold<U>(onOk: (value: T) => U, onError: (error: E) => U): U;
  abstract tap(fn: (value: T) => void): Result<T, E>;
  abstract tapError(fn: (error: E) => void): Result<T, E>;
  
  // Helper methods for better ROP
  static sequence<T, E>(results: Result<T, E>[]): Result<T[], E> {
    const values: T[] = [];
    for (const result of results) {
      if (result.isError()) {
        return result as Result<T[], E>;
      }
      values.push(result.getValue());
    }
    return ok(values);
  }

  static traverse<T, U, E>(
    items: T[],
    fn: (item: T) => Result<U, E>
  ): Result<U[], E> {
    return Result.sequence(items.map(fn));
  }
}

export class Ok<T, E> extends Result<T, E> {
  constructor(private value: T) {
    super();
  }

  isOk(): boolean {
    return true;
  }

  isError(): boolean {
    return false;
  }

  getValue(): T {
    return this.value;
  }

  getError(): E {
    throw new Error('Cannot get error from success result');
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    try {
      return new Ok(fn(this.value));
    } catch (error) {
      return new Err(error as E);
    }
  }

  mapError<F>(fn: (error: E) => F): Result<T, F> {
    return new Ok(this.value);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    try {
      return fn(this.value);
    } catch (error) {
      return new Err(error as E);
    }
  }

  fold<U>(onOk: (value: T) => U, onError: (error: E) => U): U {
    return onOk(this.value);
  }

  tap(fn: (value: T) => void): Result<T, E> {
    try {
      fn(this.value);
    } catch {
      // Ignore errors in tap
    }
    return this;
  }

  tapError(fn: (error: E) => void): Result<T, E> {
    return this;
  }
}

export class Err<T, E> extends Result<T, E> {
  constructor(private error: E) {
    super();
  }

  isOk(): boolean {
    return false;
  }

  isError(): boolean {
    return true;
  }

  getValue(): T {
    throw new Error('Cannot get value from error result');
  }

  getError(): E {
    return this.error;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Err(this.error);
  }

  mapError<F>(fn: (error: E) => F): Result<T, F> {
    return new Err(fn(this.error));
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return new Err(this.error);
  }

  fold<U>(onOk: (value: T) => U, onError: (error: E) => U): U {
    return onError(this.error);
  }

  tap(fn: (value: T) => void): Result<T, E> {
    return this;
  }

  tapError(fn: (error: E) => void): Result<T, E> {
    try {
      fn(this.error);
    } catch {
      // Ignore errors in tap
    }
    return this;
  }
}

export const ok = <T, E>(value: T): Result<T, E> => new Ok(value);
export const err = <T, E>(error: E): Result<T, E> => new Err(error);

// Helper functions for better Railway Oriented Programming
export const tryCatch = <T, E>(
  fn: () => T,
  errorMapper?: (error: unknown) => E
): Result<T, E> => {
  try {
    return ok(fn());
  } catch (error) {
    const mappedError = errorMapper ? errorMapper(error) : (error as E);
    return err(mappedError);
  }
};

export const asyncTryCatch = async <T, E>(
  fn: () => Promise<T>,
  errorMapper?: (error: unknown) => E
): Promise<Result<T, E>> => {
  try {
    const result = await fn();
    return ok(result);
  } catch (error) {
    const mappedError = errorMapper ? errorMapper(error) : (error as E);
    return err(mappedError);
  }
};