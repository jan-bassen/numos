'use client'

import { deslugify } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Breadcrumbs from './breadcrumbs'

export default function NavBreadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null
  const items = segments.map((segment, index) => ({
    type: 'link' as const,
    label: deslugify(segment),
    href: `/${segments.slice(0, index + 1).join('/')}`,
  }))
  return <Breadcrumbs items={items} className={className} />
}
