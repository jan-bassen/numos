import { sign } from './sign'

export async function validateSignature(
  secretKey: string,
  data: string,
  providedSignature: string,
): Promise<boolean> {
  const computedSignature = await sign(secretKey, data)
  return computedSignature === providedSignature
}
