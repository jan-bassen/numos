'use client'

import { resetPassword } from '@/lib/supabase/auth'
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
import { useRouter } from 'next/navigation'
import { Card } from '@repo/ui/components/ui/card'
import Logo from '@repo/ui/components/brand/logo'
import Link from 'next/link'
import { handleReturnInfo } from '@/lib/utils'
import { toast } from 'sonner'
import { PiAlertTriangleStroke, PiCrossCross } from '@repo/ui/icons/pika'

const passwordSchema = z
  .object({
    password: z
      .string({ required_error: 'Please enter your password' })
      .min(6, 'Please enter a password with at least 6 characters'),
    confirm: z
      .string({ required_error: 'Please confirm your password' })
      .min(6, 'Please enter a password with at least 6 characters'),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })

type SchemaType = z.infer<typeof passwordSchema>

export default function ResetPasswordPage({
  searchParams,
}: { searchParams: { error_description: string; code: string } }) {
  const router = useRouter()
  const form = useForm<SchemaType>({
    resolver: zodResolver(passwordSchema),
  })

  async function onSubmit(data: SchemaType) {
    if (!searchParams.code) {
      toast.error('Something went wrong with the reset password link')
      return
    }
    const res = await resetPassword(data.password, searchParams.code)
    handleReturnInfo(res, () => {
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    })
  }

  return (
    <div className="grid h-screen w-full place-items-center ">
      <div className="w-full p-2 sm:w-[24rem] sm:p-0">
        <Card className="space-y-8 px-9 pt-6 pb-12 shadow-none sm:shadow-md">
          <div className="flex w-full items-center gap-3 py-2">
            <Logo className="size-10" />
            <h1 className="p-0 font-extrabold text-2xl">Reset Password</h1>
          </div>
          <Form {...form}>
            <form
              id="loginForm"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full space-y-3 pt-5">
                <Button type="submit" form="loginForm" className="h-9 w-full">
                  Reset Password
                </Button>
              </div>
            </form>
          </Form>
        </Card>
        {searchParams.error_description ? (
          <Card className="mt-3 flex items-center justify-between gap-4 border-none bg-warning/10 py-3 pr-4 pl-5 text-sm shadow-none sm:border sm:shadow-md">
            <div className="flex items-center gap-2">
              <PiAlertTriangleStroke className="size-6" />
              {searchParams.error_description}
            </div>
            <Button
              onClick={() => router.push('/auth/reset-password')}
              variant={'ghost'}
              size={'icon'}
              className="hover:!border hover:!bg-background size-8 shrink-0 bg-transparent"
            >
              <PiCrossCross className="size-4" />
            </Button>
          </Card>
        ) : (
          <div className="flex w-full justify-center gap-1.5 py-3 text-[0.8rem] text-muted-foreground">
            <p>No, I have not forgotten my password?</p>
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
