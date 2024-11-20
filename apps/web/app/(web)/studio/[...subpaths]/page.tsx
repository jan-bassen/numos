import { redirect } from 'next/navigation'

export default function RedirectPage() {
  redirect('https://studio.numos.xyz/')
  return null
}
