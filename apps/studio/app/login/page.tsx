'use client'

import { signInWithPassword } from '@/lib/supabase/auth'
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
import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Card } from '@repo/ui/components/ui/card'
import Logo from '@repo/ui/components/brand/logo'
import { PiAlertTriangleStroke, PiCrossCross } from '@repo/ui/icons/pika'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getURL } from '@/lib/supabase/client-utils'
import { cn } from '@repo/ui/lib/utils'
import { Suspense, use } from 'react'
import posthog from 'posthog-js'

const formSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email' })
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Please enter your password' })
    .min(6, 'Please enter a password with at least 6 characters'),
})

export default function LoginPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = use(props.searchParams)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const validating = searchParams.validating === 'true'

  /*   async function signInWithTwitter() {
    const supabase = await createSupabaseClient();
    await supabase.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: `${getURL()}auth/callback/`,
      },
    });
  } */

  /*   async function signInWithGithub() {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${getURL()}auth/callback/`,
      },
    });
    console.log(data, error);
    if (error) {
      toast.error(error.message);
    }
    router.push("/");
  } */

  async function onSubmit(login: z.infer<typeof formSchema>) {
    const { data, error } = await signInWithPassword(login)
    if (error) {
      toast.error(error.message)
      return
    }
    localStorage.setItem('cookie_consent', 'yes')
    posthog.identify(data.user.id, {
      email: data.user.email,
      name: data.user.user_metadata.name || null,
    })
    router.push('/')
  }

  async function loginWithoutPassword() {
    const email = form.getValues('email')
    if (form.getFieldState('email').invalid) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    const supabase = await createSupabaseClient()

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${getURL()}/auth/otp?email=${email}&type=login`,
      },
    })
    if (error) {
      toast.error(error.message)
      return
    }
    router.push(`/auth/otp?email=${email}&type=login`)
  }

  return (
    <div className="grid h-screen w-full place-items-center">
      <div
        className={cn(
          'w-full p-2 sm:w-[24rem] sm:p-0',
          validating && 'space-y-3',
        )}
      >
        <Card className="space-y-8 px-9 pt-6 pb-12 shadow-none sm:shadow-md">
          <div className="flex w-full items-center gap-4 py-2">
            <Logo className="size-10" />
            <h1 className="p-0 font-extrabold text-2xl">Login</h1>
          </div>
          {/*           <div className="grid w-full grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => signInWithTwitter()}
              className="h-9 w-full gap-2 text-sm text-secondary-foreground"
            >
              <PiXComStroke className="size-3.5" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => signInWithGithub()}
              className="h-9 w-full gap-2 text-sm text-secondary-foreground"
            >
              <PiGithubStroke className="size-3.5" />
              Github
            </Button>
          </div>
          <Separator /> */}
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-end justify-between">
                      <FormLabel className="pb-0.5 text-muted-foreground">
                        Password:
                      </FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className={cn(
                          buttonVariants({ variant: 'ghost' }),
                          'h-5 translate-y-0.5 px-1.5 py-0 text-[11px] text-muted-foreground',
                        )}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full pt-8">
                <Button type="submit" form="loginForm" className="h-9 w-full">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </Card>
        <Suspense>
          {validating ? (
            <Card className="flex items-center gap-4 border-none bg-warning/10 py-3 pr-4 pl-5 text-sm shadow-none sm:border sm:shadow-md">
              <PiAlertTriangleStroke className="size-6" />
              We&apos;ve sent you an email. Please validate your email address
              before proceeding
              <Button
                onClick={() => router.push('/login')}
                variant={'ghost'}
                size={'icon'}
                className="hover:!border hover:!bg-background size-8 shrink-0 bg-transparent"
              >
                <PiCrossCross className="size-4" />
              </Button>
            </Card>
          ) : (
            <div className="flex w-full justify-center gap-1.5 py-3 text-[0.8rem] text-muted-foreground">
              <p>Don&apos;t have an account yet?</p>
              <Link href="/signup" className="underline">
                Sign Up
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}
