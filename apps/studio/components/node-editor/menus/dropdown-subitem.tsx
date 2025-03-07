import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import type { NewNodePosition } from '@/lib/rete/utils/init'
import type { Item } from '@/types/editor.types'

export function DropdownMenuSubitem({
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
      <DropdownMenuSub key={group.key}>
        <DropdownMenuSubTrigger className="flex h-8 w-full flex-row gap-3 rounded-none pr-2 pl-2.5">
          <>
            {group.Icon && (
              <group.Icon className="my-auto h-4 w-4 stroke-[1.7px]" />
            )}
            {group.label}
          </>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent
            sideOffset={2}
            className="flex min-w-28 flex-col p-0 shadow-md"
          >
            {group.subitems?.map((subitem) => {
              if (subitem.subitems)
                return (
                  <DropdownMenuSubitem
                    key={subitem.key}
                    subitem={subitem}
                    withHide={withHide}
                    position={position}
                  />
                )
              return subitem.key !== 'separator' ? (
                <DropdownMenuItem
                  className="h-8 w-full justify-start rounded-none"
                  onClick={withHide(() => subitem.handler(position))}
                  key={subitem.key}
                >
                  {subitem.label}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuSeparator key={subitem.key} />
              )
            })}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    )
  }
  return subitem.key !== 'separator' ? (
    <DropdownMenuItem
      className="h-8 w-full justify-start rounded-none"
      onClick={withHide(() => subitem.handler(position))}
      key={subitem.key}
    >
      {subitem.label}
    </DropdownMenuItem>
  ) : (
    <DropdownMenuSeparator key={subitem.key} />
  )
}
