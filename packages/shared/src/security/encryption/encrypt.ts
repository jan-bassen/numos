import { createCipheriv, createHash, randomBytes } from 'node:crypto'

export function encrypt(
  aesKey: string,
  data: string,
): { encryptedKey: string; iv: string } {
  // Ensure the client secret is exactly 32 bytes (AES-256 key requirement)
  const key = createHash('sha256').update(aesKey).digest()

  // Generate a random IV (Initialization Vector)
  const iv = randomBytes(16)

  // Create the cipher instance
  const cipher = createCipheriv('aes-256-cbc', key, iv)

  // Encrypt the HMAC key
  let encryptedKey = cipher.update(data, 'utf8', 'base64')
  encryptedKey += cipher.final('base64')

  // Return the encrypted key and IV
  return {
    encryptedKey,
    iv: iv.toString('base64'),
  }
}
