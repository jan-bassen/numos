import 'server-only'
import { validateValue } from '@repo/shared/validation/validate-value'
import type {
  EngineContext,
  GraphErrorData,
  UnknownErrorData,
} from '@repo/shared/types/engine-types'
import type { Value, ValueFormat, ValueType } from '@repo/shared/types/values'
import type {
  MapGraph,
  MapGraphConnection,
} from '@repo/shared/types/graph-types'
import { resolveObjectArrayValue } from '@repo/shared/schemas/datatypes/utils'
import sharp from 'sharp'
import type { NodeType } from '@repo/shared/types/node-types'
import { nodeLogic } from '@repo/shared/engine/nodes/nodetypes'
import {
  type GraphErrorLocation,
  GraphError,
} from '@repo/shared/errors/graph-error'

export class EngineBase {
  constructor(
    private readonly graph: MapGraph,
    private readonly context: EngineContext,
  ) {}

  getContext() {
    return this.context
  }

  findRootNode() {
    const rootNodes = Object.entries(this.graph).filter(([, node]) => node.root)
    const rootNode = rootNodes[0]
    if (rootNodes.length === 0 || !rootNode)
      throw new Error('No root node found')
    if (rootNodes.length > 1) throw new Error('Multiple root nodes found')
    return rootNode
  }

  getNodeType(nodeId: string): NodeType {
    const type = this.graph[nodeId]?.type
    if (!type) throw new GraphError('Node not found', { node: nodeId })
    return type
  }

  getNodeLogic(nodeId: string) {
    const type = this.getNodeType(nodeId)
    const logic = nodeLogic[type]
    if (!logic) throw new GraphError('Nodetype invalid', { node: nodeId })
    return logic
  }

  getControlValue(
    nodeId: string,
    key: string,
  ): Value<ValueType, 'single' | 'array', false> {
    const value = this.graph[nodeId]?.controls[key]
    if (!value)
      throw new GraphError('Control value not defined', {
        node: nodeId,
        component: { key, type: 'control' },
      })
    try {
      return this.validateAndResolveValue(value)
    } catch (err) {
      if (err instanceof Error) {
        throw new GraphError(err?.message || '', {
          node: nodeId,
          component: { key, type: 'control' },
        })
      }
      throw err
    }
  }

  getInputControlValue(
    nodeId: string,
    key: string,
  ): Value<ValueType, 'single' | 'array', false> {
    const value = this.graph[nodeId]?.inputs[key]?.controlValue
    if (!value)
      throw new GraphError('Control value not defined', {
        node: nodeId,
        component: { key, type: 'input' },
      })
    try {
      return this.validateAndResolveValue(value)
    } catch (err) {
      if (err instanceof Error) {
        throw new GraphError(err?.message || '', {
          node: nodeId,
          component: { key, type: 'input' },
        })
      }
      throw err
    }
  }

  getConnection(
    nodeId: string,
    side: 'input' | 'output',
    key: string,
  ): MapGraphConnection | undefined {
    const node = this.graph[nodeId]
    if (!node) throw new GraphError('Node not found', { node: nodeId })
    if (side === 'input') {
      const input = node.inputs[key]
      if (!input)
        throw new GraphError(`Data input ${key} not found`, {
          node: nodeId,
          component: { key, type: 'input' },
        })
      return input.connection
    }
    return node.forwards[key]
  }

  async getUpload(
    image: string,
    node: string,
  ): Promise<Value<'buffer', 'single'>> {
    const context = this.getContext()
    // Construct Vercel Blob URL
    const blobBaseUrl = process.env.BLOB_BASE_URL || ''
    const path = `uploads/${context.versionId}/${image}`
    const url = `${blobBaseUrl}/${path}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new GraphError(`Error downloading upload: ${response.statusText}`, {
          node,
        })
      }
      const blob = await response.blob()
      const value = await sharp(await blob.arrayBuffer()).toBuffer()
      return {
        type: 'buffer',
        format: 'single',
        value,
      }
    } catch (error) {
      throw new GraphError(
        `Error downloading upload: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { node }
      )
    }
  }

  validateAndResolveValue(value: Value<ValueType, ValueFormat, true>) {
    const { validated, error } = validateValue<false>(value, false)
    if (error) throw new Error(error.message)
    const resolvedValue = resolveObjectArrayValue(validated)
    return resolvedValue
  }

  locateError(error: unknown, location: GraphErrorLocation): GraphError {
    if (error instanceof Error) {
      return new GraphError(error.message, location)
    }
    return new GraphError('Unknown error occured', location)
  }

  serializeError(error: unknown): GraphErrorData | UnknownErrorData {
    if (error instanceof GraphError) {
      return error.serialize()
    }
    if (error instanceof Error) {
      return { type: 'unknown', message: error.message }
    }
    return { type: 'unknown', message: 'Unknown error occured' }
  }
}
