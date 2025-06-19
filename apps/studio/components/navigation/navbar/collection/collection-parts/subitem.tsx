import { cn } from '@repo/ui/lib/utils'

import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@repo/ui/components/sidebar'
import type { SidebarSubitem } from './collection-items'
import { DropdownMenuItem } from '@repo/ui/components/dropdown-menu'
import Link from 'next/link'
import type { ComponentProps } from 'react'

export type SubitemType = 'sidebar' | 'dropdown'
type SubitemExtra = {
  subItem: SidebarSubitem
  href: string
  isActive: boolean
}

export function CustomSidebarSubitem({
  subItem,
  href,
  isActive,
  className,
  ...props
}: SubitemExtra & ComponentProps<'li'>) {
  return (
    <SidebarMenuSubItem
      className="rounded-md data-[state=open]:bg-sidebar-accent"
      {...props}
    >
      <SidebarMenuSubButton asChild isActive={isActive}>
        <a href={href} className={cn(isActive && 'font-medium', className)}>
          <span>{subItem.title}</span>
        </a>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

export function CustomDropdownSubitem({
  subItem,
  isActive,
  className,
  href,
  ...props
}: SubitemExtra & ComponentProps<typeof Link>) {
  return (
    <DropdownMenuItem key={subItem.slug} asChild>
      <Link
        href={href}
        className={cn(
          'data-[state=open]:bg-sidebar-accent',
          isActive && 'font-medium',
          className,
        )}
        {...props}
      >
        <span>{subItem.title}</span>
      </Link>
    </DropdownMenuItem>
  )
}
