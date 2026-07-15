import '@repo/ui/styles.css'

import { Toaster } from '@repo/ui/components/sonner'
import { cn } from '@repo/ui/lib/utils'
import type { Metadata } from 'next'
import type { CssVariable } from 'next/dist/compiled/@next/font'
import { Inter, Outfit, Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import Footer from '@/components/layout/footer'
import { Navigation } from '@/components/layout/navigation/navigation'
import { getDictionary } from '@/dictionaries/dictionaries'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const fira = localFont<CssVariable>({
  display: 'swap',
  src: '../../public/fonts/fira.ttf',
  variable: '--font-fira',
})

export const metadata: Metadata = {
  title: 'NUMOS - Create dynamic NFTs easily, no code required',
  description:
    'NUMOS for the next generation of NFTs ➽ Interactive and dynamic NFTs ✓ Code-free ✓ Incredibly powerful ✓ Predictable pricing ✓ No lock-in ✓ Reliably fast ✓',
  keywords: [
    'NUMOS',
    'numos',
    'numos.xyz',
    'NFT',
    'Dynamic NFT',
    'Dynamic NFTs',
    'Changing NFTs',
    'NFTs',
    'Non-Fungible Tokens',
    'NFT Studio',
    'Launch NFT',
    'Minting',
    'Mint',
    'Minting NFTs',
    'Mint NFTs',
    'Mint NFT',
  ],
  openGraph: {
    title: 'NUMOS - Create dynamic NFTs easily',
    description:
      'Create interactive and dynamic NFTs ✓ No code or technical skills required ✓ Reliably fast and predictable pricing ✓',
    url: 'https://numos.xyz',
    siteName: 'NUMOS',
    type: 'website',
    locale: 'en_US',
  },
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
          <div className="relative flex w-full flex-col items-center">
            <Navigation dictionary={d.navbar} />
            {children}
            <Footer dictionary={d.numos} />
          </div>
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
