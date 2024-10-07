import type { ReturnInfo } from '../types/database.types'
import { toast } from 'sonner'
import baseSlugify from 'slugify'

export function handleReturnInfo(
  res: ReturnInfo,
  onSuccess?: () => void,
  onFailure?: () => void,
) {
  if (!res.ok) {
    toast.error(res.message, { duration: 3000 })
    if (onFailure) onFailure()
    return
  }
  toast.success(res.message, { duration: 1500 })
  if (onSuccess) onSuccess()
}

export function deslugify(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function slugify(text: string) {
  return baseSlugify(text, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: '-',
    strict: true,
  })
}
