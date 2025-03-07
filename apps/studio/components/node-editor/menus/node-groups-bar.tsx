import { cn } from '@repo/ui/lib/utils'
import type { Item } from '@/types/editor.types'
import { buttonVariants } from '@repo/ui/components/ui/button'
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@repo/ui/components/ui/menubar'
import { NodeGroupsBarSubitem } from './node-groups-bar-subitem'
import type { NewNodePosition } from '@/lib/rete/utils/init'

declare type Props = {
  items: Item[]
  delay?: number
  onHide(): void
  className?: string
  position: NewNodePosition
}

export function NodeGroupsBar(props: Props) {
  function withHide(handler: () => void) {
    return () => {
      handler()
      props.onHide()
    }
  }

  const groups = props.items.filter(
    (item) => item.subitems && item.subitems.length > 0,
  )

  return (
    <Menubar
      className={cn('h-fit space-x-0.5 border-none p-0', props.className)}
    >
      {groups.map((group) => (
        <MenubarMenu key={group.key}>
          <MenubarTrigger
            unstyled
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'none',
              }),
              'flex size-8 items-center justify-center rounded-md px-auto py-auto text-sm focus-visible:outline-hidden focus-visible:ring-0',
            )}
          >
            {group.Icon?.({ className: 'size-4.5' })}
          </MenubarTrigger>
          <MenubarContent
            className={cn('flex min-w-36 flex-col bg-background p-0 shadow-md')}
          >
            {group.subitems?.map((subitem) => (
              <NodeGroupsBarSubitem
                subitem={subitem}
                withHide={withHide}
                key={subitem.key}
                position={props.position}
              />
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  )
}
