'use client'

import { ChevronRight, Plus } from 'lucide-react'
import {
  PiAutomationSolid,
  PiAutomationStroke,
  PiBarchartDefaultSolid,
  PiBarchartDefaultStroke,
  PiPhotoImageDefaultSolid,
  PiPhotoImageDefaultStroke,
} from '@repo/ui/icons/pika'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/ui/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@repo/ui/components/ui/sidebar'

import { useState, type SVGProps } from 'react'
import type { Collection } from '@/types/database.types'
import { dataTypes } from '@/lib/supabase/constants/datatypes'
import { triggerOptions } from '@/lib/schemas/action-schema'
import type { NavItems } from '../navbar'
import { useSelectedLayoutSegments } from 'next/navigation'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import { Button } from '@repo/ui/components/ui/button'
import { NewActionDialog } from '@/app/collections/[collection]/actions/(components)/new-action-dialog'
import { NewAttributeDialog } from '@/app/collections/[collection]/attributes/(components)/new-attribute-dialog'
import AttributeContextMenu from '@/app/collections/[collection]/attributes/(components)/attribute-context-menu'
import ActionContextMenu from '@/app/collections/[collection]/actions/(components)/action-context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'

const getItems = (items: NavItems): SidebarItem[] => {
  const [attributes, actions] = items
  return [
    {
      title: 'Attributes',
      slug: 'attributes',
      icons: {
        stroke: PiBarchartDefaultStroke,
        fill: PiBarchartDefaultSolid,
      },
      items: attributes.map((attribute) => ({
        title: attribute.name || `Unnamed ${dataTypes[attribute.type].title}`,
        slug: attribute.slug,
      })),
    },
    {
      title: 'Actions',
      slug: 'actions',
      icons: {
        stroke: PiAutomationStroke,
        fill: PiAutomationSolid,
      },
      items: actions.map((action) => ({
        title:
          action.name ||
          `Unnamed ${triggerOptions.find((option) => option.value === action.type)?.label || 'Action'}`,
        slug: action.slug,
      })),
    },
    {
      title: 'Image',
      slug: 'image',
      icons: {
        stroke: PiPhotoImageDefaultStroke,
        fill: PiPhotoImageDefaultSolid,
      },
      items: [
        {
          title: 'Layers',
          slug: 'layers',
        },
        {
          title: 'Image',
          slug: 'image',
        },
        { title: 'Settings', slug: 'settings' },
      ],
    },
  ]
}

export type SidebarItem = {
  title: string
  slug: string
  icons: {
    stroke: (props: SVGProps<SVGSVGElement>) => JSX.Element
    fill: (props: SVGProps<SVGSVGElement>) => JSX.Element
  }
  items?: {
    title: string
    slug: string
  }[]
}

type NavMainProps = {
  collection: Collection
  navItems: NavItems
}

export function NavCollectionItems({ collection, navItems }: NavMainProps) {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const { open: sidebarOpen } = useSidebar()
  const items = getItems(navItems)
  const segments = useSelectedLayoutSegments()
  const version = collection.editable_version
  if (!version) throw new Error('No version')
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Link
          href={`/collections/${collection.slug}`}
          className="hover:underline"
        >
          {collection.name || 'Collection'}
        </Link>
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            item.slug === segments[0] || item.slug === dropdownOpen
          const href = `/collections/${collection.slug}/${item.slug}`
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className={cn('group/collapsible')}
            >
              <SidebarMenuItem>
                <DropdownMenu
                  key={item.slug}
                  open={dropdownOpen === item.slug}
                  onOpenChange={(open) => {
                    if (open && !sidebarOpen) setDropdownOpen(item.slug)
                    if (!open) setDropdownOpen(null)
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton asChild>
                      <div
                        className={cn(
                          'group/collapsible-trigger flex items-center pl-1.5',
                          isActive && 'bg-sidebar-accent',
                        )}
                      >
                        <CollapsibleTrigger className="shrink-0 rounded-sm hover:text-sidebar-accent-foreground group-data-[state=expanded]:size-5 group-data-[state=expanded]:hover:bg-sidebar-accent-foreground/10">
                          {isActive ? (
                            <item.icons.fill className="size-4 group-data-[state=expanded]:group-hover/collapsible-trigger:hidden " />
                          ) : (
                            <item.icons.stroke className="size-4 group-data-[state=expanded]:group-hover/collapsible-trigger:hidden" />
                          )}
                          <ChevronRight className="mx-auto hidden size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[state=expanded]:group-hover/collapsible-trigger:block" />
                        </CollapsibleTrigger>
                        <Link
                          className={cn('w-full', isActive && 'font-semibold')}
                          href={href}
                        >
                          <span>{item.title}</span>
                        </Link>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="center"
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  >
                    <DropdownMenuLabel className="px-1 py-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <Link href={href} className="hover:underline">
                          {item.title}
                        </Link>
                        {item.slug === 'actions' && (
                          <NewActionDialog
                            versionId={version}
                            collectionSlug={collection.slug}
                            button={
                              <Button variant={'ghost'} size={'iconSmall'}>
                                <Plus className="size-3.5" />
                                <span className="sr-only">Add Action</span>
                              </Button>
                            }
                          />
                        )}
                        {item.slug === 'attributes' && (
                          <NewAttributeDialog
                            versionId={version}
                            collectionSlug={collection.slug}
                            button={
                              <Button variant={'ghost'} size={'iconSmall'}>
                                <Plus className="size-4" />
                                <span className="sr-only">Add Attribute</span>
                              </Button>
                            }
                          />
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.items?.map((subItem) => {
                      const isActive = subItem.slug === segments[1]
                      const href = `/collections/${collection.slug}/${item.slug}/${subItem.slug}`
                      if (item.slug === 'attributes') {
                        return (
                          <AttributeContextMenu
                            key={subItem.slug}
                            attributeSlug={subItem.slug}
                            collectionSlug={collection.slug}
                            versionId={version}
                          >
                            <DropdownMenuItem key={subItem.slug} asChild>
                              <Link
                                href={href}
                                className={cn(isActive && 'font-medium')}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </DropdownMenuItem>
                          </AttributeContextMenu>
                        )
                      }
                      if (item.slug === 'actions') {
                        return (
                          <ActionContextMenu
                            key={subItem.slug}
                            actionSlug={subItem.slug}
                            collectionSlug={collection.slug}
                            versionId={version}
                          >
                            <DropdownMenuItem key={subItem.slug} asChild>
                              <Link
                                href={href}
                                className={cn(isActive && 'font-medium')}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </DropdownMenuItem>
                          </ActionContextMenu>
                        )
                      }
                      return (
                        <DropdownMenuItem key={subItem.slug} asChild>
                          <Link
                            href={href}
                            className={cn(isActive && 'font-medium')}
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                {item.slug === 'actions' && (
                  <NewActionDialog
                    versionId={version}
                    collectionSlug={collection.slug}
                    button={
                      <SidebarMenuAction
                        className={cn(
                          isActive && 'hover:bg-sidebar-accent-foreground/10',
                        )}
                      >
                        <Plus className="!size-3.5" />
                        <span className="sr-only">Add Action</span>
                      </SidebarMenuAction>
                    }
                  />
                )}
                {item.slug === 'attributes' && (
                  <NewAttributeDialog
                    versionId={version}
                    collectionSlug={collection.slug}
                    button={
                      <SidebarMenuAction
                        className={cn(
                          isActive && 'hover:bg-sidebar-accent-foreground/10',
                        )}
                      >
                        <Plus className="!size-3.5" />
                        <span className="sr-only">Add Attribute</span>
                      </SidebarMenuAction>
                    }
                  />
                )}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isActive = subItem.slug === segments[1]
                      const href = `/collections/${collection.slug}/${item.slug}/${subItem.slug}`
                      if (item.slug === 'attributes') {
                        return (
                          <AttributeContextMenu
                            key={subItem.slug}
                            attributeSlug={subItem.slug}
                            collectionSlug={collection.slug}
                            versionId={version}
                          >
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild isActive={isActive}>
                                <a
                                  href={href}
                                  className={cn(isActive && 'font-medium')}
                                >
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </AttributeContextMenu>
                        )
                      }
                      if (item.slug === 'actions') {
                        return (
                          <ActionContextMenu
                            key={subItem.slug}
                            actionSlug={subItem.slug}
                            collectionSlug={collection.slug}
                            versionId={version}
                          >
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild isActive={isActive}>
                                <a
                                  href={href}
                                  className={cn(isActive && 'font-medium')}
                                >
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </ActionContextMenu>
                        )
                      }
                      return (
                        <SidebarMenuSubItem key={subItem.slug}>
                          <SidebarMenuSubButton asChild isActive={isActive}>
                            <a
                              href={href}
                              className={cn(isActive && 'font-medium')}
                            >
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
