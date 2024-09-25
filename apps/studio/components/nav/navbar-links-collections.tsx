import Link from 'next/link'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@/lib/utils'
import type { Collection } from '@/types/database.types'
import Image from 'next/image'
import { SupabaseImage } from '@/lib/supabase/storage/supabaseImage'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip'

export const iconClassesStroke = 'h-4 w-4 md:h-5 md:w-5 my-auto'
export const iconClassesSolid = 'h-4 w-4 md:h-5 md:w-5 my-auto'

export function NavbarCollectionLinks({
  collections,
}: {
  collections?: Collection[]
}) {
  if (!collections || collections.length === 0) {
    return null
  }
  return (
    <ul className="hidden flex-col gap-2 md:flex">
      {collections.map((collection) => (
        <Link
          key={collection.slug}
          href={`/studio/${collection.slug}`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'flex justify-start gap-2 align-middle text-foreground text-sm md:text-muted-foreground md:text-sm',
          )}
        >
          <SupabaseImage
            src={
              collection?.image
                ? `collection-images/${collection.image}`
                : undefined
            }
            alt="Collection Image"
            width={80}
            height={80}
            className="size-6 shrink-0 rounded-full object-cover"
          />
          <Tooltip>
            <TooltipTrigger
              className={cn(
                '!line-clamp-1 !text-ellipsis w-full text-left',
                !collection?.name ||
                  (collection.name.length < 15 && 'pointer-events-none'),
              )}
            >
              {collection?.name || 'Select Collection'}
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              {collection?.name || collection.slug}
            </TooltipContent>
          </Tooltip>
        </Link>
      ))}
    </ul>
  )
}
