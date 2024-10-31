import type {
  NodeDefinition,
  SpecificNodeDefinition,
} from '@/types/nodes.types'
import { Socket } from './socket'
import type { SocketType } from '@/types/database.types'
import { cn } from '@repo/ui/lib/utils'
import type { Output as OutputClass } from 'rete/_types/presets/classic'
import type { Socket as SocketClass } from '@/lib/rete/classes/connectors/socket'
import type { RenderEmit } from '@/types/editor.types'

export default function Output({
  socketKey,
  output,
  nodeId,
  nodeDefinition,
  error,
  emit,
}: {
  socketKey: string
  output: OutputClass<SocketClass>
  nodeId: string
  nodeDefinition: NodeDefinition
  error: boolean
  emit: RenderEmit
}) {
  return (
    <div
      className="flex items-center justify-end gap-3"
      key={socketKey}
      data-testid={`output-${socketKey}`}
    >
      {nodeDefinition.componentType !== 'input' && (
        <div
          className={cn(
            '!line-clamp-1 max-w-40 text-ellipsis pl-4 align-middle text-foreground text-xs ',
            error && 'text-destructive',
          )}
          data-testid="output-title"
        >
          {output?.label}
        </div>
      )}
      <Socket
        className={cn(
          '-mr-2 text-right',
          output.socket.name === 'exec' && '-ml-1',
        )}
        side="output"
        type={output.socket.name as SocketType}
        emit={emit}
        socketKey={socketKey}
        nodeId={nodeId}
        payload={output.socket}
      />
    </div>
  )
}
