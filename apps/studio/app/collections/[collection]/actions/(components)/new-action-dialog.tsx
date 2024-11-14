'use client'

import type { InsertAction } from '@/types/database.types'
import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { toast } from 'sonner'
import { Input } from '@repo/ui/components/ui/input'
import { useRouter } from 'next/navigation'
import { Textarea } from '@repo/ui/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import { Fingerprint, Info, Tag, Zap } from 'lucide-react'
import {
  type StageDefinition,
  StagedForm,
} from '@/components/forms/staged-form'
import type { NewItemDialogProps } from '@/types/props.types'
import {
  getDefaultTriggerSettings,
  newActionSchema,
} from '../../../../../lib/schemas/action-schema'
import { insertAction } from '@/lib/supabase/db/actions'
import {
  SelectValue,
  Select,
  SelectTrigger,
} from '@repo/ui/components/ui/select'
import { TriggerSelectContent } from '../[action]/(components)/trigger-select-content'
import { slugify } from '@/lib/utils'

export function NewActionDialog({
  button,
  versionId,
  collectionSlug,
}: NewItemDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const schema = newActionSchema
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

  const stages: StageDefinition<SchemaType>[] = [
    {
      key: 'trigger',
      title: 'Select what triggers the action',
      description:
        'Actions can be triggered by a number of different events. Select the one that best fits your use case.',
      icon: Zap,
      field: (field) => (
        <FormItem className="min-h-18 w-full">
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={field.value && 'h-14'}>
                <SelectValue placeholder="Select Trigger" />
              </SelectTrigger>
            </FormControl>
            <TriggerSelectContent />
          </Select>
          <FormMessage />
        </FormItem>
      ),
    },
    {
      key: 'name',
      title: 'Name your new action',
      description:
        'The name will show up throughout the studio and wherever your action is displayed. You can change it later.',
      icon: Tag,
      field: (field) => (
        <FormItem className="min-h-18 w-full">
          <FormControl>
            <Input
              {...field}
              placeholder="Name"
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
        'We will use this to identify your action, so it must be unique within this collection.',
      icon: Fingerprint,
      field: (field) => (
        <FormItem className="min-h-18 w-full">
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      ),
    },
  ]

  async function onSubmit(values: SchemaType) {
    const trigger = getDefaultTriggerSettings(values.trigger)
    const newAction: InsertAction = {
      ...values,
      version: versionId,
      trigger,
    }

    const res = await insertAction(newAction)
    handleReturnInfo(
      res,
      () => {
        setDialogOpen(false)
        router.push(`/collections/${collectionSlug}/actions/${values.slug}`)
      },
      () => {},
    )
  }

  function onError(errors: any) {
    console.log(errors)
    toast.error('Error with inputs')
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="overflow-visible px-0">
        <DialogHeader className="hidden">
          <DialogTitle>Create a new action</DialogTitle>
          <DialogDescription>
            Create a new action by entering a few details about it.
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
