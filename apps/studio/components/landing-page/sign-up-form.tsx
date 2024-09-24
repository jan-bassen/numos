'use client'

import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { PiCheckTickCircleBrokenStroke } from '@/lib/icons'
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
import { handleReturnInfo } from '@/lib/utils'
import { signUp } from '@/lib/hubspot/sign-up'

const formSchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.string().email(),
  message: z.string().optional(),
})

async function onSubmit(values: z.infer<typeof formSchema>) {
  const res = await signUp(values)
  handleReturnInfo(res)
}

export default function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  })

  return (
    <div className="flex flex-col gap-12 rounded-lg border border-border p-6 px-6 shadow-sm md:grid md:grid-cols-2 md:grid-rows-1 md:p-12 lg:gap-6">
      <div className="flex flex-col justify-start gap-6 md:justify-between">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-mona text-4xl font-black">
              Join our beta program
            </h2>
          </div>
          <ul className="flex flex-col gap-2 pl-1">
            <li
              key="first"
              className="flex gap-2 text-balance lg:items-center lg:gap-2"
            >
              <PiCheckTickCircleBrokenStroke className="mt-1 size-4 lg:mt-0" />
              Be the first to try our studio
            </li>
            <li
              key="personalized"
              className="flex gap-2 text-balance lg:items-center lg:gap-2"
            >
              <PiCheckTickCircleBrokenStroke className="mt-1 size-4 lg:mt-0" />
              Personalized support
            </li>
            <li
              key="rewards"
              className="flex gap-2 text-balance lg:items-center lg:gap-2"
            >
              <PiCheckTickCircleBrokenStroke className="mt-1 size-4 lg:mt-0" />
              Exlusive rewards
            </li>
          </ul>
        </div>
        <p className="hidden pl-2 text-xs text-muted-foreground md:block">
          Your inbox deserves to stay clean. <br /> We only send you the good
          stuff.
        </p>
      </div>
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
                <FormItem>
                  <FormLabel>First Name</FormLabel>
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
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
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
                <FormLabel>Email*</FormLabel>
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
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4 h-9" type="submit">
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  )
}
