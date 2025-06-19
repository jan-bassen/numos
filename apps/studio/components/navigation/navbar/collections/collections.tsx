import { getAllCollections } from '@/lib/supabase/db/collections'
import { SupabaseImage } from '@/components/supabase/supabase-image'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/sidebar'
import Link from 'next/link'

export async function Collections() {
  const collections = await getAllCollections()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Link href={'/collections'} className="hover:underline">
          {'Collections'}
        </Link>
      </SidebarGroupLabel>
      <SidebarMenu>
        {collections.map((collection) => {
          const href = `/collections/${collection.slug}`
          return (
            <SidebarMenuItem key={collection.slug}>
              <SidebarMenuButton asChild>
                <Link
                  href={href}
                  className="group-data-[collapsible=icon]:!px-1.5 group-data-[collapsible=icon]:!py-1.5 flex items-center gap-3"
                >
                  <SupabaseImage
                    src={
                      collection.image
                        ? `collection-images/${collection.id}/${collection.image}`
                        : undefined
                    }
                    placeholder
                    alt="Collection Image"
                    width={20}
                    height={20}
                    className="!size-5 shrink-0 rounded-md object-cover"
                  />
                  <span>{collection.name || 'Unnamed Collection'}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
