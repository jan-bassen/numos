import type { Result } from '@repo/shared/types/result'
import type { ApiErrorData } from './errors'

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

export type HttpResponse = {
  statusCode: number
  isBase64Encoded: boolean
  headers: {
    'Content-Type': string
    [key: string]: string
  }
  multiValueHeaders?: {
    [key: string]: string[]
  }
  body: string
}

export type Response<T> = Result<T, string>
