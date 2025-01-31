'use client'

import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { PiCheckTickCircleBrokenStroke } from '@repo/ui/icons/pika'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { signUp } from '@/lib/hubspot/sign-up'
import type { Dictionary } from '@/dictionaries/dictionaries'

const formSchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.string().email(),
  message: z.string().optional(),
  twitter: z.string().optional(),
})

async function onSubmit(values: z.infer<typeof formSchema>) {
  const res = await signUp(values)
  handleReturnInfo(res)
}

export default function SignUpForm({
  dictionary,
}: {
  dictionary: Dictionary['home']['beta']
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5 lg:flex-row">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{dictionary.fields.firstName}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{dictionary.fields.lastName}</FormLabel>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.fields.email}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.fields.x}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.fields.message}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4 h-9" type="submit">
          {dictionary.ctaButton}
        </Button>
      </form>
    </Form>
  )
}
