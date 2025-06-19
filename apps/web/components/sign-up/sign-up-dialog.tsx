import { Button } from '@repo/ui/components/button'

import type { Dictionary } from '@/dictionaries/dictionaries'
import {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
} from '@repo/ui/components/responsive-dialog'
import SignUpForm from '@/components/sign-up/sign-up-form'
import { PiArrowRightStroke } from '@repo/ui/icons/pika'

export function SignUpDialog({
  children,
  dictionary,
}: {
  children?: React.ReactNode
  dictionary: Dictionary['home']
}) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {dictionary.beta.modalTitle}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {dictionary.beta.modalDescription}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <SignUpForm dictionary={dictionary.beta} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
