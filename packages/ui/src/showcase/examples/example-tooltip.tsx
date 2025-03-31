import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip'
import { Button } from '@repo/ui/components/button'
import { InfoIcon } from 'lucide-react'

export function ExampleTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <InfoIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Helpful information tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
