import { Tabs, type TabsProps } from '@repo/ui/components/ui/tabs'
import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

const pageClassName =
  'flex min-h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-background'
export function Page({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(pageClassName, className)} {...props}>
      {children}
    </div>
  )
}

export function TabsPage({
  children,
  className,
  ...props
}: TabsProps & { defaultValue: string }) {
  return (
    <Tabs className={cn(pageClassName, className)} {...props}>
      {children}
    </Tabs>
  )
}
