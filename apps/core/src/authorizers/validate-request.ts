import { getApiKey } from '@/ddb/get-api-key'
import { stringifyRequest } from '@repo/shared/security/requests/stringify-request'
import { decrypt } from '@repo/shared/security/encryption/decrypt'
import { validateSignature } from '@repo/shared/security/validate-signature'
import type { RequestParams } from '@repo/shared/types/encryption'

export async function validateRequest(
  keyId: string,
  secretKey: string,
  request: RequestParams,
  signature: string,
) {
  const { iv, encryptedKey } = await getApiKey(keyId)
  const hmacKey = decrypt(secretKey, encryptedKey, iv)
  const requestString = stringifyRequest(request)
  const valid = await validateSignature(hmacKey, requestString, signature)
  if (!valid) throw new Error('Invalid signature')
}
