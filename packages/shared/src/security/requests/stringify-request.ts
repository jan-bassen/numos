import type { RequestParams } from '@repo/shared/types/encryption'
import { createHash } from 'node:crypto'

export function stringifyRequest(request: RequestParams) {
  const contentHash = createHash('md5')
    .update(JSON.stringify(request.content))
    .digest('hex')
  return `${request.method}\n${contentHash}\n${request.contentType}\n${request.uri}\n${request.nonce}\n${request.timestamp}`
}
