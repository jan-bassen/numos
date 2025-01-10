'use client'

import type { InsertAction } from '@/types/database.types'
import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import {
  StagedForm,
  type StaticStageDefinition,
} from '@/components/forms/staged-form'
import type { NewElementDialogProps } from '@/components/elements/new-dialog'
import { newActionSchema } from '@/lib/schemas/actions/action-schema'
import { insertAction } from '@/lib/supabase/db/actions'
import { triggerStage } from '@/app/collections/[collection]/actions/(components)/new-action/stages/trigger'
import { nameStage } from '@/app/collections/[collection]/actions/(components)/new-action/stages/name'
import { slugStage } from '@/app/collections/[collection]/actions/(components)/new-action/stages/slug'
import { useCollection } from '@/app/collections/[collection]/collection-context'

export type NewActionSchema = z.infer<typeof newActionSchema>
export type NewActionStage = StaticStageDefinition<NewActionSchema>

export function NewActionDialog({
  children,
  versionId,
}: NewElementDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()
  const {
    collection: { slug: collectionSlug },
  } = useCollection()

  const schema = newActionSchema
  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      slug: '',
    },
  })

  const _triggerStage = triggerStage(form) as NewActionStage
  const _nameStage = nameStage(form) as NewActionStage
  const _slugStage = slugStage(form) as NewActionStage

  const stages: NewActionStage[] = [_triggerStage, _nameStage, _slugStage]

  async function onSubmit(values: SchemaType) {
    const newAction: InsertAction = {
      ...values,
      version: versionId,
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
      <DialogTrigger asChild>{children}</DialogTrigger>
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
