import type { NodeId } from 'rete'
import type { Side } from 'rete-connection-plugin'
import type { Socket as SocketClass } from '@/lib/rete/classes/connectors/socket'
import type { OptionalDataType } from '@repo/engine/types/value-types'
import { ExecSocketComponent } from './exec-socket'
import { DataSocketComponent } from './data-socket'
import { RefComponent } from '../ref-component'
import type { RenderEmit } from '@/types/editor.types'

export declare type SocketProps = {
  className: string
  emit: RenderEmit
  side: Side
  nodeId: NodeId
  socketKey: string
  payload: SocketClass
  type: OptionalDataType
}

export function Socket({
  className,
  emit,
  nodeId,
  side,
  socketKey,
  payload,
  ...props
}: SocketProps) {
  return (
    <RefComponent
      {...props}
      className={`${className} [&>span]:flex [&>span]:flex-col [&>span]:items-center`}
      init={(ref) =>
        emit({
          type: 'render',
          data: {
            type: 'socket',
            side,
            key: socketKey,
            nodeId,
            element: ref,
            payload: payload,
          },
        })
      }
      unmount={(ref) => emit({ type: 'unmount', data: { element: ref } })}
    />
  )
}

export function getSocket(props: SocketProps) {
  const type = props.payload.type as OptionalDataType
  if (type === 'exec') {
    return ExecSocketComponent
  }
  return DataSocketComponent
}
