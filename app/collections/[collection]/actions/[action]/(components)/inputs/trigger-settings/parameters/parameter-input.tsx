import { Input } from '@repo/ui/components/input'
import { cn } from '@repo/ui/lib/utils'
import { Label } from '@repo/ui/components/label'
import type { ListInputComponentProps } from '@/components/datatypes/list/list-input'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import ErrorMessage from '@/components/state/error-message'
import { PiCrossCross } from '@repo/ui/icons/pika'
import { Button } from '@repo/ui/components/button'
import { PiThreeByTwoDotsVertical } from '@repo/ui/icons/pika'
import { ParameterTypeInput } from './parameter-type-input'
import { ParameterListInput } from './parameter-list-input'
import type { Parameter } from '@/lib/schemas/actions/triggers/api'

export function ParameterInput({
  id,
  index,
  value,
  onChange,
  locked,
  remove,
  draggableProps,
}: ListInputComponentProps<Parameter>) {
  const { getErrorMessage } = useAction()
  const error = getErrorMessage(['trigger', 'settings', 'params', index, 'key'])
  return (
    <div className="relative flex w-full">
      {!locked && (
        <div
          className={cn(
            'grid cursor-grab place-items-center rounded-l-md border border-border border-r-0 bg-background px-0.5 text-muted-foreground transition-colors duration-200 hover:bg-muted/10',
            false && 'border-destructive/50 bg-destructive/10',
          )}
          {...draggableProps.attributes}
          {...draggableProps.listeners}
        >
          <PiThreeByTwoDotsVertical className="size-4 focus:outline-hidden" />
        </div>
      )}
      <div
        className={cn(
          'flex w-full gap-2 rounded-r-md border border-border bg-background px-2 pt-1 pb-2',
          locked && 'rounded-l-md',
        )}
      >
        <div>
          <Label className="pl-1 text-muted-foreground text-xs">Type</Label>
          <ParameterTypeInput
            id={id}
            paramKey={value?.key || ''}
            index={index}
            value={value?.value?.type || null}
            onChange={(v) =>
              onChange({
                ...value,
                value: { ...value?.value, type: v },
              } as Parameter)
            }
            locked={locked}
          />
        </div>
        <div>
          <Label className="pl-1 text-muted-foreground text-xs">List</Label>
          <ParameterListInput
            id={id}
            paramKey={value?.key || ''}
            index={index}
            value={value?.value?.list || null}
            onChange={(v) =>
              onChange({
                ...value,
                value: { ...value?.value, list: v || false },
              } as Parameter)
            }
            locked={locked}
          />
        </div>
        <div className="w-full">
          <Label className="pl-1 text-muted-foreground text-xs">Key</Label>
          <Input
            id={id}
            value={value?.key || ''}
            onChange={(e) =>
              onChange({ ...value, key: e.target.value } as Parameter)
            }
            className={cn('w-full')}
            disabled={locked}
          />
          <ErrorMessage error={error} />
        </div>
        {/* <div>
          <Label className="text-background text-xs">Res.</Label>
          <ParameterRestrictions
            id={id}
            index={index}
            value={value?.value?.restrictions || null}
            onChange={(v) =>
              onChange({
                ...value,
                value: { ...value?.value, restrictions: v },
              } as ParameterInfo)
            }
          />
        </div> */}
      </div>
      {!locked && (
        <Button
          variant={'outline'}
          size={'none'}
          type="button"
          className={cn(
            '-right-1.5 -top-1.5 absolute size-5 shrink-0 items-center justify-center rounded-full',
          )}
          onClick={() => {
            remove()
          }}
        >
          <PiCrossCross className="size-3.5" />
        </Button>
      )}
    </div>
  )
}
