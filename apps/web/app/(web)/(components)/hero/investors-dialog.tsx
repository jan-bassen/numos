import type { Dictionary } from '@/dictionaries/dictionaries'
import { Link } from '@repo/ui/components/ui/link'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@repo/ui/components/extended/responsive-dialog'
import { PiAtMarkStroke, PiXComStroke } from '@repo/ui/icons/pika'
import type { ReactNode } from 'react'
import { Button } from '@repo/ui/components/ui/button'

export function InvestorsDialog({
  children,
  dictionary,
}: { children?: ReactNode; dictionary: Dictionary['home']['investors'] }) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button
          variant={'destructive'}
          className="h-7 rounded-full border border-border text-xs"
        >
          {dictionary.ctaButton}
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{dictionary.title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {dictionary.description}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div />
        <ResponsiveDialogFooter>
          <Link
            href="mailto:invest@numos.xyz"
            asButton={{ variant: 'outline' }}
            className="gap-2"
          >
            <PiAtMarkStroke className="size-4" /> {dictionary.contact.email}
          </Link>
          <Link
            href="https://x.com/numos_xyz"
            target="_blank"
            asButton={{ variant: 'outline' }}
            className="gap-2"
          >
            <PiXComStroke className="size-4" /> {dictionary.contact.x}
          </Link>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
