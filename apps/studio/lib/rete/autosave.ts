import type { ReturnInfo } from '@/types/database.types'
import type { AutoSaveFunctions, EditorEvents } from '@/types/editor.types'
import { toast } from 'sonner'
import type { NodeEditor } from './classes/editor'
import type { OLDSavedControlMap } from '@repo/engine/types/graph-types'

export function autosaveToEvents(
  autosave: AutoSaveFunctions,
  parentId: string,
  changeSettings?: (
    editor: NodeEditor,
    controls: OLDSavedControlMap,
  ) => Promise<ReturnInfo>,
): EditorEvents {
  return {
    onSelectionChanged: (selection) => {
      if (!autosave.changeSelection) {
        return
      }
      /* console.log("Selection changed", selection); */
    },
    onNodeMoved: async (editor, id, position) => {
      // TODO: find a better way to save multiple nodes at once
      if (!autosave.saveNodePosition) {
        return
      }
      const res = await autosave.saveNodePosition(id, position)
      if (!res.ok) {
        toast.error(res.message || 'Error saving node position')
      }
    },
    onNodeRemoved: async (editor, node) => {
      if (!autosave.deleteNode) {
        return
      }
      const res = await autosave.deleteNode(node.id)
      if (!res.ok) {
        await editor?.addNode(node)
        toast.error(res.message || 'Error deleting node')
      }
    },
    onNodeCreated: async (editor, node) => {
      if (!autosave.uploadNode) {
        return
      }
      const res = await autosave.uploadNode(node, parentId)
      if (!res.ok) {
        await editor?.removeNode(node.id)
        toast.error(res.message || 'Error saving node')
      }
    },

    onConnectionCreated: async (editor, connection) => {
      if (!autosave.uploadConnection) {
        return
      }
      const res = await autosave.uploadConnection(connection, parentId)
      if (!res.ok) {
        await editor?.removeConnection(connection.id)
        toast.error(res.message || 'Error saving connection')
      }
    },
    onConnectionRemoved: async (editor, connection) => {
      if (!autosave.deleteConnection) {
        return
      }
      const onlyId = typeof connection === 'string'
      const res = await autosave.deleteConnection(
        onlyId ? connection : connection.id,
      )
      if (!res.ok && !onlyId) {
        await editor?.addConnection(connection)
        toast.error(res.message || 'Error deleting connection')
      }
    },
    onNodeChanged: async (editor, node) => {
      if (!autosave.updateNode) {
        return
      }
      const res = await autosave.updateNode(node)
      if (!res.ok) {
        toast.error(res.message || 'Error updating control')
      }
    },
    onRootNodeChanged: async (editor, controls) => {
      if (!changeSettings) {
        return
      }
      const res = await changeSettings(editor, controls)
      if (!res.ok) {
        toast.error(res.message || 'Error updating control')
      }
    },
  }
}
