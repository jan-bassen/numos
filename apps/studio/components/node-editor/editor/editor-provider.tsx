import type { Editor, EditorSettings } from '@/types/editor.types'
import type {
  GraphErrorData,
  SimulationData,
} from '@repo/shared/types/engine-types'
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
} from 'react'

export type EditorContextType = {
  editor: Editor | null
  execute: (data: SimulationData) => Promise<void>
  settings: EditorSettings
  setSettings: Dispatch<SetStateAction<EditorSettings>>
  zoom: string
  setZoom: Dispatch<SetStateAction<string>>
  result: ReactNode | null
  resetResult: () => void
  error: GraphErrorData | null
  setError: Dispatch<SetStateAction<GraphErrorData | null>>
}

export const EditorContext = createContext<EditorContextType | null>(null)

export default function EditorProvider({
  children,
  context,
}: {
  children: ReactNode
  context: EditorContextType | null
}) {
  return (
    <EditorContext.Provider value={context}>{children}</EditorContext.Provider>
  )
}

export function useEditorContext() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorContext must be used within a EditorProvider.')
  }
  return context
}
