import Main from '@/components/layout/pages/main'
import Page from '@/components/layout/pages/page'
import Navbar from '@/components/nav/navbar'
import MobileNavbar from '@/components/nav/navbar-mobile'
import { createSupabaseServerComponentClient } from '@/lib/supabase/server-client'
import UserProfileEditor from '../../components/user/profile-editor'
import {
  getAllCollections,
  getAllExtendedCollections,
} from '@/lib/supabase/db/collections'

export default async function UserProfilePage() {
  const supabase = await createSupabaseServerComponentClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error('Error fetching user')
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single()
  if (!profile) {
    throw new Error('Error fetching profile')
  }
  const collections = await getAllCollections()
  return (
    <Page>
      <Navbar
        user={user}
        profile={profile}
        collection={undefined}
        collections={collections}
      />
      <MobileNavbar
        user={user}
        profile={profile}
        collection={undefined}
        collections={collections}
        blocking={true}
      />
      <Main>
        <UserProfileEditor user={user} profile={profile} />
      </Main>
    </Page>
  )
}
