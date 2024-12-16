import type { NestedErrors } from '@/types/state.types'
import { getValueAtPath } from '@/lib/state/validation/traverse-object'

export const createGetError = (
  errors: NestedErrors,
): ((path: Array<string | number>) => NestedErrors | undefined) => {
  return (path: Array<string | number>) => {
    return getValueAtPath(errors, path) as NestedErrors | undefined
  }
}
