import type { BaseSchemes, ConnectionId, NodeId } from 'rete'
import { type BaseArea, BaseAreaPlugin } from 'rete-area-plugin'
import {
  AddConnectionAction,
  RemoveConnectionAction,
} from './actions/connection'
import { AddNodeAction, DragNodeAction, RemoveNodeAction } from './actions/node'
import type { Action, HistoryPlugin, Preset } from './plugin'
import { NodeEditor } from '../editor'
import type { Area, AreaExtra, Position, Schemes } from '@/types/nodes.types'
import { Area as AreaClass } from '../area/area'
import { AreaPlugin } from '../area/area-plugin'
import type { Node } from '../node'
import type { Connection } from '../connection'

type NodeActions = AddNodeAction | RemoveNodeAction | DragNodeAction

type ConnectionActions = AddConnectionAction | RemoveConnectionAction

export type HistoryActions = NodeActions | ConnectionActions

function trackNodes<S extends BaseSchemes>(
  history: HistoryPlugin<S, NodeActions | Action>,
  props: { timing: number },
) {
  const nodes = new Map<NodeId, Node>()
  const positions = new Map<NodeId, Position>()
  const area = history.parentScope<Area>(AreaPlugin)
  const editor = area.parentScope<NodeEditor>(NodeEditor)
  const timing = props.timing

  //TEST
  area.addPipe((context) => {
    if (context.type === 'nodetranslated') {
      const { id, previous, position } = context.data
    }
    return context
  })

  // eslint-disable-next-line max-statements
  editor.addPipe((context) => {
    if (context.type === 'nodecreated') {
      const { id } = context.data
      history.add(new AddNodeAction(editor, area, id))
      const node = editor.getNode(id)
      if (!node) throw new Error('node')
      nodes.set(id, node)
    }
    if (context.type === 'noderemoved') {
      const node = context.data.serialize()
      const position = positions.get(node.id)

      if (!node) throw new Error('node')
      if (!position) throw new Error(`position${node.id}`)
      history.add(new RemoveNodeAction(editor, node, position))

      positions.delete(node.id)
      nodes.delete(node.id)
    }
    return context
  })
  area.addPipe((context) => {
    if (!('type' in context)) return context

    if (context.type === 'nodetranslated') {
      const { id, position } = context.data
      positions.set(id, position)
    }
    if (context.type === 'nodeviewcreated') {
      const { nodeId, position } = context.data.context
      positions.set(nodeId, position)
    }
    return context
  })

  const picked: string[] = []

  // eslint-disable-next-line max-statements
  area.addPipe((context) => {
    if (!context || typeof context !== 'object' || !('type' in context))
      return context

    if (context.type === 'nodepicked') {
      picked.push(context.data.id)
    }
    if (context.type === 'nodedragged') {
      const index = picked.indexOf(context.data.id)

      if (index >= 0) picked.splice(index, 1)
    }
    if (context.type === 'nodetranslated') {
      const { id, position, previous } = context.data
      const recent = history
        .getRecent(timing)
        .filter(
          (n): n is { time: number; action: DragNodeAction } =>
            n.action instanceof DragNodeAction,
        )
        .filter((n) => n.action.nodeId === id)

      if (recent.length > 1) throw new Error('> 1')

      if (recent[0]) {
        recent[0].action.new = position
        recent[0].time = Date.now()
      } else {
        history.add(new DragNodeAction(area, id, previous))
      }
    }

    return context
  })
}

function trackConnections<S extends BaseSchemes>(
  history: HistoryPlugin<S, ConnectionActions | Action>,
) {
  const connections = new Map<ConnectionId, Connection>()
  const editor = history.parentScope().parentScope<NodeEditor>(NodeEditor)

  editor.addPipe((context) => {
    if (context.type === 'connectioncreated') {
      const connection = editor.getConnection(context.data.id)
      if (!connection) throw new Error('connection')

      history.add(new AddConnectionAction(editor, connection))
      connections.set(context.data.id, connection)
    }
    if (context.type === 'connectionremoved') {
      const connection = connections.get(context.data.id)

      if (connection) {
        history.add(new RemoveConnectionAction(editor, connection))
      }
    }

    return context
  })
}

/**
 * Classic preset for the history plugin. Tracks node adding/removing/translating, connection adding/removing.
 */
export function loadHistoryActions<S extends BaseSchemes>(props?: {
  timing?: number
}): Preset<S, HistoryActions> {
  return {
    connect(history) {
      const timing = props?.timing ?? history.timing * 2

      trackNodes(history, { timing })
      trackConnections(history)
    },
  }
}
