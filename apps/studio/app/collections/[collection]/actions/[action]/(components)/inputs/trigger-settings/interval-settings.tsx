import { DatetimeInput } from '@/components/datatypes/datetime/datetime-input'
import Segment from '@/components/layouts/segmented/segment'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import type { ActionTrigger } from '@/types/actions.types'
import { Label } from '@repo/ui/components/ui/label'
import { SegmentItem } from '@/components/layouts/segmented/segment-item'
import ErrorMessage from '@/components/state/error-message'
import { NumberInput } from '@/components/datatypes/number/number-input'
import { EnumInput } from '@/components/datatypes/enum/enum-input'
import { intervalUnitOptions } from '@/lib/constants/triggers'

//TODO: Add automatic transition to singular and plural unit
export function IntervalSettings() {
  const {
    action: { locked, trigger },
    getErrorMessage,
    updateAction,
  } = useAction()
  if (trigger?.type !== 'interval') return null
  const errors = {
    root: getErrorMessage(['trigger', 'settings']),
    start: getErrorMessage(['trigger', 'settings', 'start']),
    end: getErrorMessage(['trigger', 'settings', 'end']),
  }
  return (
    <Segment
      title="Interval Settings"
      info={{
        description: 'Define the details of the interval trigger.',
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
      <div className="flex gap-3">
        <SegmentItem>
          <Label htmlFor="interval">Interval</Label>
          <NumberInput
            value={{
              type: 'number',
              format: 'single',
              value: trigger.settings.interval,
            }}
            onChange={async (v) => {
              await updateAction({
                trigger: {
                  ...trigger,
                  settings: { ...trigger.settings, interval: v.value },
                } as ActionTrigger,
              })
            }}
            type="number"
            locked={locked}
            className="w-full"
          />
        </SegmentItem>
        <SegmentItem className="w-44">
          <Label htmlFor="unit">Unit</Label>
          <EnumInput
            restrictions={{
              options: intervalUnitOptions,
            }}
            value={{
              type: 'enum',
              format: 'single',
              value: trigger.settings.unit,
            }}
            onChange={async (v) => {
              await updateAction({
                trigger: {
                  ...trigger,
                  settings: { ...trigger.settings, unit: v.value },
                } as ActionTrigger,
              })
            }}
            type="enum"
            locked={locked}
          />
        </SegmentItem>
      </div>
      <ErrorMessage error={errors.root} />
    </Segment>
  )
}
