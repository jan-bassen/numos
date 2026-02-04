import Segment from '@/components/layouts/segmented/segment'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { Label } from '@repo/ui/components/label'
import { SegmentItem } from '@/components/layouts/segmented/segment-item'
import ErrorMessage from '@/components/state/error-message'
import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { tokenEventOptionsArray } from '@/lib/constants/triggers'
import type { ActionTrigger } from '@/lib/schemas/actions/action-schema'

export function TokenSettings() {
  const {
    action: { locked, trigger },
    getErrorMessage,
    updateAction,
  } = useAction()
  if (trigger?.type !== 'token') return null

  return (
    <Segment
      title="Token Trigger"
      info={{
        description: 'Define the details of the token trigger.',
      }}
    >
      <SegmentItem>
        <Label htmlFor="start">Event</Label>
        <TabSelect
          value={trigger.settings.event}
          onValueChange={(v) => {
            updateAction({
              trigger: {
                ...trigger,
                settings: { ...trigger.settings, event: v },
              } as ActionTrigger,
            })
          }}
          options={tokenEventOptionsArray}
          disabled={locked}
          className="w-full"
        />
        <ErrorMessage
          error={getErrorMessage(['trigger', 'settings', 'event'])}
        />
      </SegmentItem>
    </Segment>
  )
}
