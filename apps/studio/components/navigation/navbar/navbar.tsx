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
import { NavCollectionParts } from './collection/collection-parts/nav-collection-parts'
import { NumosButton } from './numos-button'
import { NavCollections } from './nav-collections'
import { NavCollectionSettings } from './collection/nav-collection-settings'

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
            <>
              <NavCollectionParts collection_slug={collection} />
              <NavCollectionSettings collection_slug={collection} />
            </>
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
