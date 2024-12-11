import { z } from 'zod'

export function zDiscriminatedUnion<
  T extends readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]],
>(key: string, types: T): z.ZodUnion<T>

export function zDiscriminatedUnion(key: string, types: z.ZodTypeAny[]): any {
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
  })
}
