'use client'

import { Button } from '@repo/ui/components/ui/button'
import {
  ExtendedCollection,
  type InsertCollection,
  NewVersion,
} from '@/types/database.types'
import { ResponsiveDialog } from '@repo/ui/components/ui/responsive-dialog'
import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useEffect, useState } from 'react'
import { cn, handleReturnInfo } from '@repo/ui/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { toast } from 'sonner'
import { Input } from '@repo/ui/components/ui/input'
import { useRouter } from 'next/navigation'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { insertCollection } from '@/lib/supabase/db/collections'
import type { User } from '@supabase/supabase-js'
import { collectionSchema } from './collection-schema'

export function FirstCollection({ user }: { user: User }) {
  const router = useRouter()

  const schema = collectionSchema(undefined)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!user) {
      throw new Error('User not found')
    }

    const newCollection: InsertCollection = {
      name: values.name,
      slug: values.slug,
      max_supply: values.max_supply,
    }

    const res = await insertCollection(newCollection)
    handleReturnInfo(
      res,
      () => {
        router.push(`/collections/${values.slug}`)
      },
      () => {},
    )
  }

  function onError(errors: any) {
    console.log(errors)
    toast.error('Error with inputs')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        id="basicAttributeForm"
        className="space-y-6"
      >
        <div className="flex w-full flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Identifier</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_supply"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Supply (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full grow">
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-32" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-end pt-6 md:pt-4">
          <Button
            type="submit"
            form="basicAttributeForm"
            className={cn(
              'w-full md:w-fit',
              !form.formState.isValid && 'bg-muted',
            )}
            aria-disabled={!form.formState.isValid}
          >
            Create
          </Button>
        </div>
      </form>
    </Form>
  )
}
