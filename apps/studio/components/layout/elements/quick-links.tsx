import Link from 'next/link'
import { ReactNode, SVGProps, type JSX } from 'react';

export default function QuickLinks({
  links,
}: {
  links: {
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
    label: string
    href: string
  }[]
}) {
  return (
    <div className="flex w-full justify-start gap-4 overflow-x-scroll pb-4 scrollbar-none">
      {links.map((link, i) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center justify-between gap-6 rounded-full bg-muted py-3 pl-5 pr-4 text-muted-foreground transition-colors duration-200 ease-in-out hover:bg-muted-foreground hover:text-primary-foreground"
        >
          <p className="min-h-4 min-w-24 text-xs font-medium">{link.label}</p>
          <link.Icon className="size-4" />
        </Link>
      ))}
    </div>
  )
}
