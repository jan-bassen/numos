'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@repo/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { Input } from '@repo/ui/components/ui/input'
import {
  PiAddAddStroke,
  PiAlertTriangleStroke,
  PiCopyDefaultStroke,
} from '@repo/ui/icons/pika'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const apiKeySchema = z.object({
  label: z.string().min(1, 'Please enter a label').max(50, 'Too long'),
})

export function CreateKeyButton() {
  const [res, setRes] = useState<string | null>(null)

  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    mode: 'onBlur',
    defaultValues: {
      label: '',
    },
  })

  async function onSubmit(data: z.infer<typeof apiKeySchema>) {
    setRes('zaCELgL.0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx')
  }

  function onError(error: unknown) {
    console.error(error)
  }

  return (
    <Dialog
      onOpenChange={(v) => {
        if (!v) setRes(null)
      }}
    >
      <DialogTrigger asChild>
        <Button variant={'outline'} className="gap-1.5 md:max-w-form-input">
          <PiAddAddStroke className="size-4" />
          Create API-Key
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-48 transition-transform">
        <DialogHeader>
          <DialogTitle>{res ? 'Your new API-Key' : 'New API-Key'}</DialogTitle>
        </DialogHeader>
        {res ? (
          <div className="flex w-full flex-col gap-2">
            <div className="flex h-fit w-full gap-2">
              <div className="flex h-10 w-full items-center rounded-lg border border-border bg-muted/20 px-3 text-sm">
                {res}
              </div>
              <Button
                variant={'outline'}
                size={'icon'}
                className="shrink-0"
                onClick={async () => {
                  await navigator.clipboard.writeText(res)
                  toast.success('Copied to clipboard')
                }}
              >
                <PiCopyDefaultStroke className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1.5 px-2 text-sm text-warning ">
              <PiAlertTriangleStroke className="size-3.5" /> This key will only
              be shown once. Please save it now.
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button>Create key</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
