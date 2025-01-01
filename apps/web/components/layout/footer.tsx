import Link from 'next/link'
import Logo from '@repo/ui/components/brand/logo'
import { Separator } from '@repo/ui/components/ui/separator'

const links = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Footer() {
  return (
    <>
      <Separator className="w-full " />
      <footer className="mx-auto grid h-56 w-full max-w-5xl -xl:px-4 py-5 pb-8 md:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-1.5 -md:pl-1">
              <Logo className="size-10" />
              <h1 className="font-extrabold font-poppins text-primary/85 text-xl">
                Numos
              </h1>
            </Link>
            <p className="pl-1 text-muted-foreground">
              Simplifying the creation of dynamic digital assets
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground">
              © 2023 Numos Labs. All rights reserved.
            </p>
            <div className="flex gap-6">
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
            </div>
          </div>
        </div>
        <ul className="hidden flex-col items-end gap-3 pt-1 pr-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-sm hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </ul>
      </footer>
    </>
  )
}
