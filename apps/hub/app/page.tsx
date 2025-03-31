import { getUser } from '@/server/auth/get-user'
import { Start } from '@/app/(start)/start'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const user = await getUser()
  /* if (user) {
    redirect('/collection')
  } */
  return <Start />
}
