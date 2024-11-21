import { AddNodeMenu } from '@/components/node-editor/menus/add-node-menu'
import { useSecondarySidebar } from '@repo/ui/components/ui/sidebar-secondary'
import {
  PiChevronBigLeftStroke,
  PiChevronBigRightStroke,
  PiCrossCross,
  PiPlayBigStroke,
  PiPlusSquareStroke,
  PiSidebarMenuStroke,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { Focus, Minus, Plus, Redo2, Undo2 } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import type { Editor } from '@/types/editor.types'
import BackButton from './back-button'
import TopBar from './top-bar'

export default function EditorInterface({
  parentUrl,
  editor,
  zoom,
}: {
  parentUrl?: string
  editor: Editor | null
  zoom: string
}) {
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSecondarySidebar()
  return (
    <>
      <div
        id="editor-top-left"
        className={cn(
          'absolute top-3 left-3 z-40 flex size-fit gap-2 md:top-4 md:left-4',
        )}
      >
        <BackButton parentUrl={parentUrl} />
      </div>
      <div
        id="editor-top-center"
        className={cn(
          '-translate-x-1/2 absolute top-4 left-1/2 z-40 -md:hidden size-fit h-10 transition-transform',
          sidebarOpen && '-translate-x-[calc(50%+9rem)]',
        )}
      >
        <TopBar />
      </div>
      <div
        id="mobile-editor-bottom-left"
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
          'absolute right-2 bottom-2 z-40 flex size-fit gap-2 transition-transform md:top-4 md:right-4',
          sidebarOpen && 'md:-translate-x-[18rem]',
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
