import { Tabs, type TabsProps } from '@repo/ui/components/ui/tabs'
import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

const BasePage = (props: ComponentProps<'div'>) => (
  <div
    {...props}
    className={cn(
      'flex min-h-full w-full flex-col overflow-hidden bg-background pb-16',
      props.className,
    )}
  />
)

type PageProps = ComponentProps<'div'> & { tabs?: true; tabsProps?: TabsProps }
export function Page({
  children,
  className,
  tabs,
  tabsProps,
  ...props
}: PageProps) {
  if (tabs) {
    return (
      <BasePage {...props}>
        <Tabs {...tabsProps}>{children}</Tabs>
      </BasePage>
    )
  }
  return <BasePage {...props}>{children}</BasePage>
}
