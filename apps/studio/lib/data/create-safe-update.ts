'use client'

import type { UpdateOptions } from '@/types/state.types'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import { redirect } from 'next/navigation'
import { ZodError, type ZodType } from 'zod'

/**
 * Client port of the former server-action `createSafeUpdate`.
 *
 * Validates with the given schema, runs the update against the client store, and
 * returns `ReturnInfo`. The `options.revalidate` path-revalidation is a no-op now
 * that data lives client-side (contexts hold authoritative local state); only
 * `options.redirect` is still honoured.
 */
export function createSafeUpdate<T extends Record<string, any>>(
  update: (id: string, values: T) => Promise<ReturnInfo>,
  schema: ZodType,
) {
  return async (id: string, values: T, options?: UpdateOptions) => {
    let message: string | null = null
    try {
      const validValues = (await schema.parseAsync(values)) as T

      const res = await update(id, validValues)
      if (!res.ok) {
        return res
      }
      message = res.message
    } catch (error) {
      if (error instanceof ZodError)
        return { ok: false, message: error.message }
      return { ok: false, message: 'Error updating attribute' }
    }
    if (options?.redirect) {
      redirect(`${options.redirect}`)
    }
    return { ok: true, message }
  }
}
