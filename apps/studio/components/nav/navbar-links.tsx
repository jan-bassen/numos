'use client'

import Link from 'next/link'
import { Button, buttonVariants } from '@repo/ui/components/uibutton'
import { cn } from '@/lib/utils'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/uidropdown-menu'
import {
  PiPhotoImageDefaultStroke,
  PiPhotoImageDefaultSolid,
  PiChevronSortVerticalStroke,
  PiBarchartDefaultStroke,
  PiBarchartDefaultSolid,
  PiLayerThreeStroke,
  PiLayerThreeSolid,
  PiAutomationStroke,
  PiAutomationSolid,
  PiSettings02Stroke,
  PiSettings02Solid,
} from '@/lib/icons'
import { links } from '../landing-page/nav/nav-links'

export const iconClassesStroke = 'h-4 w-4 md:h-5 md:w-5 my-auto'
export const iconClassesSolid = 'h-4 w-4 md:h-5 md:w-5 my-auto'

export const navigationGroups = [
  {
    key: 'main',
    links: [
      {
        name: 'Attributes',
        slug: 'attributes',
        icons: {
          stroke: <PiBarchartDefaultStroke className={iconClassesStroke} />,
          fill: <PiBarchartDefaultSolid className={iconClassesSolid} />,
        },
      },
      {
        name: 'Actions',
        slug: 'actions',
        icons: {
          stroke: <PiAutomationStroke className={iconClassesStroke} />,
          fill: <PiAutomationSolid className={iconClassesSolid} />,
        },
      },
      {
        name: 'Layers',
        slug: 'layers',
        icons: {
          stroke: <PiLayerThreeStroke className={iconClassesStroke} />,
          fill: <PiLayerThreeSolid className={iconClassesSolid} />,
        },
      },
      {
        name: 'Image',
        slug: 'image',
        icons: {
          stroke: <PiPhotoImageDefaultStroke className={iconClassesStroke} />,
          fill: <PiPhotoImageDefaultSolid className={iconClassesSolid} />,
        },
      },
      /*     {
      name: "Testing",
      slug: "testing",
      icons: {
        stroke: <PiShieldCheckStroke className={iconClassesStroke} />,
        fill: <PiShieldCheckSolid className={iconClassesSolid} />,
      },
    }, 
    {
      name: "Versions",
      slug: "versions",
      icons: {
        stroke: <PiGitFork02Stroke className={iconClassesStroke} />,
        fill: <PiGitFork02Solid className={iconClassesSolid} />,
      },
    },*/
      {
        name: 'Settings',
        slug: 'settings',
        icons: {
          stroke: <PiSettings02Stroke className={iconClassesStroke} />,
          fill: <PiSettings02Solid className={iconClassesSolid} />,
        },
      },
    ],
  },
]

export function NavbarLinks({
  currentCollection,
  collapsed,
}: {
  currentCollection?: string
  collapsed?: boolean
}) {
  const selectedLayoutSegment = useSelectedLayoutSegment()
  if (!currentCollection) {
    return null
  }
  return (
    <div className="hidden flex-col gap-4 md:flex">
      {navigationGroups.map((groups, index) => (
        <ul key={groups.key} className="flex flex-col gap-0.5">
          {groups.links.map((link) => (
            <Link
              key={link.slug}
              href={`/studio/${currentCollection}/${link.slug}`}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'flex gap-3 align-middle text-base text-foreground md:text-sm md:text-muted-foreground',
                collapsed ? 'justify-center p-2' : 'justify-start ',
                link.slug === selectedLayoutSegment &&
                  'bg-muted !text-foreground',
              )}
            >
              {link.slug === selectedLayoutSegment
                ? link.icons.fill
                : link.icons.stroke}
              {!collapsed && link.name}
            </Link>
          ))}
        </ul>
      ))}
    </div>
  )
}

export function MobileNavbarLinks({
  currentCollection,
}: {
  currentCollection: string
}) {
  const selectedLayoutSegment = useSelectedLayoutSegment()
  /*   const current = navigationGroups
    .flat()
    .find((link) => link.slug === selectedLayoutSegment) */
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="my-auto h-8 capitalize gap-1 bg-secondary px-2 py-1"
        >
          {selectedLayoutSegment || 'Overview'}
          <PiChevronSortVerticalStroke className="my-auto h-4 w-4 stroke-1.7" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={8}
        align="center"
        className="flex flex-col gap-3"
      >
        {navigationGroups.map((group, index) => (
          <DropdownMenuGroup key={group.key}>
            {group.links.map((link) => (
              <DropdownMenuItem asChild key={link.slug}>
                <Link
                  key={link.slug}
                  href={`/studio/${currentCollection}/${link.slug}`}
                  className={cn(
                    'gap-1.5',
                    link.slug === selectedLayoutSegment &&
                      'bg-muted !text-foreground',
                  )}
                >
                  {link.slug === selectedLayoutSegment
                    ? link.icons.fill
                    : link.icons.stroke}
                  {link.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
