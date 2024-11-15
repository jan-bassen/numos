import { TabsContent } from '@repo/ui/components/ui/tabs'
import { cn } from '@repo/ui/lib/utils'

export default function Main({
  children,
  className,
  tabValue,
}: {
  children?: React.ReactNode
  className?: string
  tabValue?: string
}) {
  if (tabValue) {
    return (
      <TabsContent value={tabValue} asChild>
        <main
          className={cn(
            '!mt-0 flex h-full w-full flex-grow flex-col gap-6 p-6',
            className,
          )}
        >
          {children}
        </main>
      </TabsContent>
    )
  }
  return (
    <main
      className={cn(
        'flex h-full w-full flex-grow flex-col gap-8 p-8',
        className,
      )}
    >
      {children}
    </main>
  )
}
