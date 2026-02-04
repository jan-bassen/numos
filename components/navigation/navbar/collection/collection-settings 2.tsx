'use client'

import {
  PiLinkHorizontalStroke,
  PiRocketShipSolid,
  PiRocketShipStroke,
  PiSettings02Solid,
  PiSettings02Stroke,
} from '@repo/ui/icons/pika'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@repo/ui/components/sidebar'

import { useSelectedLayoutSegments } from 'next/navigation'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'

const items = [
  /*   {
    title: 'Integration',
    slug: 'integration',
    icons: {
      stroke: PiLinkHorizontalStroke,
      fill: PiLinkHorizontalStroke,
    },
  }, */
  {
    title: 'Settings',
    slug: 'settings',
    icons: {
      stroke: PiSettings02Stroke,
      fill: PiSettings02Solid,
    },
  },
]

export function CollectionSettings({
  collection_slug,
}: { collection_slug?: string }) {
  const segments = useSelectedLayoutSegments()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.slug === segments[0]
          const href = `/collections/${collection_slug}/${item.slug}`
          return (
            <SidebarMenuButton asChild key={item.slug}>
              <Link
                className={cn('w-full', isActive && 'font-semibold')}
                href={href}
              >
                {isActive ? (
                  <item.icons.fill className="size-4 " />
                ) : (
                  <item.icons.stroke className="size-4" />
                )}

                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
