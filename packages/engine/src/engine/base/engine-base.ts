import { validateValue } from '@repo/engine/datatypes/validation'
import type {
  EngineContext,
  GraphErrorData,
  NodeErrorData,
  UnknownErrorData,
} from '@repo/engine/types/engine-types'
import type {
  Value,
  ValueFormat,
  ValueType,
} from '@repo/engine/types/value-types'
import type {
  MapGraph,
  MapGraphConnection,
  MapGraphNode,
} from '@repo/engine/types/graph-types'
import { resolveObjectArrayValue } from '@repo/engine/datatypes/utils'
import { createSupabaseServiceClient } from '@repo/engine/storage/service-client'
import sharp from 'sharp'
import type { NodeType } from '@repo/engine/types/node-types'
import { nodeLogic } from '@repo/engine/nodes/nodetypes'
import { GraphError } from '@repo/engine/errors/graph-error'

export class EngineBase {
  constructor(
    private readonly graph: MapGraph,
    private readonly context: EngineContext,
    private readonly mode: 'simulation' | 'application',
    private readonly type: 'data' | 'execution',
  ) {}

  getContext() {
    return this.context
  }

  findRootNode() {
    const rootNodes = Object.entries(this.graph).filter(
      ([key, node]) => node.root,
    )
    const rootNode = rootNodes[0]
    if (rootNodes.length === 0 || !rootNode)
      throw new Error('No root node found')
    if (rootNodes.length > 1) throw new Error('Multiple root nodes found')
    return rootNode
  }

  getNodeType(nodeId: string): NodeType {
    const type = this.graph[nodeId]?.type
    if (!type) throw new Error(`Node ${nodeId} not found`)
    return type
  }

  getNodeLogic(nodeId: string) {
    const type = this.getNodeType(nodeId)
    const logic = nodeLogic[type]
    if (!logic) throw new Error(`Nodetype ${type} invalid`)
    return logic
  }

  getControlValue(
    nodeId: string,
    key: string,
  ): Value<ValueType, 'single' | 'array', false> {
    const value = this.graph[nodeId]?.controls[key]
    if (!value) throw new Error(`Control value ${key} not found`)
    return this.validateAndResolveValue(value)
  }

  getInputControlValue(
    nodeId: string,
    key: string,
  ): Value<ValueType, 'single' | 'array', false> {
    const value = this.graph[nodeId]?.inputs[key]?.controlValue
    if (!value) throw new Error(`Control value ${key} not found`)
    return this.validateAndResolveValue(value)
  }

  getConnection(
    nodeId: string,
    side: 'input' | 'output',
    key: string,
  ): MapGraphConnection | undefined {
    const node = this.graph[nodeId]
    if (!node) throw new Error(`Node ${nodeId} not found`)
    if (side === 'input') {
      const input = node.inputs[key]
      if (!input) throw new Error(`Data input ${key} not found`)
      return input.connection
    }
    return node.forwards[key]
  }

  async getLayer(image: string): Promise<Value<'buffer', 'single'>> {
    const context = this.getContext()
    const path = `/${context.collectionId}/${image}`

    //TODO: Remove Service Client from Package!
    const supabaseService = await createSupabaseServiceClient()
    const { data: layer, error } = await supabaseService.storage
      .from('layers')
      .download(path)
    if (error) {
      throw new Error('Error downloading layer')
    }
    if (!layer || layer.type.split('/')[0] !== 'image')
      throw new Error('Layer is not an image')
    const value = await sharp(await layer.arrayBuffer()).toBuffer()
    return {
      type: 'buffer',
      format: 'single',
      value,
    }
  }

  validateAndResolveValue(value: Value<ValueType, ValueFormat, true>) {
    const { validated, error } = validateValue<false>(value, false)
    if (error) throw new Error(error.message)
    const resolvedValue = resolveObjectArrayValue(validated)
    return resolvedValue
  }

  serializeError(error: unknown): GraphErrorData | UnknownErrorData {
    if (error instanceof GraphError) {
      return error.serialize()
    }
    if (error instanceof Error) {
      return { type: 'unknown', message: error.message }
    }
    return { type: 'unknown', message: 'Completely unknown error occured' }
  }
}
