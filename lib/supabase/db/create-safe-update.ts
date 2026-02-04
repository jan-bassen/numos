import type { UpdateOptions } from '@/types/state.types'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ZodError, type ZodType } from 'zod'

export function createSafeUpdate<T extends Record<string, any>>(
  update: (id: string, values: T) => Promise<ReturnInfo>,
  schema: ZodType,
) {
  return async (id: string, values: T, options?: UpdateOptions) => {
    let message: string | null = null
    try {
      const validValues = (await schema.parseAsync(values)) as T

      const res = await update(id, validValues)
      console.log(res)
      if (!res.ok) {
        return res
      }
      message = res.message
      if (options?.revalidate) {
        for (const { path, type } of options.revalidate) {
          revalidatePath(path, type)
        }
      }
    } catch (error) {
      console.log(error)
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
