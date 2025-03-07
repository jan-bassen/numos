import {
  PiPlusSquareStroke,
  PiPointerCursorDefaultStroke,
  PiSettings02Stroke,
  PiSwipeDefaultStroke,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { Separator } from '@repo/ui/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import { LassoSelect, Mouse, MousePointer, Touchpad } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import type { InputMode, Shape } from '@/types/editor.types'
import { NodeGroupsBar } from '../menus/node-groups-bar'
import { useEditorContext } from '../editor/editor-provider'
import { useSecondarySidebar } from '@repo/ui/components/ui/sidebar-secondary'
import { AddNodeMenu } from '../menus/add-node-menu'

export default function TopBar() {
  const { editor, settings, setSettings } = useEditorContext()
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSecondarySidebar()
  return (
    <div className="size-full items-center gap-1.5 rounded-lg border border-border bg-background pr-1.5 pl-1 shadow-xs md:flex">
      <div className="flex w-fit items-center gap-0.5">
        <Button
          variant={'ghost'}
          size={'none'}
          className={cn(
            'size-8 rounded-md focus-visible:ring-0',
            settings.mode === 'select' && 'bg-muted',
          )}
          onClick={() => {
            setSettings({ ...settings, mode: 'select' })
          }}
        >
          <PiPointerCursorDefaultStroke className="size-4.5" />
        </Button>
        <Button
          variant={'ghost'}
          size={'none'}
          className={cn(
            'size-8 rounded-md focus-visible:ring-0',
            settings.mode === 'drag' && 'bg-muted',
          )}
          onClick={() => {
            setSettings({ ...settings, mode: 'drag' })
          }}
        >
          <PiSwipeDefaultStroke className="size-4.5" />
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6 w-[1.5px]" />
      <NodeGroupsBar
        className={cn(sidebarOpen ? 'max-xl:hidden' : 'max-lg:hidden')}
        items={editor?.editor.nodelist || []}
        onHide={() => {}}
        position="center"
      />
      <AddNodeMenu
        mode="dropdown"
        items={editor?.editor.nodelist || []}
        delay={0}
        searchBar={false}
        onHide={() => {}}
        className={cn(sidebarOpen ? 'xl:hidden' : 'lg:hidden')}
        position="center"
        asChild
      >
        <Button
          variant={'ghost'}
          size={'none'}
          className="size-8 rounded-md focus-visible:ring-0"
        >
          <PiPlusSquareStroke className="size-5" />
        </Button>
      </AddNodeMenu>
      <Separator orientation="vertical" className="h-6 w-[1.5px]" />
      <div className="w-fit items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'ghost'}
              size={'none'}
              className="size-8 rounded-md focus-visible:ring-0"
            >
              <PiSettings02Stroke className="size-4.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={8} className="min-w-40 space-y-1">
            <DropdownMenuRadioGroup
              className="space-y-0.5"
              value={settings.shape}
              onValueChange={(v) => {
                setSettings({ ...settings, shape: v as Shape })
              }}
            >
              <DropdownMenuRadioItem value="marquee" className={cn('gap-2')}>
                <MousePointer className="size-4" />
                Rectangle
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lasso" className={cn('gap-2')}>
                <LassoSelect className="size-4" />
                Lasso
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              className="space-y-0.5"
              value={settings.input}
              onValueChange={(v) => {
                setSettings({ ...settings, input: v as InputMode })
              }}
            >
              <DropdownMenuRadioItem value="mouse" className={cn('gap-2')}>
                <Mouse className="size-4" />
                Mouse
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="touchpad" className={cn('gap-2')}>
                <Touchpad className="size-4" />
                Touchpad
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
