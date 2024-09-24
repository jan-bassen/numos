import { NodeDefinition, Schemes } from '@/types/nodes.types'
import { RenderEmit } from 'rete-react-plugin'
import { Socket } from './socket'
import { SocketType } from '@/types/database.types'
import { cn } from '@/lib/utils'
import { Output as OutputClass } from 'rete/_types/presets/classic'
import { Socket as SocketClass } from '@/lib/rete/classes/socket'

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
  emit: RenderEmit<Schemes>
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
            '!line-clamp-1 max-w-40 text-ellipsis pl-4 align-middle  text-xs text-foreground ',
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
