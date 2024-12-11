import type { Result } from '@repo/shared/types/result'
import type { ReturnInfo } from '@repo/ui/lib/utils'

// Schema

export type NestedErrors = { [key: string]: string | NestedErrors | undefined }

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

export type Update<U extends Record<string, any>> = (
  id: string,
  values: Partial<U>,
  options?: UpdateOptions,
) => Promise<ReturnInfo>

export type SetState<S extends Record<string, any>> = (
  value: Partial<S>,
  options?: UpdateOptions,
) => Promise<ReturnInfo>

export type ValidateUpdate<T extends Record<string, any>> = (
  id: string,
  value: Partial<T>,
  options?: UpdateOptions,
) => Promise<ReturnInfo>

export type Validate<T extends Record<string, any>> = (
  value: Partial<T>,
) => Promise<Result<Partial<T>, string>>

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
