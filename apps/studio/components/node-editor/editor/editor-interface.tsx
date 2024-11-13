import { AddNodeMenu } from '@/components/node-editor/menus/add-node-menu'
import {
  SECONDARY_SIDEBAR_HALF_WIDTH,
  SECONDARY_SIDEBAR_WIDTH,
  useSecondarySidebar,
} from '@repo/ui/components/ui/sidebar-secondary'
import {
  PiChevronBigLeftStroke,
  PiChevronBigRightStroke,
  PiCrossCross,
  PiPlayBigStroke,
  PiPlusSquareStroke,
  PiPointerCursorDefaultStroke,
  PiSettings02Stroke,
  PiSidebarMenuStroke,
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
import {
  Focus,
  LassoSelect,
  Minus,
  Mouse,
  MousePointerSquare,
  Plus,
  Redo2,
  Touchpad,
  Undo2,
} from 'lucide-react'
import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import Link from 'next/link'
import type {
  Editor,
  EditorSettings,
  InputMode,
  Shape,
} from '@/types/editor.types'
import type { Dispatch, SetStateAction } from 'react'
import { NodeGroupsBar } from '../menus/node-groups-bar'

export default function EditorInterface({
  parentUrl,
  editor,
  settings,
  setSettings,
  zoom,
}: {
  parentUrl?: string
  editor: Editor | null
  settings: EditorSettings
  setSettings: Dispatch<SetStateAction<EditorSettings>>
  zoom: string
}) {
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSecondarySidebar()
  return (
    <>
      <div
        className={cn(
          'absolute top-3 left-3 z-40 flex size-fit gap-2 md:top-4 md:left-4',
        )}
      >
        {parentUrl && (
          <Link
            href={parentUrl}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-9 items-center gap-1 rounded-lg pr-3 pl-2 shadow-sm md:h-10',
            )}
          >
            <PiChevronBigLeftStroke className="size-4.5" />
            Back
          </Link>
        )}
      </div>
      <div
        className={cn(
          '-translate-x-1/2 absolute top-4 left-1/2 z-40 hidden size-fit h-10 items-center gap-1.5 rounded-lg border border-border bg-background pr-1.5 pl-1 shadow-sm transition-transform md:flex',
          sidebarOpen && '-translate-x-[calc(50%+9rem)]',
        )}
      >
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
          className={cn(sidebarOpen ? '-xl:hidden' : '-lg:hidden')}
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
                  <MousePointerSquare className="size-4" />
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
      <div
        className={cn(
          'absolute bottom-2 left-2 z-10 md:hidden',
          sidebarOpen && 'hidden',
        )}
      >
        <AddNodeMenu
          mode="dropdown"
          items={editor?.editor.nodelist || []}
          delay={0}
          onHide={() => {}}
          side="top"
          align="end"
          contentClassName="ml-2"
          position="center"
          asChild
        >
          <Button
            variant={'outline'}
            size={'none'}
            className="size-12 rounded-full focus-visible:ring-0"
          >
            <PiPlusSquareStroke className="size-5" />
          </Button>
        </AddNodeMenu>
      </div>
      <div
        className={cn(
          'absolute right-2 bottom-2 z-40 flex size-fit gap-2 md:top-4 md:right-4 transition-transform',
          sidebarOpen && 'md:-translate-x-[19rem]',
        )}
      >
        <Button
          variant={'outline'}
          className={cn(
            'flex h-12 w-12 min-w-10 gap-1 rounded-full pr-0 pl-0 shadow-sm transition-all md:h-10 md:w-fit md:rounded-lg',
            sidebarOpen
              ? ' -md:!text-primary-foreground -md:bg-primary -md:hover:bg-primary/90 md:pr-2 md:pl-3'
              : 'md:pr-3 md:pl-2',
          )}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <PiChevronBigLeftStroke
            className={cn('size5 hidden md:block', sidebarOpen && 'md:hidden')}
          />
          <PiSidebarMenuStroke className="hidden size-4.5 rotate-180 md:block" />
          <PiChevronBigRightStroke
            className={cn('hidden size-5 ', sidebarOpen && 'md:block')}
          />
          <PiPlayBigStroke
            className={cn('size-4.5 md:hidden', sidebarOpen && 'hidden')}
          />
          <PiCrossCross
            className={cn('size-4.5 md:hidden', !sidebarOpen && 'hidden')}
          />
        </Button>
      </div>
      <div
        className={cn(
          'md:-translate-x-1/2 absolute top-3 right-3 z-30 flex w-fit gap-2 transition-transform md:top-auto md:bottom-3 md:left-1/2',
          sidebarOpen && 'md:-translate-x-[calc(50%+9rem)] hidden md:flex',
        )}
      >
        <Button
          variant={'outline'}
          size={'none'}
          className="size-8 rounded-lg shadow-sm"
          onClick={() => {
            editor?.editor.resetView(editor?.area)
          }}
        >
          <Focus className="size-3.5" />
        </Button>
        <div className="hidden items-center md:flex">
          <Button
            variant={'outline'}
            size={'none'}
            className="size-8 rounded-l-lg border-r-0 shadow-sm"
            onClick={() => {
              editor?.area.area.zoomAtCenter(-0.2)
            }}
          >
            <Minus className="size-3.5" />
          </Button>
          {zoom && (
            <Button
              variant={'outline'}
              size={'none'}
              className="h-8 w-12 border-x-0 py-1 font-light text-xs shadow-sm"
              onClick={() => {
                editor?.area.area.resetZoom()
              }}
            >
              {zoom}
            </Button>
          )}
          <Button
            variant={'outline'}
            size={'none'}
            className="size-8 rounded-r-lg border-l-0 shadow-sm"
            onClick={() => {
              editor?.area.area.zoomAtCenter(0.2)
            }}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
        <div className="flex items-center">
          <Button
            variant={'outline'}
            size={'none'}
            className="size-8 rounded-l-lg border-r-0 shadow-sm"
            onClick={() => {
              editor?.history.undo()
            }}
          >
            <Undo2 className="size-3.5" />
          </Button>
          <Button
            variant={'outline'}
            size={'none'}
            className="size-8 rounded-r-lg border-l-0 shadow-sm"
            onClick={() => {
              editor?.history.redo()
            }}
          >
            <Redo2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </>
  )
}
