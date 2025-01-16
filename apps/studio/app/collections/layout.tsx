import { UserProvider } from '@/app/(providers)/user-context'
import { ProfileProvider } from '@/app/(providers)/profile-context'
import type { ReactNode } from 'react'
import { getProfile } from '@/lib/supabase/db/profile/read'
import { redirect } from 'next/navigation'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'

export default async function CollectionsLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createSupabaseServerComponentClient()
  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }
  const profile = await getProfile(user?.user?.id)
  return (
    <UserProvider user={user.user || undefined}>
      <ProfileProvider profile={profile}>{children}</ProfileProvider>
    </UserProvider>
  )
}
