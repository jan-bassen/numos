'use client'

import { AuthForm } from '@/app/(auth)/_components/auth-form'
import type { BetterFetchError, RequestContext } from 'better-auth/client'
import { toast } from '@repo/ui/components/sonner'
import { EmailSignupForm, type EmailSignupFormData } from './email-form'
import { signIn, signUp } from '@/client/auth'

const onError = (error: {
  response: Response
  request: RequestContext
  error: BetterFetchError & Record<string, unknown>
}) => {
  toast.error(error.error.message)
}

const signUpWithSocial = async (provider: 'twitter' | 'google') => {
  await signIn.social(
    {
      provider,
    },
    {
      onError,
    },
  )
}

const signUpWithEmail = async (data: EmailSignupFormData) => {
  await signUp.email(data, {
    onError,
  })
}

export default function SignupPage() {
  return (
    <AuthForm
      title="Welcome!"
      description="Sign up with your email"
      link={{
        prefix: 'Already have an account?',
        text: 'Login',
        href: '/login',
      }}
      twitter={{
        action: () => signUpWithSocial('twitter'),
        text: 'Sign up with Twitter',
      }}
      google={{
        action: () => signUpWithSocial('google'),
        text: 'Sign up with Google',
      }}
    >
      <EmailSignupForm onSubmit={signUpWithEmail} />
    </AuthForm>
  )
}
