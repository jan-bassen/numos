import UserProfileEditor from '../../components/user/profile-editor'
import { getProfile, getUser } from '@/lib/supabase/db/profile'

export default async function UserProfilePage() {
  const user = await getUser()
  const profile = await getProfile(user.id)
  return <UserProfileEditor user={user} profile={profile} />
}
