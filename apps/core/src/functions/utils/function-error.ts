import type { ApiErrorCode, ApiErrorData } from '@/types/errors'
import type { HttpResponse, Response } from '@/types/responses'
import type { Result } from '@repo/shared/types/result'
import { ZodError } from 'zod'

/* 

AWS SCHEMA:

{
    "isBase64Encoded": true|false,
    "statusCode": httpStatusCode,
    "headers": { "headerName": "headerValue", ... },
    "multiValueHeaders": { "headerName": ["headerValue", "headerValue2", ...], ... },
    "body": "..."
} 
    
*/

export class FunctionError extends Error {
  constructor(
    message: string,
    public statusCode: ApiErrorCode,
  ) {
    super(message)
    this.name = 'ApiError'
  }
  serialize(): string {
    return this.message
  }
  toHttpResponse(): HttpResponse {
    return {
      statusCode: this.statusCode,
      isBase64Encoded: false,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: this.message,
    }
  }
  toResponse(): Response<any> {
    return { result: undefined, error: this.serialize() }
  }
}

export function catchError(error: unknown, message?: string): FunctionError {
  if (error instanceof FunctionError) {
    return error
  }
  if (error instanceof ZodError) {
    return new FunctionError(error.issues[0]?.message || 'Invalid request', 400)
  }
  if (error instanceof Error) {
    return new FunctionError(error.message, 500)
  }
  console.error(error)
  return new FunctionError(message || 'Unknown error', 500)
}
