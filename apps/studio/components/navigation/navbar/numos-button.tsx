import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/ui/sidebar'
import Link from 'next/link'
import Logo from '@repo/ui/components/brand/logo'
import { PiGlobeStroke, PiSparkleAi01Stroke } from '@repo/ui/icons/pika'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/components/ui/context-menu'

export function NumosButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <SidebarMenuButton asChild>
              <Link
                href="/"
                className="group-data-[state=collapsed]:!p-0 !h-12 group-data-[state=collapsed]:!h-12 flex gap-2 p-0 px-0 group-data-[state=expanded]:px-2"
              >
                <Logo size={24} name={false} className="size-6" />
                <span className="text-left font-semibold text-lg transition-transform group-data-[state=collapsed]:w-0">
                  Numos
                </span>
              </Link>
            </SidebarMenuButton>
          </ContextMenuTrigger>
          <ContextMenuContent className="min-w-56 rounded-lg">
            <ContextMenuItem asChild>
              <Link href="/" className="flex gap-2">
                <PiSparkleAi01Stroke className="size-4" />
                Studio
              </Link>
            </ContextMenuItem>
            <ContextMenuItem asChild>
              <Link href="https://numos.xyz" className="flex gap-2">
                <PiGlobeStroke className="size-4" />
                Homepage
              </Link>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
