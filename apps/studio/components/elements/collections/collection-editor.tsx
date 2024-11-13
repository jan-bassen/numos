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
import EditableHeader, {
  EditableHeaderImage,
} from '../../layout/pages/editable-header'
import FormSegment from '../../forms/form-segment'
import { Input } from '@repo/ui/components/ui/input'
import { cn, handleReturnInfo } from '@repo/ui/lib/utils'
import {
  updateCollection,
  updateCollectionImage,
} from '@/lib/supabase/db/collections'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PiChevronBigLeftStroke } from '@repo/ui/icons/pika'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { collectionSchema } from './collection-schema'

// Not in use anymore
export default function CollectionEditor({
  collection,
}: {
  collection: ExtendedCollection
}) {
  const [locked, setLocked] = useState(true)
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8 lg:space-y-10"
      >
        <EditableHeader
          form={form}
          defaultValues={defaultValues}
          locked={locked}
          setLocked={setLocked}
          title={collection.name || 'Unnamed Attribute'}
          subtitle={collection.description || ''}
          icon={
            <EditableHeaderImage
              location={{
                bucket: 'collection-images',
                path: `${collection.id}/`,
                name: crypto.randomUUID(),
              }}
              initial={collection.image || undefined}
              updateFunction={updateImage}
              alt="Collection Image"
              size={48}
              locked={locked}
            />
          }
        >
          {locked && (
            <Link
              href={`/collections/${collection.slug}`}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-fit gap-1.5 pl-2.5',
              )}
            >
              <PiChevronBigLeftStroke className="size-4" />
              Back
            </Link>
          )}
        </EditableHeader>
        <div className="w-full space-y-8">
          <FormSegment
            title="Identifier"
            description="The unique identifier of this collection. Must be url-friendly and be unique across all collections."
          >
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={locked}
                      className="max-w-[30rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSegment>
          <FormSegment
            title="Metadata"
            description="Every NFT collection has a set of metadata that can be used to describe the collection. This metadata is used by marketplaces and other tools to display information about the collection."
          >
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={locked}
                      className="max-w-[30rem]"
                      placeholder="BAYC"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="external_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={locked}
                      className="max-w-[30rem]"
                      placeholder="https://example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSegment>
          <FormSegment
            title="Supply"
            description="The total amount of tokens in this collection. If this value is set to 0, there is no limit to the amount of tokens that can be minted."
          >
            <FormField
              control={form.control}
              name="max_supply"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={locked}
                      className="max-w-[30rem]"
                      placeholder="Unlimited"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSegment>
        </div>
      </form>
    </Form>
  )
}
