import { z } from 'zod'

type ErrorMap = Partial<Record<z.ZodIssueOptionalMessage['code'], string>>

export function zDiscriminatedUnion<
  T extends readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]],
>(key: string, types: T, errorMap?: ErrorMap): z.ZodUnion<T>

export function zDiscriminatedUnion(
  key: string,
  types: z.ZodTypeAny[],
  errorMap?: ErrorMap,
): any {
  const optionsMap = new Map()
  for (const type of types) {
    const value = (type instanceof z.ZodEffects ? type.sourceType() : type)
      .shape[key]

    if (!(value instanceof z.ZodLiteral) || optionsMap.has(value.value)) {
      throw new Error('cannot contruct discriminated union')
    }
    optionsMap.set(value.value, type)
  }
  return new z.ZodDiscriminatedUnion({
    typeName: z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
    discriminator: key,
    options: types as any,
    optionsMap,
    errorMap: (issue) => {
      if (errorMap?.[issue.code]) {
        return { message: errorMap[issue.code] || 'Error' }
      }
      return { message: issue.message || 'Error' }
    },
  })
}
