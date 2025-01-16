import { Page } from '@/components/page/page'
import { Navbar } from '@/components/navigation/navbar/navbar'
import { getProfile } from '@/lib/supabase/db/profile/read'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { redirect } from 'next/navigation'
import { ProfileProvider } from '@/app/(providers)/profile-context'
import { UserProvider } from '@/app/(providers)/user-context'

export default async function UserLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerComponentClient()
  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }
  const profile = await getProfile(user?.user?.id)
  return (
    <UserProvider user={user.user || undefined}>
      <ProfileProvider profile={profile}>
        <Navbar />
        <Page>{children}</Page>
      </ProfileProvider>
    </UserProvider>
  )
}
