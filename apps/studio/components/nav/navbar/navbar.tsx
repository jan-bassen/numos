import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@repo/ui/components/ui/sidebar'
import { NavSupport } from './nav-support'
import type { AttributeNavItem } from '@/lib/supabase/db/attributes'
import type { ActionNavItem } from '@/lib/supabase/db/actions'
import { NavUser } from './user/nav-user'
import { Suspense } from 'react'
import { NavUserSkeleton } from './user/nav-user-skeleton'
import { NavCollection } from './collection/nav-collection'
import { NumosButton } from './numos-button'
import { NavCollections } from './nav-collections'

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  collection?: string
}

export type NavItems = [AttributeNavItem[], ActionNavItem[]]

export async function Navbar({ collection, ...props }: SidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NumosButton />
      </SidebarHeader>
      <SidebarContent>
        <Suspense>
          {collection ? (
            <NavCollection collection_slug={collection} />
          ) : (
            <NavCollections />
          )}
        </Suspense>
        <NavSupport className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<NavUserSkeleton />}>
          <NavUser />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
