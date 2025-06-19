'use client'

import { signInWithPassword, signup } from '@/lib/supabase/auth/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { Button } from '@repo/ui/components/button'
import { useRouter } from 'next/navigation'
import { Card } from '@repo/ui/components/card'
import Link from 'next/link'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { signupSchema } from '@/lib/schemas/sign-up-schema'
import { Badge } from '@repo/ui/components/badge'
import { useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/clients/client'
import LogoIcon from '../../../../packages/ui/src/blocks/brand/logo-icon'
import Logo from '../../../../packages/ui/src/blocks/brand/logo'

export default function SigninPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  })

  useEffect(() => {
    const checkForUser = async () => {
      const supabase = await createSupabaseClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.log(error)
        return
      }
      if (data.user) {
        router.push('/')
      }
    }

    checkForUser()
  }, [router])

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    const res = await signup(data)
    handleReturnInfo(res, () => {
      setTimeout(() => {
        router.push('/login?validating=true')
      }, 1000)
    })
  }

  return (
    <div className="grid h-screen w-full place-items-center ">
      <div className="flex w-full flex-col items-center p-2 sm:p-0">
        <Card className="max-w-[24rem] space-y-8 px-9 pt-6 pb-12 shadow-none sm:shadow-md">
          <div className="flex w-full items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <h1 className="p-0 font-extrabold text-2xl">Sign Up</h1>
              <Badge variant="secondary" className="mt-1">
                Beta
              </Badge>
            </div>
            <Logo className="h-8" size={32} />
          </div>
          <Form {...form}>
            <form
              id="loginForm"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/*               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full space-y-3 pt-5">
                <p className="text-center text-xs text-muted-foreground">
                  By signing up the Numos Studio Beta you agree to the usage of
                  cookies for product improvements.
                </p>
                <Button type="submit" form="loginForm" className="h-9 w-full">
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </Card>
        <div className="flex w-full justify-center gap-1.5 py-3 text-[0.8rem] text-muted-foreground">
          <p>Already have an account?</p>
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
