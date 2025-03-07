import type { GraphErrLocation } from '@repo/shared/result/err-types/graph-err'
import { ZodError } from 'zod'
import type { ZodIssue } from 'zod'
import type { HttpResponse } from '@repo/shared/types/http'
import type { NodeErrLocation } from '@repo/shared/result/err-types/node-err'

export type ErrData = {
  node: {
    location: NodeErrLocation
  }
  graph: {
    location: GraphErrLocation
  }
  validation: {
    issues: ZodIssue[]
  }
  unknown: {
    internalMessage: string
  }
  fetch: undefined
  stringifyJson: {
    internalMessage: string
  }
  parseJson: {
    internalMessage: string
  }
  dbInsert: {
    internalMessage: string
  }
  dbSelect: {
    internalMessage: string
  }
  dbUpdate: {
    internalMessage: string
  }
  dbDelete: {
    internalMessage: string
  }
  valueSerialize: {
    internalMessage: string
  }
  valueDeserialize: {
    internalMessage: string
  }
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  valueCreate: {}
}

export type ErrType = keyof ErrData

export type SerializedErr<E extends ErrType = ErrType> = {
  type: E
  data?: ErrData[E]
}

export type SerializedErrorResponse<E extends ErrType> = {
  result: null
  error: {
    type: E
    message: string
    data?: ErrData[E]
  }
}

// -------------------------------------------------------------------------------------------------

export class Err<E extends ErrType> extends Error {
  readonly ok = false
  constructor(
    message: string,
    public type: E,
    public data?: ErrData[E],
    public statusCode?: number,
  ) {
    super(message)
  }

  static fromCatch(error: unknown, message?: string) {
    if (error instanceof Err) {
      return error
    }
    if (error instanceof ZodError) {
      return new Err(
        error.issues[0]?.message || 'Schema validation failed',
        'validation',
        {
          issues: error.issues,
        },
      )
    }
    if (error instanceof Error) {
      return new Err(message || error.message, 'unknown', {
        internalMessage: error.message,
      })
    }
    return new Err(message || String(error) || 'Unknown error', 'unknown', {
      internalMessage: String(error),
    })
  }

  static fromError(error: Error) {
    return new Err(error.message, 'unknown', {
      internalMessage: error.message,
    })
  }

  static fromZodIssues(issues: ZodIssue[]) {
    return new Err('Validation failed', 'validation', {
      issues,
    })
  }

  static fromZodError(error: ZodError) {
    return new Err(error.message, 'validation', {
      issues: error.issues,
    })
  }

  convert<N extends ErrType>(type: N, data?: ErrData[N]): Err<N> {
    const stack = this.stack
    const err = new Err<N>(this.message, type, data, this.statusCode)
    err.stack = stack
    return err
  }

  serialize(): SerializedErr<E> {
    return {
      type: this.type,
      data: this.data,
    }
  }

  toSerializedResponse(): SerializedErrorResponse<E> {
    return {
      result: null,
      error: {
        type: this.type,
        message: this.message,
        data: this.data,
      },
    }
  }

  toHttpResponse(): HttpResponse {
    return {
      statusCode: this.statusCode || 500,
      isBase64Encoded: false,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: this.message,
    }
  }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode
  }
}
