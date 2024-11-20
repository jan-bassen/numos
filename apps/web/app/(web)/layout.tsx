import '@repo/ui/globals.css'
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Toaster } from '@repo/ui/components/ui/sonner'
import { cn } from '@repo/ui/lib/utils'
import localFont from 'next/font/local'
import type { CssVariable } from 'next/dist/compiled/@next/font'
import Script from 'next/script'
import PostHogPageView from '@/lib/posthog/posthog-pageview'
import Providers from './providers'
import CookieBanner from '@/lib/posthog/cookie-banner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

const fira = localFont<CssVariable>({
  display: 'swap',
  src: '../../public/fonts/fira.ttf',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${fira.variable}`}
      suppressHydrationWarning
    >
      <body className={cn(outfit.className, 'relative bg-background')}>
        <Providers>
          <PostHogPageView />
          {children}
          <CookieBanner />
          <Toaster position="bottom-right" richColors />
        </Providers>
        <Script
          async
          defer
          type="text/javascript"
          id="hs-script-loader"
          src="//js-eu1.hs-scripts.com/144826452.js"
        />
      </body>
    </html>
  )
}
