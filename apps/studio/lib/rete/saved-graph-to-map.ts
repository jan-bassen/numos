import { resolveObjectArrayValue } from '@repo/shared/schemas/datatypes/utils'
import type {
  MapGraph,
  MapGraphConnection,
  MapGraphDataInput,
  SavedGraph,
} from '@repo/shared/types/graph-types'
import type { Value, ValueFormat, ValueType } from '@repo/shared/types/values'

export function savedGraphToMapGraph(graph: SavedGraph): MapGraph {
  return graph.nodes.reduce<MapGraph>((accumulator, node) => {
    const dataConnections = graph.connections.filter(
      (connection) =>
        connection.target === node.id && connection.type !== 'exec',
    )
    const execConnections = graph.connections.filter(
      (connection) =>
        connection.source === node.id && connection.type === 'exec',
    )

    const inputs = Object.entries(node.state?.inputs ?? {}).reduce<
      Record<string, MapGraphDataInput>
    >((inputAccumulator, [key, value]) => {
      inputAccumulator[key] = {
        controlValue: resolveObjectArrayValue(
          value as Value<ValueType, ValueFormat, true>,
        ),
      }
      return inputAccumulator
    }, {})

    for (const connection of dataConnections) {
      inputs[connection.targetInput] = {
        ...inputs[connection.targetInput],
        connection: {
          connectionId: connection.id,
          node: connection.source,
          key: connection.sourceOutput,
        },
      }
    }

    const controls = Object.entries(node.state?.controls ?? {}).reduce<
      Record<string, Value<ValueType, 'single' | 'array', true>>
    >((controlAccumulator, [key, value]) => {
      controlAccumulator[key] = resolveObjectArrayValue(
        value as Value<ValueType, ValueFormat, true>,
      )
      return controlAccumulator
    }, {})

    const forwards = execConnections.reduce<Record<string, MapGraphConnection>>(
      (forwardAccumulator, connection) => {
        forwardAccumulator[connection.sourceOutput] = {
          connectionId: connection.id,
          node: connection.target,
          key: connection.targetInput,
        }
        return forwardAccumulator
      },
      {},
    )

    accumulator[node.id] = {
      id: node.id,
      type: node.type,
      root: node.type === 'action-root' || node.type === 'image-root',
      inputs,
      controls,
      forwards,
    }

    return accumulator
  }, {})
}
