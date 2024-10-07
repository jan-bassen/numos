'use client'

import FormSegment from '@/components/forms/form-segment'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { Input } from '@repo/ui/components/ui/input'
import type { Profile, UpdateProfile } from '@/types/database.types'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Identities from './providers'
import { updateProfile, updateProfileImage } from '@/lib/supabase/db/profile'
import EditableHeader, {
  EditableHeaderImage,
} from '../layout/pages/editable-header'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { toast } from 'sonner'
import { Dialog } from '@repo/ui/components/ui/dialog'
import PasswordDialogContent from './password-dialog'
import { Button } from '@repo/ui/components/ui/button'

const schema = z.object({
  name: z.string().optional(),
  username: z.string().min(3).max(30).optional(),
})

export default function UserProfileEditor({
  user,
  profile,
}: {
  user: User
  profile: Profile
}) {
  const [locked, setLocked] = useState(true)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  const defaultValues = {
    name: profile.full_name || user.user_metadata.name || undefined,
    username: profile.username || undefined,
  }
  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    mode: 'onBlur',
  })

  const onSubmit = async (data: SchemaType) => {
    const newProfile: UpdateProfile = {
      id: user.id,
      full_name: data.name || null,
      username: data.username || null,
      updated_at: null,
    }
    const res = await updateProfile(user.id, newProfile)
    handleReturnInfo(
      res,
      () => {
        setLocked(true)
      },
      () => {},
    )
  }

  const onError = (error: unknown) => {
    if (error instanceof Error) {
      toast.error(`Error with inputs: ${error.message}`)
      return
    }
    console.error(error)
  }

  async function updateImage(fullPath: string) {
    const res = await updateProfileImage(user.id, fullPath)
    return res
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="w-full space-y-8"
        >
          <EditableHeader
            form={form}
            defaultValues={defaultValues}
            locked={locked}
            setLocked={setLocked}
            title={
              profile?.full_name || profile?.username || user.user_metadata.name
            }
            titlePlaceholder="Your Name"
            icon={
              <EditableHeaderImage
                location={{ bucket: 'avatars', name: crypto.randomUUID() }}
                initial={profile?.avatar_url || undefined}
                updateFunction={updateImage}
                alt="User Avatar"
                size={48}
                locked={locked}
              />
            }
            showBreadcrumbs={false}
          />
          <FormSegment title="Username">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={locked}
                      className="w-max-[40rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSegment>
          <FormSegment
            title="Connections"
            description="Manage the different ways you can log into your account with"
          >
            {user.identities && (
              <Identities
                identities={user.identities}
                setPasswordDialogOpen={setPasswordDialogOpen}
              />
            )}
          </FormSegment>
          <FormSegment
            title="Password"
            description="Change your password"
            className="sm:hidden"
          >
            <Button
              type="button"
              variant={'outline'}
              onClick={() => setPasswordDialogOpen(true)}
            >
              Change Password
            </Button>
          </FormSegment>
        </form>
      </Form>
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <PasswordDialogContent setDialogOpen={setPasswordDialogOpen} />
      </Dialog>
    </>
  )
}
