import type { ConnectionBase, NodeBase } from 'rete'
import type { Node } from './node'
import type { SocketType } from '@/types/database.types'
import type { SavedConnection } from '@/types/nodes.types'
import type { NodeEditor } from './editor'
import type { Socket } from './socket'
import { th } from 'date-fns/locale'

export class Connection implements ConnectionBase {
  id: ConnectionBase['id']
  source: NodeBase['id']
  target: NodeBase['id']
  type: SocketType
  list: boolean
  isPseudo?: boolean
  constructor(
    public editor: NodeEditor,
    source: Node,
    public sourceOutput: string,
    target: Node,
    public targetInput: string,
    id?: string,
  ) {
    if (!(source.outputs as Record<string, any>)[sourceOutput as string]) {
      throw new Error(
        `source node doesn't have output with a key ${String(sourceOutput)}`,
      )
    }
    if (!(target.inputs as Record<string, any>)[targetInput as string]) {
      throw new Error(
        `target node doesn't have input with a key ${String(targetInput)}`,
      )
    }
    this.editor = editor
    this.id = id || crypto.randomUUID()
    this.source = source.id
    this.target = target.id
    this.type = this.resolveType()
    this.list = this.resolveList()
  }

  setTargetInput(inputKey: string) {
    this.targetInput = inputKey
  }

  setSourceOutput(outputKey: string) {
    this.sourceOutput = outputKey
  }

  serialize(): SavedConnection {
    return {
      id: this.id,
      source: this.source,
      target: this.target,
      sourceOutput: this.sourceOutput,
      targetInput: this.targetInput,
      type: this.type,
    }
  }

  getSourceOutput() {
    return this.editor.getNode(this.source)?.outputs[this.sourceOutput]
  }

  getTargetInput() {
    return this.editor.getNode(this.target)?.inputs[this.targetInput]
  }

  resolveConnectionData() {
    const source = this.editor.getNode(this.source)
    if (!source) throw new Error('Source node not found')
    const target = this.editor.getNode(this.target)
    if (!target) throw new Error('Target node not found')
    const sourceOutput = source?.outputs[this.sourceOutput]
    const targetInput = target?.inputs[this.targetInput]
    return {
      source,
      target,
      sourceOutput,
      targetInput,
    }
  }

  resolveType() {
    const { sourceOutput, targetInput } = this.resolveConnectionData()
    const sourceOutputSocket = sourceOutput?.socket as Socket | undefined
    const targetInputSocket = targetInput?.socket as Socket | undefined
    const outputSocketType = sourceOutputSocket?.type
    const inputSocketType = targetInputSocket?.type
    const connectionType =
      outputSocketType && outputSocketType !== 'generic'
        ? outputSocketType
        : inputSocketType && inputSocketType !== 'generic'
          ? inputSocketType
          : 'generic'
    if (!connectionType) {
      throw new Error('No connection type found')
    }
    return connectionType
  }

  resolveList() {
    const { sourceOutput, targetInput } = this.resolveConnectionData()
    const sourceOutputSocket = sourceOutput?.socket as Socket | undefined
    const targetInputSocket = targetInput?.socket as Socket | undefined
    const connectionList = sourceOutputSocket?.list || targetInputSocket?.list
    return connectionList || false
  }
}

export type PseudoConnection = {
  id: string
  isPseudo?: boolean
  source: string
  target: string
  sourceOutput: string
  targetInput: string
}

export function getPseudoConnectionType(
  connection: PseudoConnection,
  editor: NodeEditor,
): SocketType {
  const { source, target, sourceOutput, targetInput } = connection
  if (source && sourceOutput) {
    const sourceNode = editor.getNode(source)
    if (!sourceNode) return 'number'
    const sourceSocket = sourceNode.outputs[sourceOutput]?.socket
    return sourceSocket?.type || 'number'
  }
  if (target && targetInput) {
    const targetNode = editor.getNode(target)
    if (!targetNode) return 'number'
    const targetSocket = targetNode.inputs[targetInput]?.socket
    return targetSocket?.type || 'number'
  }
  return 'number'
}
