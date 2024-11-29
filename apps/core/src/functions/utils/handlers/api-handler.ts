import type { Callback, Context } from 'aws-lambda'
import type { z, ZodType } from 'zod'
import type { LambdaHandler } from '@/types/aws'
import type { HttpResponse } from '@/types/responses'
import { catchError } from '../function-error'

export type ApiRequest<T extends ZodType = ZodType> = {
  resourse: string
  path: string
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers: Record<string, string>
  multiValueHeaders: Record<string, string[]>
  queryStringParameters: Record<string, string>
  multiValueQueryStringParameters: Record<string, string[]>
  body: z.infer<T>
}

export type ApiHandler<T extends ZodType> = (
  data: ApiRequest<T>,
  context?: Context,
) => Promise<HttpResponse>

export function getHandlerFromApi<T extends ZodType>(
  handler: ApiHandler<T>,
  schema: T,
): LambdaHandler<any, HttpResponse> {
  return async (
    event: any,
    context?: Context,
    callback?: Callback<HttpResponse>,
  ) => {
    try {
      let data: ApiRequest<T> | undefined
      try {
        const body = schema.parse(JSON.parse(event.body))
        data = {
          resourse: event.resource,
          path: event.path,
          httpMethod: event.httpMethod,
          headers: event.headers,
          multiValueHeaders: event.multiValueHeaders,
          queryStringParameters: event.queryStringParameters,
          multiValueQueryStringParameters:
            event.multiValueQueryStringParameters,
          body: body,
        }
      } catch (error) {
        return catchError(error, 'Invalid request').toHttpResponse()
      }
      return await handler(data, context)
    } catch (error) {
      return catchError(error).toHttpResponse()
    }
  }
}
