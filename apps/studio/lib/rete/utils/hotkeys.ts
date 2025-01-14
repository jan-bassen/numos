import type { Editor } from '@/types/editor.types'
import { type Keys, useHotkeys } from 'react-hotkeys-hook'
import type {
  HotkeysEvent,
  OptionsOrDependencyArray,
} from 'react-hotkeys-hook/dist/types'

type HotkeyEvents = {
  keyboardEvent: KeyboardEvent
  hotkeysEvent: HotkeysEvent
}
type EditorHotkeyConfig = {
  keys: Keys
  handler: (editor: Editor, events: HotkeyEvents) => void
  options?: OptionsOrDependencyArray
  dependencies?: OptionsOrDependencyArray
}

const editorHotkeys: EditorHotkeyConfig[] = [
  {
    keys: ['delete', 'backspace'],
    handler: ({ editor }) => {
      editor?.deleteSelection()
    },
  },
  {
    keys: 'left',
    handler: ({ editor, area }) => {
      if (!area || !editor) return
      editor?.moveSelection(area, 10, 'left')
    },
  },
  {
    keys: 'right',
    handler: ({ editor, area }) => {
      if (!area || !editor) return
      editor?.moveSelection(area, 10, 'right')
    },
  },
  {
    keys: 'up',
    handler: ({ editor, area }) => {
      if (!area || !editor) return
      editor.moveSelection(area, 10, 'up')
    },
  },
  {
    keys: 'down',
    handler: ({ editor, area }) => {
      if (!area || !editor) return
      editor.moveSelection(area, 10, 'down')
    },
  },
  {
    keys: 'shift+d',
    handler: ({ editor }) => {
      editor?.duplicateSelection()
    },
  },
  {
    keys: 'mod+z',
    handler: ({ history }, { keyboardEvent }) => {
      if (keyboardEvent.key === 'z') {
        keyboardEvent.preventDefault()
        history.undo()
      }
    },
  },
  {
    keys: 'mod+y, mod+shift+z',
    handler: ({ history }, { keyboardEvent }) => {
      if (
        (keyboardEvent.key === 'y' && !keyboardEvent.shiftKey) ||
        (keyboardEvent.key === 'Z' && keyboardEvent.shiftKey)
      ) {
        keyboardEvent.preventDefault()
        history.redo()
      }
    },
  },
  {
    keys: 'shift+r',
    handler: ({ editor, area }) => {
      editor?.resetView(area)
    },
  },
]

export const useEditorHotkeysBeta = (editor: Editor | null) => {
  if (!editor) return
  for (const config of editorHotkeys) {
    useHotkeys(
      config.keys,
      (keyboardEvent, hotkeysEvent) =>
        config.handler(editor, { keyboardEvent, hotkeysEvent }),
      config.options,
      config.dependencies,
    )
  }
}

export const useEditorHotkeys = (editor: Editor | null) => {
  const e = editor?.editor
  const a = editor?.area

  useHotkeys(['delete', 'backspace'], () => {
    e?.deleteSelection()
  })

  useHotkeys('left', () => {
    if (!a || !e) return
    e?.moveSelection(a, 10, 'left')
  })

  useHotkeys('right', () => {
    if (!a || !e) return
    for (const nodeId of e.selector.selectedNodes) {
      e?.moveSelection(a, 10, 'right')
    }
  })

  useHotkeys('up', () => {
    if (!a || !e) return
    e?.moveSelection(a, 10, 'up')
  })

  useHotkeys('down', () => {
    if (!a || !e) return
    e?.moveSelection(a, 10, 'down')
  })

  useHotkeys('Shift+d', () => {
    e?.duplicateSelection()
  })

  useHotkeys('mod+z', (keyEvent) => {
    //Extra check because of qwertz keyboard layout
    if (keyEvent.key === 'z') {
      keyEvent.preventDefault()
      editor?.history.undo()
    }
  })

  useHotkeys('mod+y, mod+shift+z', (keyEvent) => {
    //Extra check because of qwertz keyboard layout
    if (
      (keyEvent.key === 'y' && !keyEvent.shiftKey) ||
      (keyEvent.key === 'Z' && keyEvent.shiftKey)
    ) {
      keyEvent.preventDefault()
      editor?.history.redo()
    }
  })

  useHotkeys('Shift+r', () => {
    editor?.editor.resetView(editor?.area)
  })
}
