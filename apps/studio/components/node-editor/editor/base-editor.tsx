import { createEditor } from '@/lib/rete/create-editor'
import { useEditorHotkeys } from '@/lib/rete/utils/hotkeys'
import type { ReturnInfo } from '@/types/database.types'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from 'react'

import type { SimulationCheck } from '@/lib/errors'
import { useEditor } from '@/lib/rete/use-editor'
import type {
  AutoSaveFunctions,
  Editor,
  EditorConfig,
  EditorContext,
  EditorSettings,
} from '@/types/editor.types'
import type {
  OLDSavedControlMap,
  SavedGraph,
} from '@repo/shared/types/graph-types'
import { autosaveToEvents } from '@/lib/rete/autosave'
import type { NodeEditor } from '@/lib/rete/classes/editor'
import type { ZoomEventParams } from '@/lib/rete/classes/area/area'
import Decimal from 'decimal.js'
import type {
  GraphErrorData,
  SimulationData,
} from '@repo/shared/types/engine-types'
import RunSidebar from '@/components/node-editor/run-sidebar/run-sidebar'
import EditorInterface from '@/components/node-editor/interface/editor-interface'
import EditorProvider from '@/components/node-editor/editor/editor-provider'
import { useSecondarySidebar } from '@repo/ui/components/sidebar-secondary'

//TODO: Clean up
export default function BaseEditor({
  parentId,
  initialGraph,
  context,
  config,
  result,
  resetResult,
  run,
  autosave,
  changeSettings,
  resultClassName,
  parentUrl,
}: {
  parentId: string
  initialGraph: SavedGraph
  context: EditorContext
  config: EditorConfig
  result: ReactNode
  resetResult: () => void
  run: (editor: Editor | null, data: SimulationData) => Promise<SimulationCheck>
  autosave: AutoSaveFunctions
  changeSettings?: (
    editor: NodeEditor,
    controls: OLDSavedControlMap,
  ) => Promise<ReturnInfo>
  resultClassName?: string
  parentUrl?: string
}) {
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSecondarySidebar()
  const [zoom, setZoom] = useState('100%')
  const [error, _setError] = useState<GraphErrorData | null>(null)

  const setError: Dispatch<SetStateAction<GraphErrorData | null>> = (
    value:
      | GraphErrorData
      | null
      | ((prevState: GraphErrorData | null) => GraphErrorData | null),
  ) => {
    const oldError = error
    _setError(value)
    if (oldError) {
      const { node } = oldError.location
      editor?.editor.clearError(node)
    }
  }

  const [settings, setSettings] = useState<EditorSettings>({
    mode: 'select',
    shape: 'marquee',
    input: 'mouse',
  })

  useEffect(() => {
    const localSettings = localStorage.getItem('node-editor-settings')
    if (localSettings) {
      setSettings(JSON.parse(localSettings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('node-editor-settings', JSON.stringify(settings))
    editor?.editor.applySettings(settings)
  }, [settings])

  const autosaveEvents = autosaveToEvents(autosave, parentId, changeSettings)

  const events = {
    ...autosaveEvents,
    onZoomed: (editor: NodeEditor, params: ZoomEventParams) => {
      const zoom = new Decimal(params.zoom * 100).toDecimalPlaces(0).toString()
      setZoom(`${zoom}%`)
    },
  }

  const [editorRef, editor] = useEditor<Editor>((container: HTMLElement) => {
    return createEditor(
      container,
      config,
      context,
      settings,
      events,
      initialGraph,
    )
  })

  async function execute(data: SimulationData) {
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

  //TODO: Add to hook
  useHotkeys('Shift+e', (e) => {
    setSidebarOpen(!sidebarOpen)
  })

  useHotkeys('Shift+enter', (e) => {
    setSidebarOpen(true)
  })

  return (
    <EditorProvider
      context={{
        editor,
        execute,
        settings,
        setSettings,
        zoom,
        setZoom,
        result,
        resetResult,
        error,
        setError,
      }}
    >
      <div className="relative flex h-full w-full max-w-full">
        <div ref={editorRef} className="size-full" />
        <EditorInterface parentUrl={parentUrl} editor={editor} zoom={zoom} />
        <RunSidebar resultClassName={resultClassName} />
      </div>
    </EditorProvider>
  )
}
