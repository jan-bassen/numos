'use client'

import type { UnorderedInsertLayer } from '@/types/database.types'
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
  type StaticStageDefinition,
  StagedForm,
} from '@/components/forms/staged-form'
import { newLayerSchema } from '@/lib/schemas/layers/layer-schema'
import { defaultLayerSettings } from '@/lib/defaults/actions/layer-definitions'
import { insertLayerAtTop } from '@/lib/supabase/db/layers/create'
import { nameStage } from '@/app/collections/[collection]/image/(components)/new-layer/stages/name'
import { slugStage } from '@/app/collections/[collection]/image/(components)/new-layer/stages/slug'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import type { NewElementDialogProps } from '@/components/elements/new-dialog'

export type NewLayerSchema = z.infer<typeof newLayerSchema>
export type NewLayerStage = StaticStageDefinition<NewLayerSchema>

export function NewLayerDialog({ children, versionId }: NewElementDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()
  const {
    collection: { slug: collectionSlug },
  } = useCollection()

  const schema = newLayerSchema
  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      slug: '',
    },
  })

  /* const _layerTypeStage = layerTypeStage(form) as NewLayerStage */
  const _nameStage = nameStage(form) as NewLayerStage
  const _slugStage = slugStage(form) as NewLayerStage

  const stages: StaticStageDefinition<SchemaType>[] = [
    /* _layerTypeStage, */
    _nameStage,
    _slugStage,
  ]

  async function onSubmit(values: SchemaType) {
    const definition = values.definition?.type
      ? defaultLayerSettings[values.definition?.type]
      : undefined

    const newLayer: UnorderedInsertLayer = {
      ...values,
      definition: {
        type: 'custom',
        ...definition,
      },
      version: versionId,
    }

    const res = await insertLayerAtTop(newLayer)
    handleReturnInfo(
      res,
      () => {
        setDialogOpen(false)
        router.push(`/collections/${collectionSlug}/image/${values.slug}`)
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
          <DialogTitle>Create a new layer</DialogTitle>
          <DialogDescription>
            Create a new layer by entering a few details about it.
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
