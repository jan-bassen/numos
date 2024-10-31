import type { Connection } from '../connection'
import type { Node } from '../node'
import type { AnyDataSocketDefinition } from '@/types/nodes.types'
import { Socket } from './socket'

export class Output {
  id: string
  label: string
  socket: Socket

  constructor(
    public node: Node,
    public definition: AnyDataSocketDefinition<'outputs'>,
    connection?: Connection,
  ) {
    this.id = crypto.randomUUID()
    this.label = definition.label
    this.socket = new Socket('output', definition, node, connection)
  }
}
