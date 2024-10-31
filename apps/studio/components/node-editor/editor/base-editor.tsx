import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import { createEditor } from '@/lib/rete/create-editor'
import { useEditorHotkeys } from '@/lib/rete/utils/hotkeys'
import type {
  Action,
  Attribute,
  ReturnInfo,
  OptionalTokenMetadata,
  OptionalTokenState,
} from '@/types/database.types'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from 'react'
import { AddNodeMenu } from '@/components/node-editor/menus/add-node-menu'
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
import type { SimulationCheck } from '@/lib/errors'
import { useEditor } from '@/lib/rete/use-editor'
import { cn } from '@repo/ui/lib/utils'
import type {
  AutoSaveFunctions,
  Editor,
  EditorConfig,
  EditorContext,
  EditorSettings,
  InputMode,
  Shape,
} from '@/types/editor.types'
import type {
  OLDSavedControlMap,
  SavedGraph,
} from '@repo/engine/types/graph-types'
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
import { autosaveToEvents } from '@/lib/rete/autosave'
import type { NodeEditor } from '@/lib/rete/classes/editor'
import Link from 'next/link'
import { useMediaQuery } from '@/lib/hooks/media-query'
import { getAttributeTypes } from '@/components/elements/attributes/attribute-schema'
import { getParameterTypes } from '@/components/elements/actions/action-schema'
import { Separator } from '@repo/ui/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import type { ZoomEventParams } from '@/lib/rete/classes/area/area'
import Decimal from 'decimal.js'
import { NodeGroupsBar } from '../menus/node-groups-bar'
import SimulationForm from './simulation-form'
import type {
  GraphErrorData,
  SimulationData,
} from '@repo/engine/types/engine-types'

export type BaseEditorFormProps = {
  attributes: Attribute[]
  run: (data: SimulationData) => Promise<void>
  id: string
  error: GraphErrorData | null
  setError: Dispatch<SetStateAction<GraphErrorData | null>>
  action?: Action
}

export default function BaseEditor({
  parentId,
  initialGraph,
  attributes,
  context,
  config,
  result,
  resetResult,
  run,
  autosave,
  action,
  changeSettings,
  resultClassName,
  parentUrl,
}: {
  parentId: string
  initialGraph: SavedGraph
  attributes: Attribute[]
  context: EditorContext
  config: EditorConfig
  result: ReactNode
  resetResult: () => void
  run: (editor: Editor | null, data: SimulationData) => Promise<SimulationCheck>
  autosave: AutoSaveFunctions
  action?: Action
  changeSettings?: (
    editor: NodeEditor,
    controls: OLDSavedControlMap,
  ) => Promise<ReturnInfo>
  resultClassName?: string
  parentUrl?: string
}) {
  const isMediumScreen = useMediaQuery('(min-width: 768px)')
  const [runOpen, setRunOpen] = useState(
    isMediumScreen && localStorage.getItem('node-editor-run-open') !== 'false',
  )
  const [uploadQueue, setUploadQueue] = useState(0)
  const [zoom, setZoom] = useState('100%')
  const [error, setError] = useState<GraphErrorData | null>(null)

  const [settings, setSettings] = useState<EditorSettings>(
    localStorage.getItem('node-editor-settings')
      ? JSON.parse(localStorage.getItem('node-editor-settings') || '{}')
      : {
          mode: 'select',
          shape: 'marquee',
          input: 'mouse',
        },
  )

  useEffect(() => {
    localStorage.setItem('node-editor-settings', JSON.stringify(settings))
    editor?.editor.applySettings(settings)
  }, [settings])

  useEffect(() => {
    if (!isMediumScreen) {
      setRunOpen(false)
    }
  }, [isMediumScreen])

  useEffect(() => {
    localStorage.setItem('node-editor-run-open', runOpen ? 'true' : 'false')
  }, [runOpen])

  function increaseUploadQueue() {
    setUploadQueue((currentUploadQueue) => currentUploadQueue + 1)
  }

  function decreaseUploadQueue() {
    setUploadQueue((currentUploadQueue) => {
      const updatedQueue = currentUploadQueue > 0 ? currentUploadQueue - 1 : 0
      return updatedQueue
    })
  }

  const autosaveEvents = autosaveToEvents(
    autosave,
    increaseUploadQueue,
    decreaseUploadQueue,
    parentId,
    changeSettings,
  )

  const events = {
    ...autosaveEvents,
    onZoomed: (editor: NodeEditor, params: ZoomEventParams) => {
      const zoom = new Decimal(params.zoom * 100).toDecimalPlaces(0).toString()
      setZoom(`${zoom}%`)
    },
  }

  const [ref, editor] = useEditor<Editor>((container: HTMLElement) => {
    return createEditor(
      container,
      config,
      context,
      settings,
      events,
      initialGraph,
    )
  })

  async function _run(data: SimulationData) {
    error &&
      error.type === 'graph' &&
      editor?.editor.clearError(error.location.node)
    error && setError(null)
    result && resetResult()

    const res = await run(editor, data)
    if (!res.success) {
      if (res.error.type === 'graph') {
        editor?.editor.trigger(res.error)
        setError(res.error)
      }
    }
  }

  useEditorHotkeys(editor)

  useHotkeys('Shift+e', (e) => {
    setRunOpen(!runOpen)
  })

  useHotkeys('Shift+enter', (e) => {
    setRunOpen(true)
  })

  return (
    <div className="relative flex h-full w-full max-w-full">
      <div
        className={cn(
          'absolute top-3 left-3 z-40 flex size-fit gap-2 md:top-4 md:left-4',
          runOpen && 'hidden md:flex',
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
          runOpen && '-translate-x-[calc(50%+10rem)] ',
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
          className="hidden xl:flex"
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
          className="xl:hidden"
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
                onClick={() => {}}
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
          runOpen && 'hidden',
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
      <div className="absolute right-2 bottom-2 z-40 flex size-fit gap-2 md:top-4 md:right-4">
        <Button
          variant={'outline'}
          className={cn(
            'flex h-12 w-12 min-w-10 gap-1 rounded-full pr-0 pl-0 shadow-sm transition-all md:h-10 md:w-fit md:rounded-lg',
            runOpen
              ? 'md:-translate-x-[20rem] -md:!text-primary-foreground -md:bg-primary -md:hover:bg-primary/90 md:pr-2 md:pl-3'
              : 'md:pr-3 md:pl-2',
          )}
          onClick={() => setRunOpen(!runOpen)}
        >
          <PiChevronBigLeftStroke
            className={cn('size5 hidden md:block', runOpen && 'md:hidden')}
          />
          <PiSidebarMenuStroke className="hidden size-4.5 rotate-180 md:block" />
          <PiChevronBigRightStroke
            className={cn('hidden size-5 ', runOpen && 'md:block')}
          />
          <PiPlayBigStroke
            className={cn('size-4.5 md:hidden', runOpen && 'hidden')}
          />
          <PiCrossCross
            className={cn('size-4.5 md:hidden', !runOpen && 'hidden')}
          />
        </Button>
      </div>
      <div
        className={cn(
          'absolute top-3 right-3 z-30 flex gap-2 md:top-auto md:right-auto md:bottom-4 md:left-4',
          runOpen && 'hidden md:flex',
        )}
      >
        <Button
          variant={'outline'}
          size={'none'}
          className="size-9 rounded-lg shadow-sm"
          onClick={() => {
            editor?.editor.resetView(editor?.area)
          }}
        >
          <Focus className="size-4" />
        </Button>
        <div className="hidden items-center md:flex">
          <Button
            variant={'outline'}
            size={'none'}
            className="size-9 rounded-l-lg border-r-0 shadow-sm"
            onClick={() => {
              editor?.area.area.zoomAtCenter(-0.2)
            }}
          >
            <Minus className="size-4" />
          </Button>
          {zoom && (
            <Button
              variant={'outline'}
              size={'none'}
              className="h-9 w-12 border-x-0 py-1 text-xs shadow-sm"
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
            className="size-9 rounded-r-lg border-l-0 shadow-sm"
            onClick={() => {
              editor?.area.area.zoomAtCenter(0.2)
            }}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="flex items-center">
          <Button
            variant={'outline'}
            size={'none'}
            className="size-9 rounded-l-lg border-r-0 shadow-sm"
            onClick={() => {
              editor?.history.undo()
            }}
          >
            <Undo2 className="size-4" />
          </Button>
          <Button
            variant={'outline'}
            size={'none'}
            className="size-9 rounded-r-lg border-l-0 shadow-sm"
            onClick={() => {
              editor?.history.redo()
            }}
          >
            <Redo2 className="size-4" />
          </Button>
        </div>
        {/* {uploadQueue > 0 ? (
          <Loader2 className="my-auto size-4 animate-spin text-muted-foreground opacity-50" />
        ) : (
          <PiCloudCheckSolid className="my-auto size-4 text-muted-foreground opacity-50" />
        )} */}
      </div>
      <div
        ref={ref}
        className="relative m-0 h-full w-full grid-cols-2 grid-rows-2 overflow-clip"
      />
      <div
        className={cn(
          ' relative m-0 flex h-full shrink-0 grow-0 flex-col overflow-hidden transition-all',
          runOpen ? 'w-full border-l md:w-[20rem]' : 'w-0 border-l-0',
        )}
      >
        <div
          className={cn(
            'scrollbar-none w-full overflow-y-scroll border-b p-3 pb-8 md:w-[20rem]',
            resultClassName,
          )}
        >
          {error ? (
            <div className=" flex w-full flex-col justify-center gap-4 p-2 -md:pr-12 md:p-4">
              <div className="flex w-full justify-between">
                <h2 className="font-bold text-destructive text-lg">
                  {error.type === 'graph' ? 'Error' : 'Critical Error'}
                </h2>
                <Button
                  variant={'ghost'}
                  size={'iconSmall'}
                  onClick={() => {
                    error &&
                      error.type === 'graph' &&
                      editor?.editor.clearError(error.location.node)
                    setError(null)
                  }}
                  className="z-40 p-1 text-destructive"
                >
                  <PiCrossCross className="size-4" />
                </Button>
              </div>
              <p className="text-destructive text-sm">{error.message}</p>
            </div>
          ) : (
            result
          )}
        </div>
        <div className="-translate-y-4 z-50 flex h-0 justify-center overflow-visible">
          {/* h-4 -translate-y-4 */}
          <Button
            type="submit"
            className="flex h-8 w-fit gap-2 rounded-full shadow-lg"
            form="editor-form"
          >
            <PiPlayBigStroke className="size-4" /> Simulate
          </Button>
        </div>
        <SimulationForm
          attributes={attributes}
          run={_run}
          action={action}
          id="editor-form"
          error={error}
          setError={setError}
        />
      </div>
    </div>
  )
}
