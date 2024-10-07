import '@repo/ui/globals.css'
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Toaster } from '@repo/ui/components/ui/sonner'
import { cn } from '@repo/ui/lib/utils'
import localFont from 'next/font/local'
import type { CssVariable } from 'next/dist/compiled/@next/font'
import dynamic from 'next/dynamic'
import { createSupabaseServerComponentClient } from '@/lib/supabase/server-client'
import Script from 'next/script'

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

const PostHogPageView = dynamic(
  () => import('@/lib/posthog/posthog-pageview'),
  {
    ssr: false,
  },
)

const CookieBanner = dynamic(() => import('@/lib/posthog/cookie-banner'), {
  ssr: false,
})

const Providers = dynamic(() => import('@/app/providers'), {
  ssr: false,
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerComponentClient()
  const { data: user } = await supabase.auth.getUser()
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${fira.variable}`}
    >
      <body className={cn(outfit.className, 'relative bg-background')}>
        <Providers isLoggedIn={!!user}>
          <PostHogPageView />
          {children}
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
      </body>
    </html>
  )
}
