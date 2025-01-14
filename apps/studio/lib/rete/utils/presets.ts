import {
  ClassicFlow,
  type ConnectionPlugin,
  type Preset,
  getSourceTarget,
} from 'rete-connection-plugin'
import { Connection } from '@/lib/rete/classes/connection'
import type { AreaExtra, Schemes } from '@/types/editor.types'
import type { NodeEditor } from '@/lib/rete/classes/editor'

export function getConnectionPreset(
  editor: NodeEditor,
  connection: ConnectionPlugin<Schemes, AreaExtra>,
): Preset<Schemes> {
  const flow = new ClassicFlow({
    canMakeConnection(from, to) {
      const [source, target] = getSourceTarget(from, to) || [null, null]

      if (!source || !target || from === to || source.nodeId === target.nodeId)
        return false

      const sourceNode = editor.getNode(source.nodeId)
      const targetNode = editor.getNode(target.nodeId)

      if (!sourceNode || !targetNode) return false

      const { sourceOutput, targetInput } = new Connection(
        editor,
        sourceNode,
        source.key as never,
        targetNode,
        target.key as never,
      ).resolveConnectionData()

      if (
        !sourceOutput ||
        !targetInput ||
        !sourceOutput.socket.isCompatibleWith(targetInput.socket)
      ) {
        connection.drop()
        return false
      }
      return Boolean(source && target)
    },

    makeConnection(from, to) {
      const [source, target] = getSourceTarget(from, to) || [null, null]

      if (!source || !target || from === to || source.nodeId === target.nodeId)
        return false

      const sourceNode = editor.getNode(source.nodeId)
      const targetNode = editor.getNode(target.nodeId)

      if (!sourceNode || !targetNode) return false
      if (source && target) {
        editor.addConnection(
          new Connection(
            editor,
            sourceNode,
            source.key as never,
            targetNode,
            target.key as never,
          ),
        )
        return true
      }
      return false
    },
  })
  return () => flow
}

export function accumulateOnShift() {
  let accumulate = false

  function keydown(e: KeyboardEvent) {
    if (e.key === 'Shift') accumulate = true
  }
  function keyup(e: KeyboardEvent) {
    if (e.key === 'Shift') accumulate = false
  }

  document.addEventListener('keydown', keydown)
  document.addEventListener('keyup', keyup)

  return {
    active() {
      return accumulate
    },
    destroy() {
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('keyup', keyup)
    },
  }
}
