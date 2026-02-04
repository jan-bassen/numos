import { hexToUint8Array } from '@repo/shared/utils/hex-to-uint8'

export async function sign(hmacKey: string, data: string) {
  const encoder = new TextEncoder()

  // Import the shared secret key for HMAC
  const key = await crypto.subtle.importKey(
    'raw',
    hexToUint8Array(hmacKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  // Compute the HMAC signature
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data),
  )

  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return signature
}
