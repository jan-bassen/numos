import type { Control as ControlClass } from '@/lib/rete/classes/control'
import { BaseControl } from './base-control'
import { cn } from '@/lib/utils'
import type { RenderEmit } from 'rete-react-plugin'
import type { Schemes } from '@/types/nodes.types'
import { FloatingLabel } from '@repo/ui/components/ui/floating-label'

export default function Control({
  controlKey,
  control,
  emit,
  error,
}: {
  controlKey: string
  control: ControlClass
  emit: RenderEmit<Schemes>
  error: boolean
}) {
  return (
    <div key={controlKey} className="">
      {control.definition?.label && (
        <div
          className={cn(
            // biome-ignore lint/nursery/useSortedClasses: <explanation>
            'inline-block pl-1 align-middle text-2xs leading-3 text-foreground',
            !control.valid && 'text-yellow-500',
            error && 'text-destructive',
          )}
          data-testid="control-title"
        >
          {control.definition.label}
        </div>
      )}
      <BaseControl
        className="block"
        key={controlKey}
        emit={emit}
        payload={control}
      />
    </div>
  )
}
