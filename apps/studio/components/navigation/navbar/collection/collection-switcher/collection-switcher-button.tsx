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
  DropdownMenuLabel,
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
  const { open: sidebarOpen, openMobile, isMobile } = useSidebar()
  const open = sidebarOpen || openMobile
  return (
    <DropdownMenu modal={true}>
      <div className={cn('flex w-full grow-0', open && 'px-1', className)}>
        <Link
          href={`/collections/${currentCollection?.slug}`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'flex h-10 gap-2 p-0',
            open
              ? 'w-[calc(100%-2rem)] grow-0 justify-start rounded-none rounded-l-lg border border-border px-1.5'
              : 'h-8 w-full justify-center rounded-lg',
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
              '!line-clamp-1 !text-ellipsis !inline w-full text-left text-sm',
              !currentCollection?.name ||
                (currentCollection.name.length < 15 && 'pointer-events-none'),
              !open && '!hidden',
            )}
          >
            {currentCollection?.name || 'Select Collection'}
          </span>
        </Link>
        {open && (
          <DropdownMenuTrigger asChild>
            <Button
              variant={'ghost'}
              className="flex h-10 rounded-none rounded-r-lg border-border border-y border-r p-0 px-2"
            >
              <PiChevronSortVerticalStroke className="block h-4 w-4 md:stroke-muted-foreground" />
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
              <DropdownMenuLabel className="line-clamp-1 inline self-center text-ellipsis text-left">
                {collection.name ? collection.name : 'Unnamed'}
              </DropdownMenuLabel>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
