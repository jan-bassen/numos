'use client'

import { Card } from '@repo/ui/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@repo/ui/components/ui/input-otp'
import { createSupabaseClient } from '@/lib/supabase/clients/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import Link from 'next/link'
import { cn } from '@repo/ui/lib/utils'

const tokenSchema = z.object({
  email: z.string().email(),
  token: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
})

export default function OtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const form = useForm<z.infer<typeof tokenSchema>>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      email: email || undefined,
      token: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof tokenSchema>) => {
    if (!email) {
      toast.error('No email provided')
      return
    }
    const supabase = await createSupabaseClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: data.token,
      type: 'email',
    })
    if (error) {
      toast.error('Invalid token')
      return
    }
    router.push('/')
  }
  const emailProvided = email && z.string().email().safeParse(email).success
  return (
    <div className="grid h-screen w-full place-items-center ">
      <div className="w-full p-2 sm:w-[23rem] sm:p-0">
        <Card className="space-y-8 px-9 pt-6 pb-12 shadow-none sm:border sm:shadow-md">
          <div className="flex w-full flex-col gap-2 py-2">
            <h1 className="p-0 font-extrabold text-2xl">Enter your Code</h1>
            <p className="text-sm">Please check your email</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn(
                'flex w-full flex-col gap-5',
                emailProvided && 'items-center',
              )}
            >
              {!emailProvided && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-1">
                      <FormLabel className="text-muted-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          className="h-9 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    {!emailProvided && (
                      <FormLabel className="text-muted-foreground">
                        Code
                      </FormLabel>
                    )}
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="!size-12 font-bold text-lg"
                          />
                          <InputOTPSlot
                            index={1}
                            className="!size-12 font-bold text-lg"
                          />
                          <InputOTPSlot
                            index={2}
                            className="!size-12 font-bold text-lg"
                          />
                          <InputOTPSlot
                            index={3}
                            className="!size-12 font-bold text-lg"
                          />
                          <InputOTPSlot
                            index={4}
                            className="!size-12 font-bold text-lg"
                          />
                          <InputOTPSlot
                            index={5}
                            className="!size-12 font-bold text-lg"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-center pt-8">
                <Button
                  type="submit"
                  className={cn('h-9 w-full', !emailProvided && 'w-full')}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </Card>
        <div className="flex w-full justify-center gap-1.5 py-3 text-[0.8rem] text-muted-foreground">
          <Link href="/login" className="hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
