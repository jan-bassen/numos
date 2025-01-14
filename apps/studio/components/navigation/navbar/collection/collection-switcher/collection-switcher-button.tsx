'use client'

import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import type { Collection } from '@/types/database.types'
import Link from 'next/link'
import { cn } from '@repo/ui/lib/utils'
import { PiChevronSortVerticalStroke } from '@repo/ui/icons/pika'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import { SupabaseImage } from '@/components/supabase/supabase-image'
import { useSidebar } from '@repo/ui/components/ui/sidebar'

export function CollectionSwitcherButton({
  collections,
  currentCollection,
  className,
}: {
  collections: Collection[]
  currentCollection?: Collection
  className?: string
}) {
  const { open: sidebarOpen, isMobile } = useSidebar()
  return (
    <DropdownMenu modal={true}>
      <div
        className={cn(
          'flex grow-0 md:w-full',
          sidebarOpen && 'px-1',
          className,
        )}
      >
        <Link
          href={`/collections/${currentCollection?.slug}`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'flex gap-3 p-0 md:h-10 md:gap-2',
            sidebarOpen
              ? 'grow-0 justify-start rounded-none border-border md:w-[calc(100%-2rem)] md:rounded-l-lg md:border md:px-1.5'
              : 'w-full justify-center rounded-lg md:h-8',
          )}
        >
          <SupabaseImage
            src={
              currentCollection?.image
                ? `collection-images/${currentCollection?.image}`
                : undefined
            }
            alt="Collection Image"
            width={32}
            height={32}
            className={cn('size-6 shrink-0 rounded-md object-cover ')}
          />
          <span
            className={cn(
              '!line-clamp-1 !text-ellipsis !hidden md:!inline w-full text-left text-base md:text-sm',
              !currentCollection?.name ||
                (currentCollection.name.length < 15 && 'pointer-events-none'),
              !sidebarOpen && 'md:!hidden',
            )}
          >
            {currentCollection?.name || 'Select Collection'}
          </span>
        </Link>
        {sidebarOpen && (
          <DropdownMenuTrigger asChild>
            <Button
              variant={'ghost'}
              className="hidden rounded-none border-border border-y border-r p-0 md:flex md:h-10 md:rounded-r-lg md:px-2"
            >
              <PiChevronSortVerticalStroke className="hidden h-4 w-4 md:block md:stroke-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
        )}
      </div>
      <DropdownMenuContent
        className="mt-2 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? 'top' : 'right'}
        align="end"
        sideOffset={4}
      >
        {collections.map((collection) => (
          <DropdownMenuItem key={collection.slug} asChild>
            <Link
              href={`/collections/${collection.slug}`}
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
