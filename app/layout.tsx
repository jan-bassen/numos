import '../ui/styles.css'
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Toaster } from '@repo/ui/components/sonner'
import { cn } from '@repo/ui/lib/utils'
import localFont from 'next/font/local'
import type { CssVariable } from 'next/dist/compiled/@next/font'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import Script from 'next/script'
import { Suspense } from 'react'
import PostHogPageView from '@/lib/posthog/posthog-pageview'
import Providers from '@/app/(providers)/external-providers'
import CookieBanner from '@/lib/posthog/cookie-banner'
import ChatWidget from '@/lib/hubspot/chat'
import { Maintanance } from '@/app/maintanance'
import type { User } from '@supabase/supabase-js'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const fira = localFont<CssVariable>({
  display: 'swap',
  src: '../public/fonts/fira.ttf',
  variable: '--font-fira',
})

export const metadata: Metadata = {
  title: 'Numos',
  description: 'Simplifying the creation of dynamic digital assets',
  keywords: [
    'Numos',
    'NFT',
    'Dynamic NFT',
    'NFTs',
    'Dynamic NFTs',
    'NFT Studio',
  ],
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user: User | null = null
  try {
    const supabase = await createSupabaseServerComponentClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // no-op: allow rendering without Supabase env (useful for local/dev)
  }
  const maintanance = false
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${fira.variable}`}
      suppressHydrationWarning
    >
      <body className={cn(outfit.className, 'relative bg-background')}>
        {maintanance ? (
          <Maintanance />
        ) : (
          <>
            <Providers user={user}>
              <Suspense fallback={null}>
                <PostHogPageView />
              </Suspense>
              {children}
              <ChatWidget />
              <CookieBanner isLoggedIn={!!user} />
              <Toaster position="bottom-right" richColors />
            </Providers>
            <Script
              async
              defer
              type="text/javascript"
              id="hs-script-loader"
              src="//js-eu1.hs-scripts.com/144826452.js"
            />
          </>
        )}
      </body>
    </html>
  )
}
