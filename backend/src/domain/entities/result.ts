// Railway Oriented Programming Result type
export abstract class Result<T, E> {
  abstract isOk(): boolean;
  abstract isError(): boolean;
  abstract getValue(): T | undefined;
  abstract getError(): E | undefined;
  abstract map<U>(fn: (value: T) => U): Result<U, E>;
  abstract mapError<F>(fn: (error: E) => F): Result<T, F>;
  abstract flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
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

  getError(): E | undefined {
    return undefined;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Ok(fn(this.value));
  }

  mapError<F>(fn: (error: E) => F): Result<T, F> {
    return new Ok(this.value);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
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

  getValue(): T | undefined {
    return undefined;
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
}

export const ok = <T, E>(value: T): Result<T, E> => new Ok(value);
export const err = <T, E>(error: E): Result<T, E> => new Err(error);