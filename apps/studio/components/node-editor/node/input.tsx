import type { Input as InputClass } from '@/lib/rete/classes/connectors/input'
import { Socket } from './socket'
import type { SocketType } from '@/types/database.types'
import Control from './control'
import { cn } from '@repo/ui/lib/utils'
import { Separator } from '@repo/ui/components/ui/separator'
import type { RenderEmit } from '@/types/editor.types'

export default function Input({
  socketKey,
  input,
  nodeId,
  error,
  emit,
}: {
  socketKey: string
  input: InputClass
  nodeId: string
  error: boolean
  emit: RenderEmit
}) {
  return (
    <>
      <div
        className="flex items-center gap-3 text-left"
        key={socketKey}
        data-testid={`input-${socketKey}`}
      >
        <Socket<'data'>
          className={cn(
            '-ml-2 inline-block text-left',
            input.socket.name === 'exec' && '-mr-1',
          )}
          emit={emit}
          side="input"
          type={input.socket.name as SocketType}
          socketKey={socketKey}
          nodeId={nodeId}
          payload={input.socket}
        />
        {input?.control && input?.showControl && !input.socket.connected && (
          <div className="flex w-full flex-col gap-0.5 pr-3">
            <div
              className={cn(
                'inline-block pl-1 align-middle text-2xs text-foreground leading-3',
                error && 'text-destructive',
              )}
              data-testid="input-title"
            >
              {input?.label}
            </div>
            <Control
              key={`${socketKey}-control`}
              controlKey={socketKey}
              control={input.control}
              emit={emit}
              error={error}
            />
          </div>
        )}
      </div>
      {input?.definition.dividerAfter && (
        <div className="max-w-40 px-5 py-0.5">
          <Separator />
        </div>
      )}
    </>
  )
}
