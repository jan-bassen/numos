import type { Editor } from '@/types/nodes.types'
import { useHotkeys } from 'react-hotkeys-hook'

export const useEditorHotkeys = (editor: Editor | null) => {
  const e = editor?.editor
  const a = editor?.area

  useHotkeys(['delete', 'backspace'], () => {
    const nodeIds = e?.selector.selectedNodes
    if (!nodeIds || nodeIds.length === 0) return
    if (nodeIds[0]) {
      e?.removeSingleNode(nodeIds[0])
      return
    }
    e?.removeMultipleNodes(nodeIds)
  })

  useHotkeys('left', () => {
    if (!a || !e) return
    for (const nodeId of e.selector.selectedNodes) {
      e?.moveNode(a, nodeId, 10, 'left')
    }
  })

  useHotkeys('right', () => {
    if (!a || !e) return
    for (const nodeId of e.selector.selectedNodes) {
      e?.moveNode(a, nodeId, 10, 'right')
    }
  })

  useHotkeys('up', () => {
    if (!a || !e) return
    for (const nodeId of e.selector.selectedNodes) {
      e?.moveNode(a, nodeId, 10, 'up')
    }
  })

  useHotkeys('down', () => {
    if (!a || !e) return
    for (const nodeId of e.selector.selectedNodes) {
      e?.moveNode(a, nodeId, 10, 'down')
    }
  })

  useHotkeys('Shift+d', () => {
    e?.duplicateSelection()
  })

  //Extra check because of qwertz keyboard layout
  useHotkeys('mod+z', (keyEvent, hotkeyEvent) => {
    if (keyEvent.key === 'z') {
      keyEvent.preventDefault()
      editor?.history.undo()
    }
  })

  useHotkeys('mod+y, mod+shift+z', (keyEvent, hotkeyEvent) => {
    if (
      (keyEvent.key === 'y' && !keyEvent.shiftKey) ||
      (keyEvent.key === 'Z' && keyEvent.shiftKey)
    ) {
      keyEvent.preventDefault()
      editor?.history.redo()
    }
  })

  useHotkeys('Shift+r', (e) => {
    editor?.editor.resetView(editor?.area)
  })
}
