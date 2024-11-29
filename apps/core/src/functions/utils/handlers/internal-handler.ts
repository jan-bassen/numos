import type { Callback, Context } from 'aws-lambda'
import type { z, ZodType } from 'zod'
import type { LambdaHandler } from '@/types/aws'
import { catchError } from '../function-error'
import type { Response } from '@/types/responses'

export type InternalHandler<T extends ZodType, R> = (
  data: z.infer<T>,
  context?: Context,
) => Promise<Response<R>>

export function getHandlerFromInternal<T extends ZodType, R>(
  handler: InternalHandler<T, R>,
  schema: T,
): LambdaHandler<z.infer<T>, Response<R>> {
  return async (
    event: z.infer<T>,
    context?: Context,
    callback?: Callback<Response<z.infer<T>>>,
  ): Promise<Response<R>> => {
    try {
      let data: z.infer<T>
      try {
        data = schema.parse(event)
      } catch (error) {
        return catchError(error, 'Invalid request').toResponse()
      }
      return await handler(data, context)
    } catch (error) {
      return catchError(error).toResponse()
    }
  }
}
