'use client'

import type { InsertAttribute } from '@/types/database.types'
import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { FormControl, FormItem, FormMessage } from '@repo/ui/components/ui/form'
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
import { Fingerprint, Info, List, Milestone, Tag } from 'lucide-react'
import {
  type StageDefinition,
  StagedForm,
} from '@/components/forms/staged-form'
import { newAttributeSchema } from '@/lib/schemas/attributes/attribute-schema'
import { insertAttribute } from '@/lib/supabase/db/attributes/create'
import { DatatypeSelectContent } from '@/components/datatypes/datatype-picker'
import type { NewItemDialogProps } from '@/types/props.types'
import {
  Select,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { Switch } from '@repo/ui/components/ui/switch'
import { slugify } from '@/lib/utils'

export function NewAttributeDialog({
  button,
  versionId,
  collectionSlug,
}: NewItemDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const schema = newAttributeSchema
  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      slug: ' ',
      list: false,
    },
  })

  function inferSlug(name: string) {
    if (form.getFieldState('slug').isDirty) return
    form.setValue('slug', slugify(name), {
      shouldValidate: true,
      shouldDirty: false,
    })
  }

  const typeStage: StageDefinition<SchemaType, 'type'> = {
    key: 'type',
    title: 'Select the type of attribute',
    description:
      'Attributes are the traits of your token. They can be different types of data like a number, text, a date, or something else.',
    icon: Milestone,
    field: ({ onChange, value, ...rest }) => (
      <FormItem className="min-h-18 w-full">
        <Select onValueChange={onChange} defaultValue={value} {...rest}>
          <SelectTrigger className={value && 'h-14'}>
            <SelectValue placeholder="Select a data type" />
          </SelectTrigger>
          <DatatypeSelectContent />
        </Select>
        <FormMessage />
      </FormItem>
    ),
  }

  const listStage: StageDefinition<SchemaType, 'list'> = {
    key: 'list',
    title: 'Select whether this is a list',
    description:
      'Usually, attributes are single values. If you want to store multiple values in it as a list, you can turn it on here.',
    icon: List,
    field: (field) => {
      const { onChange, value, ...rest } = field
      return (
        <FormItem className="min-h-18 w-full">
          <div className="flex items-center justify-center gap-3 pt-3">
            <p className="m-0 p-0 font-medium text-base">Single Value</p>
            <FormControl>
              <Switch
                checked={value}
                onCheckedChange={onChange}
                {...rest}
                className=""
              />
            </FormControl>
            <p className="m-0 p-0 font-medium text-base">List of Values</p>
          </div>
        </FormItem>
      )
    },
  }

  const nameStage: StageDefinition<SchemaType, 'name'> = {
    key: 'name',
    title: 'Name your new attribute',
    description:
      'The name will show up throughout the studio and wherever your attribute is displayed. You can change it later.',
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
  }

  const slugStage: StageDefinition<SchemaType, 'slug'> = {
    key: 'slug',
    title: 'Choose a unique identifier',
    description:
      'We will use this to identify your attribute, so it must be unique within this collection.',
    icon: Fingerprint,
    field: (field) => (
      <FormItem className="min-h-18 w-full">
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
  }

  const stages = [
    typeStage,
    listStage,
    nameStage,
    slugStage,
  ] as StageDefinition<SchemaType>[]

  async function onSubmit(values: SchemaType) {
    const newAttribute: InsertAttribute = {
      ...values,
      value: {
        type: values.type,
        list: values.list,
      },
      version: versionId,
      token_specific: true,
      display: 'public',
    }

    const res = await insertAttribute(newAttribute)
    handleReturnInfo(
      res,
      () => {
        setDialogOpen(false)
        router.push(`/collections/${collectionSlug}/attributes/${values.slug}`)
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
          <DialogTitle>Create a new attribute</DialogTitle>
          <DialogDescription>
            Create a new attribute by entering a few details about it.
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
