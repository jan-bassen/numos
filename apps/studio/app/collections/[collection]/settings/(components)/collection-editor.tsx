'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import type {
  ExtendedCollection,
  UpdateCollection,
} from '@/types/database.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import Segment from '@/components/layouts/segmented/segment'
import { Input } from '@repo/ui/components/ui/input'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import {
  updateCollection,
  updateCollectionImage,
} from '@/lib/supabase/db/collections'
import { useRouter } from 'next/navigation'
import { collectionSchema } from '@/lib/schemas/collection-schema'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import { EditableImage } from '@/components/supabase/editable-image'
import Main from '@/components/page/main'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import ApiKeys from '@/app/collections/[collection]/(components)/api-keys'
import { Page } from '@/components/page/page'

export default function CollectionEditor({
  collection,
}: {
  collection: ExtendedCollection
}) {
  const [locked, setLocked] = useState(collection.settings_locked)
  const router = useRouter()

  const schema = collectionSchema(collection.slug)

  const defaultValues = {
    name: collection.name || undefined,
    slug: collection.slug || undefined,
    description: collection.description || undefined,
    external_link: collection.external_link || undefined,
    max_supply: collection.max_supply || undefined,
    symbol: collection.symbol || undefined,
  }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    mode: 'onBlur',
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    const updatedCollection: UpdateCollection = {
      ...values,
      id: collection.id,
    }
    const res = await updateCollection(updatedCollection)
    handleReturnInfo(res, () => {
      setLocked(true)
      if (values.slug !== collection.slug) {
        router.push(`/collections/${values.slug}/settings`)
      }

      form.reset(defaultValues)
    })
  }

  async function onError(...errors: any) {
    console.log(errors)
    throw new Error('Form validation error.')
  }

  async function updateImage(fullPath: string) {
    const res = await updateCollectionImage(collection.id, fullPath)
    return res
  }

  return (
    <Page>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>{collection.name || 'Unnamed Attribute'}</HeaderTitle>
          </HeaderMain>
          <HeaderActions />
        </HeaderContent>
      </Header>
      <Main>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8 lg:space-y-10"
          >
            <SegmentedLayout>
              <Segment
                title="Collection Image"
                info={{
                  description:
                    'The image that will be displayed in the collections list.',
                }}
              >
                <EditableImage
                  location={{
                    bucket: 'collection-images',
                    path: `${collection.id}/`,
                    name: crypto.randomUUID(),
                  }}
                  initial={collection.image || undefined}
                  updateFunction={updateImage}
                  alt="Collection Image"
                  className="size-20"
                  locked={locked}
                  width={80}
                  height={80}
                />
              </Segment>
              <Segment
                title="Identifier"
                info={{
                  description:
                    'The unique identifier of this collection. Must be url-friendly and be unique across all collections.',
                }}
              >
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={locked}
                          className="max-w-form-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Segment>
              <Segment
                title="API-Keys"
                info={{
                  description:
                    'Manage the API-Keys for the collection. These keys can be used to access the collection via the API.',
                }}
              >
                <ApiKeys />
              </Segment>
            </SegmentedLayout>
          </form>
        </Form>
      </Main>
    </Page>
  )
}
