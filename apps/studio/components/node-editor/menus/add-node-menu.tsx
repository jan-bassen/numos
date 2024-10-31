import { type ReactNode, useState } from 'react'
import { cn } from '@repo/ui/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@repo/ui/components/ui/context-menu'
import { DropdownMenuSubitem } from './dropdown-subitem'
import { ContextMenuSubitem } from './context-subitem'
import type { Item } from '@/types/editor.types'
import type { NewNodePosition } from '@/lib/rete/utils/init'

declare type Props = {
  mode: 'dropdown' | 'context' | 'hover'
  position: NewNodePosition
  items: Item[]
  delay: number
  onHide(): void
  searchBar?: boolean
  children?: ReactNode
  asChild?: boolean
  className?: string
  contentClassName?: string
  align?: 'center' | 'end' | 'start'
  side?: 'bottom' | 'top' | 'right' | 'left'
}

export function AddNodeMenu(props: Props) {
  const [search, setSearch] = useState('')

  function withHide(handler: () => void) {
    return () => {
      handler()
      props.onHide()
    }
  }

  const allSubitems = props.items
    .flatMap((item) =>
      item.subitems
        ? item.subitems.map((subitem) => ({
            ...subitem,
            label: `${item.label} > ${subitem.label}`,
          }))
        : [],
    )
    .filter((subitem) => subitem !== undefined && subitem.key !== 'separator')

  const isSearching = search !== '' && allSubitems
  const filtered = allSubitems.filter((item) =>
    item?.label.toLowerCase().includes(search.toLowerCase()),
  )
  if (props.mode === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'rounded-md focus-visible:outline-none',
            props.className,
          )}
          asChild={props.asChild}
        >
          {props.children}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={props.side ?? 'bottom'}
          align={props.align ?? 'center'}
          sideOffset={8}
          className={cn(
            'flex flex-col p-0 shadow-md',
            isSearching ? 'min-w-44' : 'w-36',
            props.contentClassName,
          )}
        >
          {props.searchBar && (
            <div className="p-1">
              <input
                className="h-8 w-full rounded-sm border border-border px-2 py-1 font-light text-xs focus-visible:outline-none"
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
                key="search"
              />
            </div>
          )}
          {isSearching
            ? filtered.map((item) => (
                <DropdownMenuItem
                  className="w-full justify-between rounded-none py-1 pr-2"
                  onClick={withHide(() => item.handler(props.position))}
                  key={item.key}
                >
                  {item.label}
                </DropdownMenuItem>
              ))
            : props.items.map((item, index) =>
                item.key !== 'separator' ? (
                  <DropdownMenuSubitem
                    subitem={item}
                    withHide={withHide}
                    key={item.key}
                    position={props.position}
                  />
                ) : (
                  <DropdownMenuSeparator key={item.key + index.toString()} />
                ),
              )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{props.children}</ContextMenuTrigger>
      <ContextMenuContent
        className={cn(
          'flex flex-col p-0 shadow-md',
          isSearching ? ' w-56' : 'w-36',
        )}
      >
        {props.searchBar && (
          <div className="p-1">
            <input
              className="h-8 w-full rounded-sm border border-border px-2 py-1 font-light text-xs focus-visible:outline-none"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        {isSearching ? (
          <ul>
            {filtered.map((item) => (
              <ContextMenuItem
                className="w-full justify-between rounded-none py-1 pr-2"
                onClick={withHide(() => item.handler(props.position))}
                key={item.key}
              >
                {item.label}
              </ContextMenuItem>
            ))}
          </ul>
        ) : (
          props.items.map((item, index) =>
            item.key !== 'separator' ? (
              <ContextMenuSubitem
                subitem={item}
                withHide={withHide}
                key={item.key}
                position={props.position}
              />
            ) : (
              <ContextMenuSeparator key={item.key + index.toString()} />
            ),
          )
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
