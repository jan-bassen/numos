import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@repo/ui/components/sidebar'
import Link from 'next/link'

export function CollectionPartsSkeleton({
  collection_slug,
}: { collection_slug: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Link
          href={`/collections/${collection_slug}`}
          className="hover:underline"
        >
          Components
        </Link>
      </SidebarGroupLabel>
      <SidebarMenu>
        {Array.from({ length: 3 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <SidebarMenuItem key={index}>
            <SidebarMenuSkeleton />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
