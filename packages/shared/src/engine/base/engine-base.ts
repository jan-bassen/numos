import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { nodeLogic } from '@repo/shared/engine/nodes/nodetypes'
import { createSupabaseServiceClient } from '@repo/shared/engine/temp-service-client'
import {
  GraphError,
  type GraphErrorLocation,
} from '@repo/shared/errors/graph-error'
import { resolveObjectArrayValue } from '@repo/shared/schemas/datatypes/utils'
import type {
  EngineContext,
  GraphErrorData,
  UnknownErrorData,
} from '@repo/shared/types/engine-types'
import type {
  MapGraph,
  MapGraphConnection,
} from '@repo/shared/types/graph-types'
import type { NodeType } from '@repo/shared/types/node-types'
import type { Value, ValueFormat, ValueType } from '@repo/shared/types/values'
import { validateValue } from '@repo/shared/validation/validate-value'
import sharp from 'sharp'

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
    const localDemoImage = await this.getLocalDemoUpload(image)
    if (localDemoImage) return localDemoImage

    const context = this.getContext()
    const path = `/${context.versionId}/${image}`

    //TODO: Remove Service Client from Package!
    const supabaseService = await createSupabaseServiceClient()
    console.log('path', path)
    const { data: layer, error } = await supabaseService.storage
      .from('uploads')
      .download(path)

    if (error) {
      console.error(error)
      throw new GraphError(`Error downloading upload: ${error.message}`, {
        node,
      })
    }
    if (!layer /* || layer.type.split('/')[0] !== 'image' */)
      throw new GraphError('Upload is not an image', { node })
    const value = await sharp(await layer.arrayBuffer()).toBuffer()
    return {
      type: 'buffer',
      format: 'single',
      value,
    }
  }

  async getLocalDemoUpload(
    image: string,
  ): Promise<Value<'buffer', 'single'> | undefined> {
    const localImage = image.startsWith('/') ? image.slice(1) : image
    if (!localImage.startsWith('flower/')) return undefined

    const candidates = [
      path.join(process.cwd(), 'public', localImage),
      path.join(process.cwd(), 'apps', 'studio', 'public', localImage),
    ]

    for (const candidate of candidates) {
      try {
        const buffer = await readFile(candidate)
        return {
          type: 'buffer',
          format: 'single',
          value: await sharp(buffer).toBuffer(),
        }
      } catch {
        // Try the next likely workspace root.
      }
    }

    return undefined
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
