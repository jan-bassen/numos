import { redirect } from 'next/navigation'
import { getStudioUrl } from '@/lib/urls'

export default function RedirectPage() {
  redirect(getStudioUrl())
  return <div />
}
