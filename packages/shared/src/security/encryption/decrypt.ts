import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto'

export function decrypt(aesKey: string, data: string, iv: string): string {
  // Ensure the client secret is exactly 32 bytes (AES-256 key requirement)
  const key = createHash('sha256').update(aesKey).digest()

  // Decode the IV
  const ivBuffer = Buffer.from(iv, 'base64')

  // Create the decipher instance
  const decipher = createDecipheriv('aes-256-cbc', key, ivBuffer)

  // Decrypt the HMAC key
  let decrypted = decipher.update(data, 'base64', 'utf8')

  try {
    decrypted += decipher.final('utf8')
  } catch (error) {
    throw new Error('Invalid HMAC key')
  }

  return decrypted
}
