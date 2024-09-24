import Link from 'next/link'
import { links } from './nav-links'
import Logo from '@repo/ui/components/brand/logo'

export default function Footer() {
  return (
    <footer className="grid h-56 w-full border-border border-t px-4 py-5 pb-8 md:grid-cols-2 md:px-12 xl:px-2">
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className=" flex items-center gap-3 font-bold font-mona text-[1.25rem]"
          >
            <Logo size={100} name={true} />
          </Link>
          <p className="pl-1 text-muted-foreground">
            Simplifying the creation of dynamic digital assets
          </p>
        </div>
        <p className="text-muted-foreground">
          © 2023 Numos Labs. All rights reserved.
        </p>
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
  )
}
