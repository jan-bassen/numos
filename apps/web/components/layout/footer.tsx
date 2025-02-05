import Link from 'next/link'
import Logo from '@repo/ui/components/brand/logo'
import { Separator } from '@repo/ui/components/ui/separator'
import type { Dictionary } from '@/dictionaries/dictionaries'
import Image from 'next/image'

const links = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Footer({
  dictionary,
}: { dictionary: Dictionary['numos'] }) {
  return (
    <>
      <Separator className="w-full" />
      <footer className="mx-auto grid h-52 w-full max-w-5xl -xl:px-4 py-4 pb-8 sm:h-72 sm:py-10 md:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-1.5 -md:pl-1">
              <Logo className="h-7 sm:h-8" size={200} name />
            </Link>
            <p className="pl-1 text-muted-foreground">{dictionary.slogan}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} {dictionary.company}.{' '}
              {dictionary.copyright}
            </p>
            {/* <div className="flex gap-6">
              <Link
                href="/notice"
                className="text-muted-foreground hover:underline"
              >
                Legal Notice
              </Link>
              <Link
                href="/impressum"
                className="text-muted-foreground hover:underline"
              >
                Impressum
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:underline"
              >
                Privacy Policy
              </Link>
            </div> */}
          </div>
        </div>
        <div className="flex h-18 w-full justify-end">
          <Image
            src="/assets/exist.png"
            alt="Exist"
            width={200}
            height={200}
            className="h-full w-auto dark:hidden"
          />
          <Image
            src="/assets/exist-dark.png"
            alt="Exist"
            width={200}
            height={200}
            className="hidden h-full w-auto dark:block"
          />
        </div>
        {/*<ul className="hidden flex-col items-end gap-3 pt-1 pr-2 md:flex">
           {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-sm hover:underline"
            >
              {link.label}
            </Link>
          ))} 
        </ul>*/}
      </footer>
    </>
  )
}
