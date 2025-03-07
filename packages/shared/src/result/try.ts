import {
  Err,
  type ErrType,
  type SerializedErrorResponse,
} from '@repo/shared/result/err'
import { Ok, type SerializedSuccessResponse } from '@repo/shared/result/ok'

export type SerializedResponse<R, E extends ErrType = ErrType> =
  | SerializedSuccessResponse<R>
  | SerializedErrorResponse<E>

export type Result<T, E extends ErrType = ErrType> = Ok<T> | Err<E>

export function tryCatch<T, E extends ErrType = ErrType>(
  fn: () => Result<T, E>,
) {
  try {
    const result = fn()
    if (result instanceof Ok) {
      return result
    }
    return new Err('Invalid result', 'unknown', {
      internalMessage: 'tryCatch returned a non-Ok result',
    })
  } catch (error) {
    return Err.fromCatch(error)
  }
}

export async function tryCatchAsync<T, E extends ErrType = ErrType>(
  fn: () => Promise<Result<T, E>>,
) {
  try {
    const result = await fn()
    if (result instanceof Ok) {
      return result
    }
    return new Err('Invalid result', 'unknown', {
      internalMessage: 'tryCatchAsync returned a non-Ok result',
    })
  } catch (error) {
    return Err.fromCatch(error)
  }
}
