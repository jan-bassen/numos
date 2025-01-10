import type { FullValue, Value, ValueType } from '@repo/shared/types/values'

export type ParameterState = Record<
  string,
  Value<ValueType, 'objectarray' | 'single'>
>
