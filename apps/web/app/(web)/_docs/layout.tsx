import { Page } from '@/components/layout/page'
import type { ReactNode } from 'react'
import { DocsNavigation } from './(components)/docs-navigation'

export default function DocsLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Page className="gap-8">
      <div className="relative max-md:hidden w-full max-w-48 pl-8">
        <DocsNavigation />
      </div>
      {children}
    </Page>
  )
}
