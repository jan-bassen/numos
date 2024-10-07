'use client'

import { TooltipProvider } from '@repo/ui/components/ui/tooltip'
import { ThemeProvider } from 'next-themes'
import { cookieConsentGiven } from '@/lib/posthog/cookie-banner'
import { posthog } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

declare global {
  interface Window {
    hsConversationsSettings: {
      inlineEmbedSelector?: string
      loadImmediately?: boolean
    }
    HubSpotConversations: {
      widget: {
        open: () => void
        close: () => void
      }
    }
  }
}

export default function Providers({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode
  isLoggedIn: boolean
}) {
  let defaultTheme = 'system'
  if (typeof window !== 'undefined') {
    defaultTheme = localStorage.getItem('theme') || 'system'

    window.hsConversationsSettings = {
      inlineEmbedSelector: '#custom-chat-widget',
      loadImmediately: true,
    }

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return

    if (!posthog.__loaded && process.env.VERCEL_ENV === 'production') {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        persistence:
          cookieConsentGiven(isLoggedIn) === 'yes'
            ? 'localStorage+cookie'
            : 'memory',
        capture_pageview: false,
        loaded: (posthog) => {
          if (
            process.env.NODE_ENV === 'development' ||
            process.env.ENVIRONMENT === 'development'
          )
            posthog.debug()
        },
      })
    }
  }

  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider attribute="class" defaultTheme={defaultTheme}>
        <TooltipProvider delayDuration={500} skipDelayDuration={500}>
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </PostHogProvider>
  )
}
