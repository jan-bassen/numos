'use client'

import { Plus } from 'lucide-react'
import {
  PiAddAddStroke,
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
} from '@repo/ui/components/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@repo/ui/components/sidebar'
import { type JSX, useState, type SVGProps } from 'react'
import type { Collection } from '@/types/database.types'
import { dataTypes } from '@/lib/constants/datatypes'
import type { NavItems } from '../../navbar'
import { useSelectedLayoutSegments } from 'next/navigation'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { triggerOptionsArray } from '@/lib/constants/triggers'
import { CustomSidebarSubitem } from '@/components/navigation/navbar/collection/collection-parts/subitem'
import { type ElementType, elementTypes } from '@/lib/constants/elements'
import { ElementContextMenu } from '@/components/elements/context-menu'
import { CustomDropdownSubitem } from './subitem'
import { NewElementDialog } from '@/components/elements/new-dialog'
import { CollapsibleItem } from '@/components/navigation/navbar/collection/collection-parts/collapsible-item'

const getItems = (items: NavItems): SidebarItem[] => {
  const [attributes, actions, layers] = items
  return [
    {
      title: 'Attributes',
      elementType: 'attribute',
      icons: {
        stroke: PiBarchartDefaultStroke,
        fill: PiBarchartDefaultSolid,
      },
      items: attributes.map((attribute) => ({
        title:
          attribute.name || (attribute.value ? `Unnamed ${dataTypes[attribute.value.type].title}` : 'Unnamed Attribute'),
        slug: attribute.slug,
      })),
    },
    {
      title: 'Actions',
      elementType: 'action',
      icons: {
        stroke: PiAutomationStroke,
        fill: PiAutomationSolid,
      },
      items: actions.map((action) => ({
        title:
          action.name ||
          `Unnamed ${triggerOptionsArray.find((option) => option.value === action.type)?.label || 'Action'}`,
        slug: action.slug,
      })),
    },
    {
      title: 'Layers',
      elementType: 'layer',
      icons: {
        stroke: PiPhotoImageDefaultStroke,
        fill: PiPhotoImageDefaultSolid,
      },
      items: layers.map((layer) => ({
        title: layer.name || `Unnamed ${layer.type}`,
        slug: layer.slug,
      })),
    },
  ]
}

export type SidebarSubitem = {
  title: string
  slug: string
}

export type SidebarItem = {
  title: string
  elementType: ElementType
  icons: {
    stroke: (props: SVGProps<SVGSVGElement>) => JSX.Element
    fill: (props: SVGProps<SVGSVGElement>) => JSX.Element
  }
  items?: SidebarSubitem[]
}

type NavMainProps = {
  collection: Collection
  navItems: NavItems
}

export function CollectionItems({ collection, navItems }: NavMainProps) {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const { open: sidebarOpen } = useSidebar()
  const items = getItems(navItems)
  const segments = useSelectedLayoutSegments()
  const version = collection.editableVersion
  if (!version) throw new Error('No version')
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Components</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const slug = elementTypes[item.elementType].slug
          const isActive = slug === segments[0] || slug === dropdownOpen
          const href = `/collections/${collection.slug}/${slug}`
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className={cn('group/collapsible')}
            >
              <SidebarMenuItem>
                <DropdownMenu
                  key={slug}
                  open={dropdownOpen === slug}
                  onOpenChange={(open) => {
                    if (open && !sidebarOpen) setDropdownOpen(slug)
                    if (!open) setDropdownOpen(null)
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <CollapsibleItem
                      item={item}
                      href={href}
                      isActive={isActive}
                    />
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
                        <NewElementDialog
                          versionId={version}
                          elementType={item.elementType}
                        >
                          <Button variant={'ghost'} size={'iconSmall'}>
                            <Plus className="size-4" />
                            <span className="sr-only">Add Attribute</span>
                          </Button>
                        </NewElementDialog>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!item.items || item.items.length === 0 ? (
                      <DropdownMenuItem className="hover:!text-muted-foreground hover:!bg-transparent cursor-default text-muted-foreground">
                        No{' '}
                        {elementTypes[item.elementType].titles.plural_lowercase}{' '}
                        yet
                      </DropdownMenuItem>
                    ) : (
                      item.items?.map((subItem) => {
                        const isActive = subItem.slug === segments[1]
                        const href = `/collections/${collection.slug}/${slug}/${subItem.slug}`
                        return (
                          <ElementContextMenu
                            key={subItem.slug}
                            elementType={item.elementType}
                            slug={subItem.slug}
                            collectionSlug={collection.slug}
                            versionId={version}
                          >
                            <CustomDropdownSubitem
                              key={subItem.slug}
                              subItem={subItem}
                              href={href}
                              isActive={isActive}
                            />
                          </ElementContextMenu>
                        )
                      })
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <NewElementDialog
                  versionId={version}
                  elementType={item.elementType}
                >
                  <SidebarMenuAction
                    className={cn(
                      isActive && 'hover:bg-sidebar-accent-foreground/10',
                    )}
                  >
                    <Plus className="!size-3.5" />
                    <span className="sr-only">Add Action</span>
                  </SidebarMenuAction>
                </NewElementDialog>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {!item.items || item.items.length === 0 ? (
                      <SidebarMenuSubItem>
                        <NewElementDialog
                          versionId={version}
                          elementType={item.elementType}
                        >
                          <SidebarMenuSubButton className="group/add gap-1 text-muted-foreground hover:cursor-pointer">
                            <PiAddAddStroke className="size-3 stroke-muted-foreground group-hover/add:stroke-foreground" />
                            {`Create your first ${
                              elementTypes[item.elementType].titles
                                .singular_lowercase
                            }`}
                          </SidebarMenuSubButton>
                        </NewElementDialog>
                      </SidebarMenuSubItem>
                    ) : (
                      item.items?.map((subItem) => {
                        const isActive = subItem.slug === segments[1]
                        const href = `/collections/${collection.slug}/${slug}/${subItem.slug}`
                        return (
                          <ElementContextMenu
                            key={subItem.slug}
                            elementType={item.elementType}
                            slug={subItem.slug}
                            collectionSlug={collection.slug}
                            versionId={version}
                          >
                            <CustomSidebarSubitem
                              key={subItem.slug}
                              subItem={subItem}
                              href={href}
                              isActive={isActive}
                            />
                          </ElementContextMenu>
                        )
                      })
                    )}
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
