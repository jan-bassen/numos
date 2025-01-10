import type { ConnectionBase, NodeBase } from 'rete'
import type { Node } from './node'
import type { SocketType } from '@/types/database.types'
import type { NodeEditor } from './editor'
import type { SavedConnection } from '@repo/engine/types/graph-types'
import type { OptionalDataType } from '@repo/shared/types/values'
import type { Socket } from '@/lib/rete/classes/connectors/socket'

export class Connection implements ConnectionBase {
  id: ConnectionBase['id']
  source: NodeBase['id']
  target: NodeBase['id']
  type: OptionalDataType
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
    if (!source.hasOutput(sourceOutput)) {
      throw new Error(
        `source node doesn't have output with a key ${String(sourceOutput)}`,
      )
    }
    if (!target.hasInput(targetInput)) {
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
    return this.editor.getNode(this.source)?.getOutput(this.sourceOutput)
  }

  getTargetInput() {
    return this.editor.getNode(this.target)?.getInput(this.targetInput)
  }

  resolveConnectionData() {
    const source = this.editor.getNode(this.source)
    const target = this.editor.getNode(this.target)
    //TODO: Clean this up. Non-connected connections should not be possible
    if (!target && !source && this.editor.hasConnection(this.id)) {
      this.editor.removeConnection(this.id)
    }
    const sourceOutput = source?.getOutput(this.sourceOutput)
    const targetInput = target?.getInput(this.targetInput)
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
    const sourceSocket = sourceNode.getOutput(sourceOutput)?.socket
    return sourceSocket?.type || 'number'
  }
  if (target && targetInput) {
    const targetNode = editor.getNode(target)
    if (!targetNode) return 'number'
    const targetSocket = targetNode.getInput(targetInput)?.socket
    return targetSocket?.type || 'number'
  }
  return 'number'
}
