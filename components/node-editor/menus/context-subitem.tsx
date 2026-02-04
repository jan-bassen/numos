import {
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@repo/ui/components/context-menu'
import type { NewNodePosition } from '@/lib/rete/utils/init'
import type { Item } from '@/types/editor.types'

export function ContextMenuSubitem({
  subitem,
  withHide,
  position,
}: {
  subitem: Item
  withHide: (handler: () => void) => () => void
  position: NewNodePosition
}) {
  if (subitem.subitems) {
    const group = subitem
    return (
      <ContextMenuSub key={group.key}>
        <ContextMenuSubTrigger className="flex h-8 w-full flex-row gap-3 rounded-none pl-2.5">
          <>
            {group.Icon && (
              <group.Icon className="my-auto h-4 w-4 stroke-[1.7px]" />
            )}
            {group.label}
          </>
        </ContextMenuSubTrigger>
        <ContextMenuPortal>
          <ContextMenuSubContent
            sideOffset={2}
            className="flex min-w-28 flex-col p-0 shadow-md"
          >
            {group.subitems?.map((subitem, index) => {
              if (subitem.subitems)
                return (
                  <ContextMenuSubitem
                    key={subitem.key}
                    subitem={subitem}
                    withHide={withHide}
                    position={position}
                  />
                )
              return subitem.key !== 'separator' ? (
                <ContextMenuItem
                  className="h-8 w-full justify-start rounded-none"
                  onClick={withHide(() => subitem.handler(position))}
                  key={subitem.key}
                >
                  {subitem.label}
                </ContextMenuItem>
              ) : (
                <ContextMenuSeparator key={subitem.key + index.toString()} />
              )
            })}
          </ContextMenuSubContent>
        </ContextMenuPortal>
      </ContextMenuSub>
    )
  }
  return subitem.key !== 'separator' ? (
    <ContextMenuItem
      className="h-8 w-full justify-start rounded-none"
      onClick={withHide(() => subitem.handler(position))}
      key={subitem.key}
    >
      {subitem.label}
    </ContextMenuItem>
  ) : (
    <ContextMenuSeparator key={subitem.key} />
  )
}
