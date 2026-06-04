'use client'

import { UserProvider } from '@/app/(providers)/user-context'
import { ProfileProvider } from '@/app/(providers)/profile-context'
import type { ReactNode } from 'react'
import { getProfile } from '@/lib/data/profile/read'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import { DEMO_USER, DEMO_USER_ID } from '@/lib/data/demo-constants'

export default function CollectionsLayout({
  children,
}: {
  children: ReactNode
}) {
  const { data: profile } = useAsyncResource(
    () => getProfile(DEMO_USER_ID),
    [],
  )

  if (!profile) return null

  return (
    <UserProvider user={DEMO_USER}>
      <ProfileProvider profile={profile}>{children}</ProfileProvider>
    </UserProvider>
  )
}
