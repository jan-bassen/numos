import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@repo/ui/components/ui/sidebar'
import { Support } from './support'
import type { ActionNavItem } from '@/lib/supabase/db/actions'
import { NavUser } from '@/components/navigation/navbar/user/nav-user'
import { Suspense } from 'react'
import { NavUserSkeleton } from '@/components/navigation/navbar/user/nav-user-skeleton'
import { CollectionParts } from '@/components/navigation/navbar/collection/collection-parts/collection-parts'
import { NumosButton } from '@/components/navigation/navbar/numos-button'
import { Collections } from '@/components/navigation/navbar/collections/collections'
import { CollectionsSkeleton } from '@/components/navigation/navbar/collections/collections-skeleton'
import { CollectionSettings } from '@/components/navigation/navbar/collection/collection-general'
import { CollectionPartsSkeleton } from '@/components/navigation/navbar/collection/collection-parts/collection-parts-skeleton'
import type { AttributeNavItem } from '@/lib/supabase/db/attributes/read'

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  collection?: string
}

export type NavItems = [AttributeNavItem[], ActionNavItem[]]

export async function Navbar({ collection, ...props }: SidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader /* className={cn(!!collection && 'pb-5')} */>
        <NumosButton />
      </SidebarHeader>
      <SidebarContent className="scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
        {collection ? (
          <>
            {/*  <div className="p-2">
              <Suspense fallback={<CollectionSwitcherSkeleton />}>
                <CollectionSwitcher collection_slug={collection} />
              </Suspense>
            </div> */}
            <Suspense
              fallback={
                <CollectionPartsSkeleton collection_slug={collection} />
              }
            >
              <CollectionParts collection_slug={collection} />
            </Suspense>
            <CollectionSettings collection_slug={collection} />
          </>
        ) : (
          <Suspense fallback={<CollectionsSkeleton />}>
            <Collections />
          </Suspense>
        )}
        <Support className="mt-auto" />
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
