//TODO: Move to sdk when ready

import type { RequestParams } from '@repo/shared/types/encryption'
import { deriveKeys } from '../derive-keys'
import { sign } from '../sign'
import { stringifyRequest } from './stringify-request'

export async function signRequest(
  request: RequestParams,
  clientSecret: string,
) {
  const { aesKey, hmacKey } = await deriveKeys(clientSecret)
  const requestString = stringifyRequest(request)
  const signature = await sign(hmacKey, requestString)
  return { signature, aesKey }
}
