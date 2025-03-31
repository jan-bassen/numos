'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Err } from '@repo/shared/result/err'
import { passwordSchema } from '@repo/shared/schemas/auth/password'
import { Button } from '@repo/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { use } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { resetPassword } from '@/client/auth'
const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<
    { token: string; error: undefined } | { error: string; token: undefined }
  >
}) {
  const router = useRouter()
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { token, error } = use(searchParams)
  if (error /* || !token */) {
    throw new Err('Could not start password reset', 'unknown', {
      internalMessage: `Could not start password reset: ${error}`,
    })
  }

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    const result = await resetPassword({
      newPassword: data.password,
      token,
    })
    if (result.error) {
      throw new Err('Could not reset password', 'unknown', {
        internalMessage: `Could not reset password: ${result.error}`,
      })
    }
    router.push('/auth/login')
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="bg-card sm:min-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-bold font-heading text-xl">
            Change your password
          </CardTitle>
          <CardDescription>
            Please enter your new password below
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter>
                <Button type="submit">Reset Password</Button>
              </CardFooter>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  )
}
