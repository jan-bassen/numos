import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps, ReactNode } from 'react'
import { Checkbox } from '@repo/ui/components/ui/checkbox'

export function RichTextList<T extends 'ol' | 'ul'>({
  children,
  tag,
  className,
}: { className?: string; tag: T; children: ReactNode[] }) {
  switch (tag) {
    case 'ol':
      return (
        <ol className={cn(className, 'list-decimal px-3 py-2')}>{children}</ol>
      )
    case 'ul':
      return (
        <ul className={cn(className, 'list-disc px-3 py-2')}>{children}</ul>
      )
  }
}

export function RichTextListItem({
  children,
  className,
  value,
}: ComponentProps<'li'>) {
  return (
    <li className={cn(className, 'ml-4 list-outside')} value={value}>
      {children}
    </li>
  )
}

export function RichTextCheckboxListItem({
  children,
  checked,
  hasSubLists,
  value,
}: ComponentProps<'li'> & {
  children: ReactNode[]
  checked?: boolean
  hasSubLists: boolean
}) {
  return (
    <li
      aria-checked={checked || false}
      className={cn(
        'list-item-checkbox list-none',
        hasSubLists && 'nestedListItem',
      )}
      value={value}
    >
      {hasSubLists ? (
        children
      ) : (
        <div className="flex gap-1.5 py-0.5">
          <Checkbox
            className="translate-y-1 cursor-default"
            checked={checked}
          />
          <span>{children}</span>
        </div>
      )}
    </li>
  )
}
