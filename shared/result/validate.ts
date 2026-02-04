import type { z, ZodType } from 'zod'
import { Err } from './err'
import { Ok } from './ok'
import type { Result } from './try'

export function validate<T extends ZodType>(
  schema: T,
  value: z.infer<T>,
): Result<z.infer<T>, 'validation'> {
  const result = schema.safeParse(value)
  if (result.success) {
    return new Ok(result.data)
  }
  return Err.fromZodError(result.error)
}
