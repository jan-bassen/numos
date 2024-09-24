import type { ReturnInfo } from '@/types/database.types'
import type {
  AutoSaveFunctions,
  EditorEvents,
  SavedControlMap,
} from '@/types/nodes.types'
import { toast } from 'sonner'
import type { NodeEditor } from './classes/editor'

export function autosaveToEvents(
  autosave: AutoSaveFunctions,
  increaseUploadQueue: () => void,
  decreaseUploadQueue: () => void,
  parentId: string,
  changeSettings?: (
    editor: NodeEditor,
    controls: SavedControlMap,
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
      increaseUploadQueue()
      const res = await autosave.saveNodePosition(id, position)
      if (!res.ok) {
        toast.error(res.message || 'Error saving node position')
      }
      decreaseUploadQueue()
    },
    onNodeRemoved: async (editor, node) => {
      if (!autosave.deleteNode) {
        return
      }
      increaseUploadQueue()
      const res = await autosave.deleteNode(node.id)
      if (!res.ok) {
        await editor?.addNode(node)
        toast.error(res.message || 'Error deleting node')
      }
      decreaseUploadQueue()
    },
    onNodeCreated: async (editor, node) => {
      if (!autosave.uploadNode) {
        return
      }
      increaseUploadQueue()
      const res = await autosave.uploadNode(node, parentId)
      if (!res.ok) {
        await editor?.removeNode(node.id)
        toast.error(res.message || 'Error saving node')
      }
      decreaseUploadQueue()
    },

    onConnectionCreated: async (editor, connection) => {
      if (!autosave.uploadConnection) {
        return
      }
      increaseUploadQueue()
      const res = await autosave.uploadConnection(connection, parentId)
      if (!res.ok) {
        await editor?.removeConnection(connection.id)
        toast.error(res.message || 'Error saving connection')
      }
      decreaseUploadQueue()
    },
    onConnectionRemoved: async (editor, connection) => {
      if (!autosave.deleteConnection) {
        return
      }
      increaseUploadQueue()
      const onlyId = typeof connection === 'string'
      const res = await autosave.deleteConnection(
        onlyId ? connection : connection.id,
      )
      if (!res.ok && !onlyId) {
        await editor?.addConnection(connection)
        toast.error(res.message || 'Error deleting connection')
      }
      decreaseUploadQueue()
    },
    onNodeChanged: async (editor, node) => {
      if (!autosave.updateNode) {
        return
      }
      increaseUploadQueue()
      const res = await autosave.updateNode(node)
      if (!res.ok) {
        toast.error(res.message || 'Error updating control')
      }
      decreaseUploadQueue()
    },
    onRootNodeChanged: async (editor, controls) => {
      if (!changeSettings) {
        return
      }
      increaseUploadQueue()
      const res = await changeSettings(editor, controls)
      if (!res.ok) {
        toast.error(res.message || 'Error updating control')
      }
      decreaseUploadQueue()
    },
  }
}
