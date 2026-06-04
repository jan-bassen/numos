import { Button, type ButtonProps } from '@repo/ui/components/button'
import { Input, type InputProps } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover'
import { Textarea } from '@repo/ui/components/textarea'
import { cn } from '@repo/ui/lib/utils'

export type CronObject = {
  schedule?: string
  description?: string
}

export type CronInputProps = {
  id?: string
  button: ButtonProps
  input: InputProps
  value?: CronObject
  valid?: boolean
  onChange: (value?: CronObject) => void
}

export default function CronInput({
  id,
  value,
  onChange,
  button,
  input,
  valid,
}: CronInputProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          {...button}
          className={cn(
            'h-13 flex-col py-1',
            valid === false && 'border-destructive text-destructive',
            button.className,
          )}
        >
          {value?.schedule ? (
            value.description ? (
              <>
                <h3 className="font-semibold">{value.schedule}</h3>
                <p className="text-muted-foreground text-sm italic">
                  {value.description || 'No description provided'}
                </p>
              </>
            ) : (
              value.schedule
            )
          ) : (
            'Define Schedule'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-h-64 space-y-2 p-3">
        <div className="space-y-0.5">
          <Label
            htmlFor="cron-schedule"
            className="pl-0.5 text-muted-foreground text-sm"
          >
            Cron-Schedule
          </Label>
          <Input
            id="cron-schedule"
            {...input}
            onChange={(e) =>
              onChange({
                schedule: e.target.value,
                description: value?.description,
              })
            }
            value={value?.schedule}
            placeholder="0 0 * * * *"
          />
        </div>
        <div className="space-y-0.5">
          <Label
            htmlFor="cron-description"
            className="pl-0.5 text-muted-foreground text-sm"
          >
            Description
          </Label>
          <Textarea
            id="cron-description"
            className="min-h-16"
            onChange={(e) =>
              onChange({
                schedule: value?.schedule,
                description: e.target.value,
              })
            }
            value={value?.description}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
