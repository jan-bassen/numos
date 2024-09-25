import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { NavItem } from '@/types/database.types'
import NavbarHeader from './navbar-header'
import type { NewItemDialogProps } from '@/types/props.types'
import { PiAddAddStroke } from '@repo/ui/icons/pika'
import { Separator } from '@repo/ui/components/ui/separator'

export const seondaryNavbarIconClasses = 'h-4 w-4 my-auto hidden md:block'

export default function SecondaryNavbar({
  versionId,
  collectionSlug,
  type,
  title,
  items,
  NewItemDialog,
  current,
  className,
}: {
  versionId: string
  collectionSlug: string
  type: string
  title: string
  items: NavItem[]
  NewItemDialog?: (props: NewItemDialogProps) => JSX.Element
  current?: string
  className?: string
}) {
  return (
    <>
      <div
        className={cn(
          'z-40 h-11 w-full shrink-0 overflow-x-hidden overflow-y-scroll md:h-[100svh] md:w-56',
          className,
        )}
      />
      <nav
        className={cn(
          'fixed z-40 h-11 w-full shrink-0 flex-row justify-between border-border -md:border-b bg-background md:h-[100svh] md:w-56 md:flex-col md:border-r',
          className,
        )}
      >
        <div className="hidden w-full space-y-5 px-4 pt-6 md:block">
          <div className="flex items-center justify-between">
            <Link
              href={`/studio/${collectionSlug}/${type}`}
              className="flex items-center justify-start pl-2 font-medium text-xl hover:underline"
            >
              {title}
            </Link>
            {NewItemDialog && (
              <NewItemDialog
                button={
                  <Button
                    variant={'muted'}
                    size={'icon'}
                    className="size-7 p-1.5 hover:text-foreground"
                  >
                    <PiAddAddStroke className="size-5" />
                  </Button>
                }
                versionId={versionId}
                collectionSlug={collectionSlug}
              />
            )}
          </div>
          <Separator />
        </div>
        <ul className="flex flex-row gap-1 px-2 py-1.5 md:flex-col md:p-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/studio/${collectionSlug}/${type}/${item.slug}`}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'flex h-8 justify-start gap-3 px-2 align-middle text-foreground md:h-9 md:px-4 md:text-muted-foreground',
                item.slug === current && '!text-foreground bg-muted',
              )}
            >
              <span className="hidden md:block">{item.icon}</span>
              <p className="line-clamp-1 text-ellipsis text-sm">{item.name}</p>
            </Link>
          ))}
        </ul>
      </nav>
    </>
  )
}
