import { cn } from '@repo/ui/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip'
import type { OptionalDataType } from '@repo/shared/types/values'
import { dataTypes } from '@/lib/constants/datatypes'
import type { Socket } from '@/lib/rete/classes/connectors/socket'

export type DataSocketComponentProps = { data: Socket }

export function DataSocketComponent(props: DataSocketComponentProps) {
  const socket = props.data
  const datatype = dataTypes[props.data.type as OptionalDataType]
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'z-[9999] box-border inline-block size-4 cursor-pointer border-2 bg-grid align-middle hover:border-foreground hover:bg-muted',
              socket.type ? `border-${socket.type}` : 'border-muted-foreground',
              socket.type === 'generic' && 'border-border-highlight bg-border',
              socket.list ? 'rounded-xmd' : 'rounded-full',
            )}
          />
        </TooltipTrigger>
        <TooltipContent className="space-y-1 py-2.5">
          <h3 className="flex items-center gap-1.5 font-semibold">
            {datatype.icons.stroke({ className: 'size-4' })}
            {datatype.title}
          </h3>
          {datatype.description && (
            <p className="max-w-72 text-left text-sm">{datatype.description}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
