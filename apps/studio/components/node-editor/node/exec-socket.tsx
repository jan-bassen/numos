import { cn } from '@repo/ui/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip'
import { dataTypes } from '@/lib/supabase/constants/datatypes'
import type { Socket } from '@/lib/rete/classes/connectors/socket'
import { useRef } from 'react'
import { Drag } from 'rete-react-plugin'

export type ExecSocketComponentProps = { data: Socket }

export function ExecSocketComponent(props: ExecSocketComponentProps) {
  const datatype = dataTypes.exec
  const socket = props.data

  return (
    <TooltipProvider>
      <Tooltip>
        <svg
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth={2.5}
          className={cn(
            'z-40 inline-block size-5 rotate-90 stroke-exec align-middle',
            socket.side === 'output' ? 'translate-x-1 ' : '',
          )}
        >
          <title>exec</title>
          <rect
            onPointerDown={(e) => e.stopPropagation()}
            width="24"
            height="24"
            fill="white"
            stroke="none"
            opacity="0"
            cursor="default"
          />
          <TooltipTrigger asChild>
            <path
              className="cursor-pointer fill-grid hover:fill-muted hover:stroke-foreground"
              d="M3,12.759C3,11.742 3,11.233 3.119,10.757C3.224,10.335 3.397,9.933 3.632,9.567C3.897,9.153 4.266,8.804 5.006,8.106L7.606,5.65C9.152,4.19 9.926,3.46 10.807,3.184C11.584,2.941 12.416,2.941 13.193,3.184C14.075,3.459 14.848,4.19 16.394,5.65L18.994,8.106C19.734,8.804 20.104,9.153 20.368,9.566C20.603,9.932 20.776,10.335 20.881,10.757C21,11.233 21,11.742 21,12.759L21,14.6C21,16.84 21,17.96 20.564,18.816C20.181,19.568 19.568,20.181 18.816,20.564C17.96,21 16.84,21 14.6,21L9.4,21C7.16,21 6.04,21 5.184,20.564C4.432,20.181 3.819,19.568 3.436,18.816C3,17.96 3,16.84 3,14.6L3,12.759Z"
            />
          </TooltipTrigger>
        </svg>
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
