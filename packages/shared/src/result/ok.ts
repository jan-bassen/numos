import type { HttpResponse } from '@repo/shared/types/http'
import { Err } from '@repo/shared/result/err'

export const contentType = {
  json: 'application/json',
  text: 'text/plain',
}

export type ContentType = keyof typeof contentType

export type SerializedSuccessResponse<R> = {
  result: R
  error: null
}

export class Ok<T> {
  value: T
  readonly ok = true
  constructor(
    value: T,
    public contentType?: ContentType,
  ) {
    this.value = value
  }
  toHttpResponse(): HttpResponse {
    let body: string | undefined = undefined
    switch (this.contentType) {
      case 'json':
        try {
          const json = JSON.stringify(this.value)
          body = json
        } catch (error) {
          return new Err('Failed to serialize value', 'stringifyJson', {
            internalMessage: String(error),
          }).toHttpResponse()
        }
        break
      case 'text':
        body = String(this.value)
        break
    }
    return {
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        'Content-Type': contentType[this.contentType || 'json'],
      },
      body: body || '',
    }
  }
  toSerializedResponse(): SerializedSuccessResponse<T> {
    return { result: this.value, error: null }
  }
}
