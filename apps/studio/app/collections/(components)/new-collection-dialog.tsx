'use client'

import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactNode, useState } from 'react'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { toast } from 'sonner'
import { Input } from '@repo/ui/components/ui/input'
import { useRouter } from 'next/navigation'
import { insertCollection } from '@/lib/supabase/db/collections'
import { collectionSchema } from '@/lib/schemas/collection-schema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import { Fingerprint, Tag } from 'lucide-react'
import {
  type StaticStageDefinition,
  StagedForm,
} from '@/components/forms/staged-form'
import { FormControl, FormItem, FormMessage } from '@repo/ui/components/ui/form'
import { slugify } from '@/lib/utils'

export function NewCollectionDialog({ children }: { children: ReactNode }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const schema = collectionSchema(undefined)
  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      slug: ' ',
    },
  })

  function inferSlug(name: string) {
    if (form.getFieldState('slug').isDirty) return
    form.setValue('slug', slugify(name), {
      shouldValidate: true,
      shouldDirty: false,
    })
  }

  const stages: StaticStageDefinition<SchemaType>[] = [
    {
      key: 'name',
      title: 'Name your new collection',
      description:
        'The name will show up throughout the studio and wherever your collection is displayed. You can change it later.',
      icon: Tag,
      field: (field) => (
        <FormItem className="min-h-[80px] w-full">
          <FormControl>
            <Input
              placeholder="Name"
              {...field}
              onChange={(e) => {
                inferSlug(e.target.value)
                field.onChange(e)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      ),
    },
    {
      key: 'slug',
      title: 'Choose a unique identifier',
      description:
        'We will use this to identify your collection, so it must be unique across the platform.',
      icon: Fingerprint,
      field: (field) => (
        <FormItem className="min-h-[80px] w-full">
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      ),
    },
  ]

  async function onSubmit(values: SchemaType) {
    const res = await insertCollection(values)
    handleReturnInfo(
      res,
      () => {
        setDialogOpen(false)
        router.push(`/collections/${values.slug}`)
      },
      () => {},
    )
  }

  function onError(errors: unknown) {
    if (errors instanceof Error) {
      toast.error(
        `Error with inputs, please check beforehand: ${errors.message}`,
      )
      return
    }
    toast.error('Error with inputs, please check beforehand')
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-visible px-0">
        <DialogHeader className="hidden">
          <DialogTitle>Create a new collection</DialogTitle>
          <DialogDescription>
            Create a new collection by entering a few details about it.
          </DialogDescription>
        </DialogHeader>
        <StagedForm<SchemaType>
          form={form}
          stages={stages}
          onSubmit={onSubmit}
          onError={onError}
        />
      </DialogContent>
    </Dialog>
  )
}
