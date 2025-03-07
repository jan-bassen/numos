'use client'

import { TooltipProvider } from '@repo/ui/components/ui/tooltip'
import { ThemeProvider, useTheme } from 'next-themes'
import { cookieConsentGiven } from '@/components/layout/cookie-banner'
import { posthog } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { SidebarProvider } from '@repo/ui/components/ui/sidebar'
import { ChatProvider } from '@/lib/hubspot/chat-context'

declare global {
  interface Window {
    hsConversationsSettings: {
      inlineEmbedSelector?: string
      loadImmediately?: boolean
    }
    HubSpotConversations: {
      on: (event: string, callback: (payload: any) => void) => void
      widget: {
        open: () => void
        close: () => void
        load: () => void
        remove: () => void
        refresh: () => void
        status: () => { loaded: boolean }
      }
    }
  }
}

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTheme } = useTheme()

  /* useEffect(() => {
    const localTheme = localStorage.getItem('theme')
    if (localTheme) {
      setTheme(localTheme)
    }
  }, [setTheme]) */

  useEffect(() => {
    window.hsConversationsSettings = {
      inlineEmbedSelector: '#custom-chat-widget',
      loadImmediately: true,
    }
  }, [])

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) throw new Error('No analytics key')

    if (
      !posthog.__loaded &&
      process.env.NEXT_PUBLIC_ENVIRONMENT !== 'development'
    ) {
      const consent = cookieConsentGiven() === 'yes'
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        persistence: consent ? 'localStorage+cookie' : 'memory',
        capture_pageview: false,
        capture_pageleave: true,
        loaded: (posthog) => {
          if (
            process.env.NODE_ENV === 'development' ||
            process.env.ENVIRONMENT === 'development'
          )
            /* posthog.debug() */
            console.log('posthog loaded')
        },
      })
    }
  }, [])

  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider attribute="class" defaultTheme={'system'}>
        <TooltipProvider delayDuration={500} skipDelayDuration={500}>
          <SidebarProvider>
            <ChatProvider>{children}</ChatProvider>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </PostHogProvider>
  )
}
