import type { Dictionary } from '@/dictionaries/dictionaries'
import  Link  from 'next/link'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@repo/ui/blocks/dialogs/responsive-dialog'
import { PiAtMarkStroke, PiXComStroke } from '@repo/ui/icons/pika'
import type { ReactNode } from 'react'
import { Button } from '@repo/ui/components/button'

export function InvestorsDialog({
  children,
  dictionary,
}: { children?: ReactNode; dictionary: Dictionary['home']['investors'] }) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button
          variant={'outline'}
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
          <Link href="mailto:invest@numos.xyz">
            <Button variant={'outline'} className="gap-2">
              <PiAtMarkStroke className="size-4" /> {dictionary.contact.email}
            </Button>
          </Link>
          <Link
            href="https://x.com/numos_xyz"
            target="_blank"
          >
            <Button variant={'outline'} className="gap-2">
              <PiXComStroke className="size-4" /> {dictionary.contact.x}
            </Button>
          </Link>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
