import type { NewItemDialogProps } from '@/types/props.types'
import { Separator } from '@repo/ui/components/ui/separator'
import { Button } from '@repo/ui/components/ui/button'
import { PiAddAddStroke } from '@repo/ui/icons/pika'
import Link from 'next/link'

export default function NavbarHeader({
  title,
  href,
  NewItemDialog,
}: {
  title: string
  href: string
  NewItemDialog: (props: NewItemDialogProps) => JSX.Element
}) {
  return (
    <div className="hidden w-full space-y-5 px-4 pt-6 md:block">
      <div className="flex items-center justify-between">
        <Link
          href={href}
          className="flex items-center justify-start pl-2 text-xl font-medium hover:underline"
        >
          {title}
        </Link>
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
          versionId={'1'}
          collectionSlug={'test'}
        />
      </div>
      <Separator />
    </div>
  )
}
