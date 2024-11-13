import { createSupabaseServerComponentClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerComponentClient()
  const { data } = await supabase.auth.getUser()
  if (data.user) {
    redirect('/')
  }
  return <>{children}</>
}
