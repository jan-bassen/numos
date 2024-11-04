import type { Connection } from '../connection'
import type { Node } from '../node'
import type {
  AnyDataSocketDefinition,
  ExecSocketDefinition,
} from '@/types/nodes.types'
import { Socket } from './socket'

export class Output {
  id: string
  label: string
  socket: Socket
  multipleConnections: boolean
  constructor(
    public node: Node,
    public definition:
      | AnyDataSocketDefinition<'outputs'>
      | ExecSocketDefinition,
    connection?: Connection,
  ) {
    this.id = crypto.randomUUID()
    this.label = definition.label
    this.multipleConnections = definition.type !== 'exec'
    this.socket = new Socket('output', definition, node, connection)
  }
}
