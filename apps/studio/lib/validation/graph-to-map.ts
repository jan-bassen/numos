import { resolveObjectArrayValue } from '@repo/shared/schemas/datatypes/utils'
import type {
  MapGraph,
  MapGraphConnection,
  MapGraphDataInput,
  MapGraphNode,
  SavedConnection,
  SavedGraph,
  SavedNode,
} from '@repo/shared/types/graph-types'
import type { NodeType } from '@repo/shared/types/node-types'
import type { Value, ValueType } from '@repo/shared/types/values'

export function getMapGraph(graph: SavedGraph): MapGraph {
  return graph.nodes.reduce<MapGraph>((acc, node) => {
    const mapGraphNode = nodeToMapGraphNode(node, graph.connections)
    acc[node.id] = mapGraphNode
    return acc
  }, {})
}

function nodeToMapGraphNode(
  node: SavedNode,
  connections: SavedConnection[],
): MapGraphNode {
  //TODO: Make this check better
  const root = node.type === 'action-root' || node.type === 'image-root'

  const inputs = node.inputs
    ? Object.entries(node.inputs).reduce<Record<string, MapGraphDataInput>>(
        (accumulator, [key, input]) => {
          if (!input) return accumulator
          const unresolvedValue = node.state?.inputs?.[key]
          if (!unresolvedValue) return accumulator
          const resolvedValue = resolveObjectArrayValue(unresolvedValue)
          const connection = connections.find(
            (c) => c.source === node.id && c.sourceOutput === key,
          )
          accumulator[key] = {
            controlValue: resolvedValue,
            connection: connection
              ? {
                  connectionId: connection.id,
                  node: connection.source,
                  key: connection.sourceOutput,
                }
              : undefined,
          }
          return accumulator
        },
        {},
      )
    : {}

  const controls = node.controls
    ? Object.entries(node.controls).reduce<
        Record<string, Value<ValueType, 'single' | 'array', true>>
      >((accumulator, [key, control]) => {
        if (!control) return accumulator
        const unresolvedValue = node.state?.controls?.[key]
        if (!unresolvedValue) return accumulator
        const resolvedValue = resolveObjectArrayValue(unresolvedValue)
        accumulator[key] = resolvedValue
        return accumulator
      }, {})
    : {}

  const forwards = node.outputs
    ? Object.entries(node.outputs).reduce<Record<string, MapGraphConnection>>(
        (accumulator, [key, output]) => {
          const connection = connections.find(
            (c) => c.target === node.id && c.targetInput === key,
          )
          if (!connection) return accumulator
          accumulator[key] = {
            connectionId: connection.id,
            node: connection.target,
            key: connection.targetInput,
          }
          return accumulator
        },
        {},
      )
    : {}

  return {
    id: node.id,
    type: node.type as NodeType,
    root,
    inputs,
    controls,
    forwards,
  }
}
