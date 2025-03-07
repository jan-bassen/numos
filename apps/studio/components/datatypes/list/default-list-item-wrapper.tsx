import { PiCrossCross } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import type { ListInputComponentProps } from './list-input'
import { PiThreeByTwoDotsVertical } from '@repo/ui/icons/pika'
import type { ZodErrorInfo } from '@/types/state.types'
import { Button } from '@repo/ui/components/ui/button'
import ErrorMessage from '@/components/state/error-message'

export function DefaultListItemWrapper<T>({
  id,
  children,
  locked,
  index,
  draggableProps,
  errors,
  remove,
  className,
}: ListInputComponentProps<T> & {
  children: React.ReactNode
  errors?: Array<ZodErrorInfo | undefined>
}) {
  return (
    <div
      key={id}
      className={cn(
        'relative h-10 w-full',
        errors?.[index] && '!h-16',
        className,
      )}
    >
      <div className="flex h-10 w-full items-start">
        {!locked && (
          <div
            className={cn(
              'grid h-full cursor-grab place-items-center rounded-l-md border border-border border-r-0 bg-background px-0.5 text-muted-foreground transition-colors duration-200 hover:bg-muted/10',
              false && 'border-destructive/50 bg-destructive/10',
            )}
          >
            <PiThreeByTwoDotsVertical
              className="size-4 focus:outline-hidden"
              {...draggableProps.attributes}
              {...draggableProps.listeners}
            />
          </div>
        )}
        {children}
      </div>
      {errors?.[index] && (
        <ErrorMessage
          error={errors?.[index].message}
          className={cn('mt-1', !locked && 'ml-6')}
        />
      )}
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
