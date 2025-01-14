import { DatetimeInput } from '@/components/datatypes/datetime/datetime-input'
import Segment from '@/components/layouts/segmented/segment'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import type { ActionTrigger } from '@/lib/schemas/actions/action-schema'
import { Label } from '@repo/ui/components/ui/label'
import { SegmentItem } from '@/components/layouts/segmented/segment-item'
import ErrorMessage from '@/components/state/error-message'
import CronInput from '../../cron-input'
import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import {
  PiCalendarDefaultStroke,
  PiClockDefaultStroke,
} from '@repo/ui/icons/pika'
import { intervalUnitOptions } from '@/lib/constants/triggers'
import { NumberInput } from '@/components/datatypes/number/number-input'
import { EnumInput } from '@/components/datatypes/enum/enum-input'

//TODO: Add automatic transition to singular and plural unit
export function TimeSettings() {
  const {
    action: { locked, trigger },
    getErrorMessage,
    updateAction,
  } = useAction()
  if (trigger?.type !== 'time') return null
  const errors = {
    root: getErrorMessage(['trigger', 'settings']),
    start: getErrorMessage(['trigger', 'settings', 'start']),
    end: getErrorMessage(['trigger', 'settings', 'end']),
    schedule: getErrorMessage(['trigger', 'settings', 'schedule']),
    interval: getErrorMessage(['trigger', 'settings', 'interval']),
    unit: getErrorMessage(['trigger', 'settings', 'unit']),
  }
  return (
    <>
      <Segment
        title="Time Frame"
        info={{
          description:
            'Define the start and end time of the time trigger. It will only trigger between these times.',
        }}
      >
        <SegmentItem className="">
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
        <SegmentItem className="">
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
      </Segment>
      <Segment
        title="Schedule"
        info={{
          description:
            'Define the schedule of the time trigger. It will trigger at the specified time.',
        }}
      >
        <SegmentItem>
          <Label htmlFor="interval">Type</Label>
          <TabSelect
            id="interval"
            options={[
              {
                label: 'Interval',
                value: 'interval',
                description: 'Trigger automatically at a set interval',
                subtext: 'Constant interval',
                Icon: PiCalendarDefaultStroke,
              },
              {
                label: 'Schedule',
                value: 'cron',
                subtext: 'Custom Schedule',
                description: 'Trigger automatically at a schedule',
                Icon: PiClockDefaultStroke,
              },
            ]}
            value={trigger.settings.schedule?.type}
            onValueChange={(v) => {
              updateAction({
                trigger: {
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    schedule: { type: v },
                  },
                } as ActionTrigger,
              })
            }}
          />
        </SegmentItem>
        {trigger.settings.schedule?.type === 'cron' && (
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
              value={{
                schedule: trigger.settings.schedule?.schedule,
                description: trigger.settings.schedule?.description,
              }}
              onChange={(v) => {
                updateAction({
                  trigger: {
                    ...trigger,
                    settings: {
                      ...trigger.settings,
                      schedule: {
                        ...trigger.settings.schedule,
                        schedule: v?.schedule,
                        description: v?.description,
                      },
                    },
                  } as ActionTrigger,
                })
              }}
            />
            <ErrorMessage error={errors.schedule} />
          </SegmentItem>
        )}
        {trigger.settings.schedule?.type === 'interval' && (
          <div className="flex gap-3">
            <SegmentItem>
              <Label htmlFor="interval">Interval</Label>
              <NumberInput
                value={{
                  type: 'number',
                  format: 'single',
                  value: trigger.settings.schedule?.interval,
                }}
                onChange={async (v) => {
                  await updateAction({
                    trigger: {
                      ...trigger,
                      settings: {
                        ...trigger.settings,
                        schedule: {
                          ...trigger.settings.schedule,
                          interval: v.value,
                        },
                      },
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
                  value: trigger.settings.schedule?.unit,
                }}
                onChange={async (v) => {
                  await updateAction({
                    trigger: {
                      ...trigger,
                      settings: {
                        ...trigger.settings,
                        schedule: {
                          ...trigger.settings.schedule,
                          unit: v.value,
                        },
                      },
                    } as ActionTrigger,
                  })
                }}
                type="enum"
                locked={locked}
              />
            </SegmentItem>
          </div>
        )}
        <ErrorMessage error={errors.root} />
      </Segment>
    </>
  )
}
