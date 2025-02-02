import '@repo/ui/globals.css'
import type { Metadata } from 'next'
import { Inter, Outfit, Poppins } from 'next/font/google'
import { Toaster } from '@repo/ui/components/ui/sonner'
import { cn } from '@repo/ui/lib/utils'
import localFont from 'next/font/local'
import type { CssVariable } from 'next/dist/compiled/@next/font'
import Script from 'next/script'
import PostHogPageView from '@/lib/posthog/posthog-pageview'
import Providers from './providers'
import CookieBanner from '@/lib/posthog/cookie-banner'
import { Suspense } from 'react'
import { Navigation } from '@/components/layout/navigation/navigation'
import { Drawer } from '@repo/ui/components/ui/drawer'
import { MobileMenu } from '@/components/layout/navigation/mobile-menu'
import Footer from '@/components/layout/footer'
import { getDictionary } from '@/dictionaries/dictionaries'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

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
  const d = await getDictionary('en')
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${fira.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className={cn(outfit.className, 'relative bg-background')}>
        <Providers>
          <Suspense>
            <PostHogPageView />
          </Suspense>
          <div className="relative flex w-full flex-col items-center">
            <Navigation dictionary={{ navbar: d.navbar, home: d.home }} />
            {children}
            <Footer />
          </div>
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
