'use client'

import { Tabs, type TabsProps } from '@repo/ui/components/tabs'
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

type PageProps = ComponentProps<'div'> & {
  tabs?: true
  tabsProps?: TabsProps & { defaultValue?: string; pageid: string }
}
export function Page({ children, tabs, tabsProps, ...props }: PageProps) {
  if (tabs) {
    /* /* 
    const { pageId, defaultValue, onValueChange, ...rest } = tabsProps || {}
    if (!pageId) {
      throw new Error('pageId is required')
    }
    const _defaultValue =
      localStorage.getItem(`last-opened-tab-${pageId}`) || defaultValue

    const _onValueChange = (value: string) => {
      localStorage.setItem(`last-opened-tab-${pageId}`, value)
      onValueChange?.(value)
    } */
    return (
      <BasePage {...props}>
        <Tabs defaultValue={tabsProps?.defaultValue}>{children}</Tabs>
      </BasePage>
    )
  }
  return <BasePage {...props}>{children}</BasePage>
}
