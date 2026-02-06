import type { Result } from '@repo/shared/types/result'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import { ZodIssueCode } from 'zod'

// Schema

export type ZodErrorInfo = {
  message: string
  code: (typeof ZodIssueCode)[keyof typeof ZodIssueCode] | null
  validation?: string | null
}

export type NestedErrors = {
  [key: string]:
    | ZodErrorInfo
    | ZodErrorInfo[]
    | NestedErrors
    | NestedErrors[]
    | null
}

export type ContextStateConfig = {
  debounce?: number
}

export type UpdateOptions = {
  debounce?: boolean
  revalidate?: {
    path: string
    type: 'page' | 'layout'
  }[]
  redirect?: string
}

export type Update<UT extends Record<string, any>> = (
  id: string,
  values: UT,
  options?: UpdateOptions,
) => Promise<ReturnInfo>

export type SetState<UT extends Record<string, any>> = (
  value: UT,
  options?: UpdateOptions,
) => Promise<ReturnInfo>

export type ValidateUpdate<UT extends Record<string, any>> = (
  id: string,
  value: UT,
  options?: UpdateOptions,
) => Promise<ReturnInfo>

export type Validate<UT extends Record<string, any>> = (
  value: UT,
) => Promise<Result<UT, string>>

/* export type ContextStateConfigEntry = {
  debounce?: number
  revalidate?: { path: string; type: 'page' | 'layout' }[]
}  */
/* export type UpdateValue<
  S extends Record<string, any>,
  K extends keyof S = keyof S,
> = (
  id: string,
  key: K,
  value: S[K] | undefined,
  options?: UpdateValueOptions,
) => Promise<ReturnInfo> */

/* export type UpdateValueOptions = {
  basePath: string
} & ContextStateConfigEntry */

/* export type SetValue<S extends Record<string, any>, K extends keyof S> = (
  key: K,
  value: S[K],
  options?: UpdateOptions,
) => Promise<ReturnInfo> */

/* export type ValidateUpdateValue<T extends Record<string, any>> = (
  id: string,
  key: keyof T,
  value: any,
  options?: UpdateValueOptions,
) => Promise<ReturnInfo>

export type ValidateValue<T extends Record<string, any>> = (
  key: keyof T,
  value: any,
  options?: UpdateValueOptions,
) => Promise<Result<T[keyof T] | undefined, string>> */

// SetState
