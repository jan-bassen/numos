'use client'

import { TooltipProvider } from '@repo/ui/components/tooltip'
import { ThemeProvider, useTheme } from 'next-themes'
import { useEffect } from 'react'
import { SidebarProvider } from '@repo/ui/components/sidebar'
import { SecondarySidebarProvider } from '@repo/ui/components/sidebar-secondary'
import { DataBootProvider } from '@/app/(providers)/data-boot-provider'

function ThemeSync() {
  const { setTheme } = useTheme()
  useEffect(() => {
    const localTheme = localStorage.getItem('theme')
    if (localTheme) {
      setTheme(localTheme)
    }
  }, [setTheme])
  return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={'system'}>
      <ThemeSync />
      <TooltipProvider delayDuration={500} skipDelayDuration={500}>
        <SidebarProvider>
          <SecondarySidebarProvider defaultOpen>
            <DataBootProvider>{children}</DataBootProvider>
          </SecondarySidebarProvider>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
