'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { Input } from '@repo/ui/components/ui/input'
import { Button } from '@repo/ui/components/ui/button'
import { toast } from 'sonner'
import { Card } from '@repo/ui/components/ui/card'
import Logo from '@repo/ui/components/brand/logo'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Suspense, useState } from 'react'
import { getURL } from '@/lib/supabase/client-utils'

const formSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email' })
    .email('Please enter a valid email address'),
})

type SchemaType = z.infer<typeof formSchema>

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit({ email }: SchemaType) {
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    const supabase = await createSupabaseClient()
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getURL()}/auth/reset-password`,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    setSubmitted(true)
  }

  if (submitted)
    return (
      <div className="grid h-screen w-full place-items-center">
        <p className="text-center text-lg">
          We&apos;ve sent you an email. Please check your inbox.
        </p>
      </div>
    )

  return (
    <div className="grid h-screen w-full place-items-center">
      <div className="w-full p-2 sm:w-[24rem] sm:p-0">
        <Card className="space-y-8 px-9 pt-6 pb-12 shadow-none sm:shadow-md">
          <div className="flex w-full items-center gap-4 py-2">
            <Logo className="size-10" />
            <h1 className="p-0 font-extrabold text-2xl">Forgot Password</h1>
          </div>
          <Form {...form}>
            <form
              id="loginForm"
              className="space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      Email:
                    </FormLabel>
                    <FormControl>
                      <Input type="email" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full pt-5">
                <Button type="submit" form="loginForm" className="h-9 w-full">
                  Confirm
                </Button>
              </div>
            </form>
          </Form>
        </Card>
        <Suspense>
          <div className="flex w-full justify-center gap-1.5 py-3 text-[0.8rem] text-muted-foreground">
            <p>Didn&apos;t forget your password?</p>
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </Suspense>
      </div>
    </div>
  )
}
