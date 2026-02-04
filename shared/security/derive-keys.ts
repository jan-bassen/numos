export async function deriveKeys(clientSecret: string) {
  const bytes = Uint8Array.from(Buffer.from(clientSecret, 'base64url'))
  const part1 = bytes.slice(0, 32)
  const part2 = bytes.slice(32, 64)

  const hmacKey = await deriveKeyHmacKey(part1)
  const aesKey = await deriveKeyAesKey(part2)

  return {
    hmacKey,
    aesKey,
  }
}

const deriveKeyHmacKey = async (buffer: Uint8Array) => {
  const key = await crypto.subtle.importKey(
    'raw',
    buffer,
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  )
  const rawKey = await crypto.subtle.exportKey('raw', key)
  const encodedKey = Array.from(new Uint8Array(rawKey))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return encodedKey
}

const deriveKeyAesKey = async (buffer: Uint8Array) => {
  const key = await crypto.subtle.importKey(
    'raw',
    buffer,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )

  const jwk = await crypto.subtle.exportKey('jwk', key)
  const aesKey = jwk.k
  if (!aesKey) throw new Error('Key not found')

  return aesKey
}
