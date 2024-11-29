import { randomBytes } from 'node:crypto'

export async function generateClientSecret() {
  const random = randomBytes(64)
  return random.toString('base64url')
}
