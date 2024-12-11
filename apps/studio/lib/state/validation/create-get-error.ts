import type { NestedErrors } from '@/types/state.types'

export const createGetError = (
  errors: NestedErrors,
): ((path: string) => string | undefined) => {
  return (path: string) => {
    const paths = path.split('.')
    let current: string | NestedErrors | undefined = errors
    let result: string | undefined = undefined
    paths.forEach((key, index) => {
      if (typeof current === 'object') {
        current = current[key]
      }
      if (typeof current === 'string') {
        result = current
      }
    })
    return result
  }
}
