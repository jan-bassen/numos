import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/sidebar'
import Link from 'next/link'
import Logo from '@repo/ui/blocks/brand/logo'
import { CollapseButton } from '@/app/collection/_components/sidebar/collapse-button'

export function HeaderContent() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* <ContextMenu> */}
        <div className="flex items-center gap-1 group-data-[state=collapsed]:hidden">
          {/* <ContextMenuTrigger asChild> */}
          <SidebarMenuButton asChild>
            <Link href="/" className="!h-12 p-0 px-2">
              <Logo name size={240} className="!h-6 " />
            </Link>
          </SidebarMenuButton>
          {/* </ContextMenuTrigger> */}
          <CollapseButton />
        </div>
        <div className="hidden group-data-[state=collapsed]:flex">
          {/*  <ContextMenuTrigger asChild> */}
          <SidebarMenuButton asChild>
            <Link
              href="/"
              className="group-data-[state=collapsed]:!h-12 group-data-[state=collapsed]:!p-1 !px-0 rounded-full opacity-80 "
            >
              {/* <LogoIcon size={24} className="!size-12" /> */}
              <Logo className="size-10" />
            </Link>
          </SidebarMenuButton>
          {/* </ContextMenuTrigger> */}
        </div>
        {/*           <ContextMenuContent className="min-w-56 rounded-lg">
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
        </ContextMenu> */}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
