'use client'

import { useProfile } from '@/app/(providers)/profile-context'
import { useUser } from '@/app/(providers)/user-context'
import { Input } from '@repo/ui/components/ui/input'
import type { InputProps } from '@repo/ui/components/ui/input'
import { cn } from '@repo/ui/lib/utils'

export function ProfileNameInput(
  props: Omit<InputProps, 'value' | 'onChange'>,
) {
  const {
    profile: { full_name },
    updateProfile,
  } = useProfile()
  const {
    user: { user_metadata },
  } = useUser()
  return (
    <Input
      {...props}
      /* className="disabled:opacity-100 disabled:resize-none disabled:border-background disabled:cursor-auto" */
      className={cn('w-full', props.className)}
      value={full_name || ''}
      placeholder={user_metadata.name || ''}
      onChange={async (event) => {
        await updateProfile(
          { full_name: event.target.value },
          { debounce: true },
        )
      }}
    />
  )
}
