'use client'

import { AuthForm } from '@/app/(auth)/_components/auth-form'
import type { BetterFetchError, RequestContext } from 'better-auth/client'
import { toast } from '@repo/ui/components/sonner'
import {
  EmailLoginForm,
  type EmailLoginFormData,
} from '@/app/(auth)/login/email-form'
import { signIn } from '@/client/auth'

const onError = (error: {
  response: Response
  request: RequestContext
  error: BetterFetchError & Record<string, unknown>
}) => {
  toast.error(error.error.message)
}

const loginWithTwitter = async () => {
  await signIn.social(
    {
      provider: 'twitter',
    },
    { onError },
  )
}

const loginWithGoogle = async () => {
  await signIn.social({ provider: 'google' }, { onError })
}

const loginWithEmail = async (data: EmailLoginFormData) => {
  await signIn.email(data, { onError })
}

export default function LoginPage() {
  return (
    <AuthForm
      title="Welcome back"
      description="Login with your Twitter or Google account"
      link={{
        prefix: "Don't have an account?",
        text: 'Sign up',
        href: '/signup',
      }}
      twitter={{
        action: loginWithTwitter,
        text: 'Login with Twitter',
      }}
      google={{
        action: loginWithGoogle,
        text: 'Login with Google',
      }}
    >
      <EmailLoginForm onSubmit={loginWithEmail} />
    </AuthForm>
  )
}
