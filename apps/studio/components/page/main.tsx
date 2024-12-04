import { TabsContent } from '@repo/ui/components/ui/tabs'
import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

export default function Main({
  value,
  children,
  className,
  ...props
}: {
  value?: string
} & ComponentProps<'main'>) {
  if (value) {
    return (
      <TabsContent value={value} asChild>
        <MainContent className={cn('!mt-0', className)} {...props}>
          {children}
        </MainContent>
      </TabsContent>
    )
  }
  return (
    <MainContent className={className} {...props}>
      {children}
    </MainContent>
  )
}

function MainContent({
  children,
  className,
  ...props
}: {} & ComponentProps<'main'>) {
  return (
    <main
      className={cn(
        'flex h-full w-full flex-grow flex-col gap-8 p-8',
        className,
      )}
      {...props}
    >
      {children}
    </main>
  )
}
