import { z } from 'zod'

export function zDiscriminatedUnion<
  T extends readonly [z.ZodType, z.ZodType, ...z.ZodType[]],
>(
  key: string,
  types: T,
  _errorMap?: Record<string, string>,
): z.ZodUnion<T> {
  // Use z.discriminatedUnion internally but return as ZodUnion to preserve
  // type inference across Zod 4's stricter discriminated union constraints
  return z.discriminatedUnion(key, types as any) as unknown as z.ZodUnion<T>
}
