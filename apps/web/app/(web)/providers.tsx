'use client'

import { TooltipProvider } from '@repo/ui/components/tooltip'
import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from '@repo/ui/components/sidebar'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme={'system'}>
      <TooltipProvider delayDuration={500} skipDelayDuration={500}>
        <SidebarProvider>{children}</SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
