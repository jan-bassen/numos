import { DatetimeInput } from '@/components/datatypes/datetime/datetime-input'
import Segment from '@/components/layouts/segmented/segment'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import type { ActionTrigger } from '@/lib/schemas/actions/action-schema'
import { Label } from '@repo/ui/components/ui/label'
import { SegmentItem } from '@/components/layouts/segmented/segment-item'
import ErrorMessage from '@/components/state/error-message'
import CronInput from '../../cron-input'

//TODO: Add automatic transition to singular and plural unit
export function ScheduleSettings() {
  const {
    action: { locked, trigger },
    getErrorMessage,
    updateAction,
  } = useAction()
  if (trigger?.type !== 'schedule') return null
  const errors = {
    root: getErrorMessage(['trigger', 'settings']),
    start: getErrorMessage(['trigger', 'settings', 'start']),
    end: getErrorMessage(['trigger', 'settings', 'end']),
    schedule: getErrorMessage(['trigger', 'settings', 'schedule']),
  }
  return (
    <Segment
      title="Schedule Settings"
      info={{
        description: 'Define the details of the schedule trigger.',
      }}
    >
      <div className="flex gap-3 ">
        <SegmentItem>
          <Label htmlFor="start">Start</Label>
          <DatetimeInput
            id="start"
            value={{
              type: 'datetime',
              format: 'single',
              value: trigger.settings.start,
            }}
            onChange={async (v) => {
              await updateAction({
                trigger: {
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    start: v.value,
                  },
                } as ActionTrigger,
              })
            }}
            valid={!errors.start && !errors.root}
            type="datetime"
            locked={locked}
          />
          <ErrorMessage error={errors.start} />
        </SegmentItem>
        <SegmentItem>
          <Label htmlFor="end">End</Label>
          <DatetimeInput
            id="end"
            value={{
              type: 'datetime',
              format: 'single',
              value: trigger.settings.end,
            }}
            onChange={async (v) => {
              await updateAction({
                trigger: {
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    end: v.value,
                  },
                } as ActionTrigger,
              })
            }}
            valid={!errors.end && !errors.root}
            type="datetime"
            locked={locked}
          />
          <ErrorMessage error={errors.end} />
        </SegmentItem>
      </div>
      <SegmentItem>
        <Label htmlFor="schedule">Schedule</Label>
        <CronInput
          id="schedule"
          button={{
            className: 'w-full flex !max-w-full',
            variant: 'outline',
            size: 'form',
            disabled: locked,
          }}
          valid={!errors.schedule && !errors.root}
          input={{ disabled: locked }}
          value={trigger.settings.schedule}
          onChange={(v) => {
            updateAction({
              trigger: {
                ...trigger,
                settings: { ...trigger.settings, schedule: v },
              } as ActionTrigger,
            })
          }}
        />
        <ErrorMessage error={errors.schedule} />
      </SegmentItem>
      <ErrorMessage error={errors.root} />
    </Segment>
  )
}
