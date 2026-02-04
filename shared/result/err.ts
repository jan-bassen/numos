import type { GraphErrLocation } from '@repo/shared/result/err-types/graph-err'
import { ZodError } from 'zod'
import type { ZodIssue } from 'zod'
import type { HttpResponse } from '@repo/shared/types/http'
import type { NodeErrLocation } from '@repo/shared/result/err-types/node-err'

//TODO Clean up err data
export type BaseErrData = {
  internalMessage?: string
}

export type NodeErrData = BaseErrData & {
  location: NodeErrLocation
}

export type GraphErrData = BaseErrData & {
  location: GraphErrLocation
}

export type ValidationErrData = BaseErrData & {
  issues: ZodIssue[]
}

export type WalletSyncErrData = BaseErrData & {
  location: {
    wallet: string
    chain: string
  }
}

export type TransformCollectionErrData = BaseErrData & {
  chain: string
  issues: ZodIssue[]
}

export type TransformNFTErrData = BaseErrData & {
  chain: string
  issues: ZodIssue[]
}

export type ParseContentTypeErrData = BaseErrData & {
  contentType: string
}

export type FetchErrData = BaseErrData & {
  url: string
}

export type StringifyJsonErrData = BaseErrData & {
  json: string
}

export type ParseJsonErrData = BaseErrData & {
  json: string
}

export type DBInsertErrData = BaseErrData & {
  data: string
}

export type ErrData = {
  node: NodeErrData
  graph: GraphErrData
  validation: ValidationErrData
  walletSync: WalletSyncErrData
  transformCollection: TransformCollectionErrData
  transformNFT: TransformNFTErrData
  parseContentType: ParseContentTypeErrData
} & {
  [key: string]: BaseErrData
}

export type ErrType = keyof ErrData

export type SerializedErr<E extends ErrType = ErrType> = {
  type: E
  message: string
  data?: ErrData[E]
}

export type SerializedErrResponse<E extends ErrType = ErrType> = {
  result: null
  error: {
    type: E
    message: string
    data?: ErrData[E]
  }
}

// -------------------------------------------------------------------------------------------------

export class Err<E extends ErrType = ErrType> extends Error {
  readonly ok = false
  constructor(
    message: string,
    public type?: E,
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
      type: this.type || ('unknown' as E),
      message: this.message,
      data: this.data,
    }
  }

  toSerializedResponse(): SerializedErrResponse<E> {
    return {
      result: null,
      error: {
        type: this.type || ('unknown' as E),
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
