import { generateClientSecret } from '@repo/shared/security/generate-client-secret'
import { deriveKeys } from '@repo/shared/security/derive-keys'
import { encrypt } from '@repo/shared/security/encryption/encrypt'

export async function generateApiKey() {
  const id = crypto.randomUUID()
  const clientSecret = await generateClientSecret()
  const { hmacKey, aesKey } = await deriveKeys(clientSecret)
  const { encryptedKey, iv } = encrypt(aesKey, hmacKey)
  return {
    id,
    clientSecret,
    encryptedKey,
    iv,
  }
}
