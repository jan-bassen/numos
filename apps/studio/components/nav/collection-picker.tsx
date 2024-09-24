'use client'

import { Button, buttonVariants } from '@repo/ui/components/uibutton'
import type { Collection } from '@/types/database.types'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PiChevronSortVerticalStroke } from '@/lib/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/uidropdown-menu'
import { SupabaseImage } from '@/lib/supabase/storage/supabaseImage'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/uitooltip'

export default function CollectionPicker({
  collections,
  collapsed,
  currentCollection,
  className,
}: {
  collections: Collection[]
  collapsed?: boolean
  currentCollection?: Collection
  className?: string
}) {
  return (
    <DropdownMenu modal={true}>
      <div className={cn('flex grow-0 md:w-full', className)}>
        <Link
          href={`/studio/${currentCollection?.slug}`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'flex gap-3 p-0 md:h-11 md:gap-2',
            collapsed
              ? 'w-full justify-center rounded-lg'
              : 'grow-0 justify-start rounded-none border-border md:w-[calc(100%-2rem)] md:rounded-l-lg md:border md:px-3',
          )}
        >
          <SupabaseImage
            src={
              currentCollection?.image
                ? `collection-images/${currentCollection?.image}`
                : undefined
            }
            alt="Collection Image"
            width={128}
            height={128}
            className={cn(
              'h-8 w-8 shrink-0 rounded-full object-cover ',
              collapsed ? 'md:h-7 md:w-7' : 'md:h-6 md:w-6',
            )}
          />
          <Tooltip>
            <TooltipTrigger
              className={cn(
                '!line-clamp-1 !text-ellipsis !hidden md:!inline w-full text-left text-base md:text-sm',
                !currentCollection?.name ||
                  (currentCollection.name.length < 15 && 'pointer-events-none'),
                collapsed && 'md:!hidden',
              )}
            >
              {currentCollection?.name || 'Select Collection'}
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              {currentCollection?.name || 'Select Collection'}
            </TooltipContent>
          </Tooltip>
        </Link>
        {!collapsed && (
          <DropdownMenuTrigger asChild>
            <Button
              variant={'ghost'}
              className="hidden rounded-none border-border border-y border-r p-0 md:flex md:h-11 md:rounded-r-lg md:px-2"
            >
              <PiChevronSortVerticalStroke className="hidden h-4 w-4 md:block md:stroke-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
        )}
      </div>
      <DropdownMenuContent
        sideOffset={6}
        align="end"
        alignOffset={-8}
        className="mt-1 mr-0.5 ml-2 min-w-[10rem] md:mt-0 md:mr-2 md:w-48"
      >
        {collections.map((collection) => (
          <DropdownMenuItem key={collection.slug} asChild>
            <Link
              href={`/studio/${collection.slug}`}
              key={collection.id}
              className="flex h-9 shrink-0 gap-2 font-medium"
            >
              <SupabaseImage
                src={
                  collection?.image
                    ? `collection-images/${collection?.image}`
                    : undefined
                }
                alt="Collection Image"
                width={24}
                height={24}
                className="h-5 w-5 shrink-0 rounded-full object-cover"
              />
              <p className="line-clamp-1 inline self-center text-ellipsis text-left">
                {collection.name ? collection.name : 'Unnamed'}
              </p>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
