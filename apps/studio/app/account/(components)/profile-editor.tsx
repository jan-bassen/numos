'use client'

import Segment from '@/components/layouts/segmented/segment'
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
import Identities from './identity-providers'
import { updateProfile, updateProfileImage } from '@/lib/supabase/db/profile'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { toast } from 'sonner'
import { Dialog } from '@repo/ui/components/ui/dialog'
import PasswordDialogContent from './password-dialog'
import Header from '../../../components/page/header'
import Main from '../../../components/page/main'
import SegmentedLayout from '../../../components/layouts/segmented/segmented-layout'
import { EditableImage } from '../../../components/supabase/editable-image'
import SaveButton from '../../../components/forms/buttons/save-button'
import { useRouter } from 'next/navigation'

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
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const router = useRouter()

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
    handleReturnInfo(res, () => {
      form.reset({ name: data.name, username: data.username })
    })
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
      <Header title="Account" subtitle="Everything regarding your account">
        {form.formState.isDirty && (
          <SaveButton type="submit" form="account-form" />
        )}
      </Header>
      <Main>
        <Form {...form}>
          <form
            id="account-form"
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="w-full space-y-8"
          >
            <SegmentedLayout>
              <Segment title="Profile Image">
                <EditableImage
                  location={{ bucket: 'avatars', name: crypto.randomUUID() }}
                  initial={profile?.avatar_url || undefined}
                  updateFunction={updateImage}
                  className="size-20"
                  alt="Profile Image"
                  width={80}
                  height={80}
                />
              </Segment>
              <Segment title="Full Name">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className=" max-w-form-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Segment>
              <Segment title="Username">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className=" max-w-form-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Segment>
              <Segment
                title="Connections"
                description="Manage the different ways you can log into your account with"
              >
                {user.identities && (
                  <Identities
                    className="w-full max-w-form-input"
                    identities={user.identities}
                    setPasswordDialogOpen={setPasswordDialogOpen}
                  />
                )}
              </Segment>
            </SegmentedLayout>
          </form>
        </Form>
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <PasswordDialogContent setDialogOpen={setPasswordDialogOpen} />
        </Dialog>
      </Main>
    </>
  )
}
