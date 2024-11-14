import { getProfile, getUser } from '@/lib/supabase/db/profile'
import { NavUserButton } from './nav-user-button'

export async function NavUser() {
  const user = await getUser()
  const profile = await getProfile(user.id)
  const userData = {
    username: user.user_metadata.name,
    name:
      profile?.full_name ||
      profile?.username ||
      user?.user_metadata.name ||
      'User',
    email: user.email,
    internal_avatar: profile?.avatar_url || undefined,
    external_avatar: user.user_metadata.avatar_url,
  }
  return <NavUserButton user={userData} />
}
