import { type ClassValue, clsx } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// TODO: Move all below to shared
export type ReturnInfo = {
  ok: boolean
  message: string | null
}

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

export function getHost() {
  let url =
    process?.env?.VERCEL_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000/'
  url = url.includes('http') ? url : `https://${url}`
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

export const hrefRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
