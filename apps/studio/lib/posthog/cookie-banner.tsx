'use client'

import { Button } from '@repo/ui/components/ui/button'
import { Card, CardTitle } from '@repo/ui/components/ui/card'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'

export function cookieConsentGiven(isLoggedIn: boolean) {
  if (isLoggedIn) {
    return 'yes'
  }
  if (!localStorage.getItem('cookie_consent')) {
    return 'undecided'
  }
  return localStorage.getItem('cookie_consent')
}

export default function CookieBanner({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [consentGiven, setConsentGiven] = useState('')
  const posthog = usePostHog()

  useEffect(() => {
    setConsentGiven(cookieConsentGiven(isLoggedIn) || 'undecided')
  }, [isLoggedIn])

  useEffect(() => {
    if (consentGiven !== '') {
      posthog.set_config({
        persistence:
          consentGiven === 'yes' || isLoggedIn
            ? 'localStorage+cookie'
            : 'memory',
      })
    }
  }, [consentGiven, isLoggedIn, posthog.set_config])

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'yes')
    setConsentGiven('yes')
  }

  const handleDeclineCookies = () => {
    localStorage.setItem('cookie_consent', 'no')
    setConsentGiven('no')
  }

  if (consentGiven === 'undecided')
    return (
      <Card className="fixed bottom-3 left-1/2 z-[200] w-[32rem] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 space-y-1.5 px-5 py-3 animate-in animate-out slide-in-from-bottom-96 slide-out-to-bottom-96">
        <CardTitle className=" text-base font-semibold">
          Cookies for Analytics
        </CardTitle>
        <p className="text-xs">
          We use tracking cookies to understand how you use the product and help
          us improve it. We don&apos;t use them for advertising!
        </p>
        <div className="flex w-full justify-end gap-2">
          <Button
            variant={'creative'}
            type="button"
            size={'sm'}
            onClick={handleAcceptCookies}
          >
            Accept
          </Button>
          <Button
            variant={'outline'}
            type="button"
            size={'sm'}
            onClick={handleDeclineCookies}
          >
            Decline
          </Button>
        </div>
      </Card>
    )
  return null
}
