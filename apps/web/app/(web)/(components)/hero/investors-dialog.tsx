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
} from '@repo/ui/components/ui/responsive-dialog'
import { PiAtMarkStroke, PiXComStroke } from '@repo/ui/icons/pika'
import type { ReactNode } from 'react'

export function InvestorsDialog({
  children,
  dictionary,
}: { children: ReactNode; dictionary: Dictionary['home']['investors'] }) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
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
