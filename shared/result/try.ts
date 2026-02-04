import {
  Err,
  type ErrType,
  type SerializedErrResponse,
} from '@repo/shared/result/err'
import { Ok, type SerializedSuccessResponse } from '@repo/shared/result/ok'

export type SerializedResponse<R, E extends ErrType = ErrType> =
  | SerializedSuccessResponse<R>
  | SerializedErrResponse<E>

export type Result<T, E extends ErrType = ErrType> = Ok<T> | Err<E>

export function isOk<T, E extends ErrType = ErrType>(
  result: Result<T, E>,
): result is Ok<T> {
  return result instanceof Ok
}

export function isErr<T, E extends ErrType = ErrType>(
  result: Result<T, E>,
): result is Err<E> {
  return result instanceof Err
}

export function tryCatch<T, E extends ErrType = ErrType>(
  fn: () => Result<T, E>,
  onError?: (error: Err<E>) => void,
) {
  try {
    const result = fn()
    if (result instanceof Ok) {
      return result
    }
    if (result instanceof Err) {
      return result
    }
    return new Err('Invalid result', 'unknown', {
      internalMessage: 'tryCatch returned a non-Ok result',
    })
  } catch (error) {
    const err = Err.fromCatch(error)
    onError?.(err)
    return err
  }
}

export async function tryCatchAsync<T, E extends ErrType = ErrType>(
  fn: () => Promise<Result<T, E>>,
  onError?: (error: Err<E>) => void,
) {
  try {
    const result = await fn()
    if (result instanceof Ok) {
      return result
    }
    onError?.(result)
    return result
  } catch (error) {
    const err = Err.fromCatch(error)
    onError?.(err)
    return err
  }
}
