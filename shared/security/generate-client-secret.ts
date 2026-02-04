// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { randomBytes } from 'crypto'

export async function generateClientSecret() {
  const random = randomBytes(64)
  return random.toString('base64url')
}
