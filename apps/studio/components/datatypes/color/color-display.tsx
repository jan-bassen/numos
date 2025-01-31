import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@repo/ui/components/ui/tooltip'
import { cn } from '@repo/ui/lib/utils'
import type { GenericDisplayProps } from '../generic-display'
import type { Color, OptionalValue } from '@repo/shared/types/values'

export type ColorDisplayProps = Omit<GenericDisplayProps, 'value'> & {
  value: OptionalValue<Color>
}
export default function ColorDisplay({ value, className }: ColorDisplayProps) {
  if (!value) return null
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'h-7 w-16 rounded-lg border border-border shadow-sm',
          className,
        )}
        style={{
          backgroundColor: `rgba(${value.r},${value.g},${value.b},${value.a})`,
        }}
      />
      <TooltipContent>
        {`R: ${value.r}, G: ${value.g}, B: ${value.b}, A: ${value.a}`}
      </TooltipContent>
    </Tooltip>
  )
}
