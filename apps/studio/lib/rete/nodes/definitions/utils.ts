import type { SocketType } from '@/types/database.types'
import type {
  EnumSocketDefinition,
  Inputs,
  SelectOptions,
} from '@/types/nodes.types'

export function getTypeFromTwoInputConnections(
  inputs: Inputs,
  key1: string,
  key2: string,
) {
  const con1 = inputs[key1]?.socket?.connection
  const con2 = inputs[key2]?.socket?.connection
  const type =
    con1?.type !== 'generic' && con1?.type
      ? con1?.type
      : con2?.type || 'generic'
  const list = con1?.list || con2?.list
  let options: SelectOptions | undefined
  if (type === 'enum') {
    const con = con1 || con2
    if (con && con.type === 'enum') {
      const { sourceOutput } = con.resolveConnectionData()
      const socketDef = sourceOutput?.socket.definition as EnumSocketDefinition
      options = socketDef.options
    }
  }
  return { type, list, options }
}

export function getTypeFromInputConnections(
  inputs: Inputs,
  keys: string[],
): {
  type: SocketType
  list: boolean
  options?: SelectOptions
} {
  for (const key of keys) {
    const con = inputs[key]?.socket.connection
    if (con && con.type === 'enum') {
      const { sourceOutput } = con.resolveConnectionData()
      const socketDef = sourceOutput?.socket.definition as EnumSocketDefinition
      return {
        type: 'enum' as SocketType,
        list: false,
        options: socketDef.options,
      }
    }
    if (con?.type && con.type !== 'generic') {
      return { type: con.type, list: con.list }
    }
  }
  return { type: 'generic' as SocketType, list: false }
}
