import Segment from '@/components/layouts/segmented/segment'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import ErrorMessage from '@/components/state/error-message'

import type { ActionTrigger } from '@/lib/schemas/actions/action-schema'
import ListInput, {
  type ListItem,
} from '@/components/datatypes/list/list-input'
import { ParameterInput } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/trigger-settings/parameters/parameter-input'
import type { Parameter } from '@/lib/schemas/actions/triggers/api'

export function ApiSettings() {
  const {
    action: { locked, trigger },
    getErrorMessage,
    updateAction,
  } = useAction()
  if (trigger?.type !== 'api') return null

  const _value = trigger.settings.params.map(({ id, ...p }) => ({
    id: id,
    value: p,
  })) as ListItem<Parameter>[]

  return (
    <Segment
      title="Parameters"
      info={{
        description:
          'You can pass data to the action via the API trigger. Just give it a unique key, and select the type of data you want to pass.',
      }}
    >
      <ListInput<Parameter>
        locked={locked}
        value={_value}
        defaultNewValue={(index) => ({
          id: crypto.randomUUID(),
          key: `Key${index + 1}`,
          value: { type: 'string', list: false, optional: false },
        })}
        onChange={(v) => {
          updateAction(
            {
              trigger: {
                ...trigger,
                settings: {
                  ...trigger.settings,
                  params: v.map(({ id, value }) => ({ id, ...value })),
                },
              } as ActionTrigger,
            },
            { debounce: true },
          )
        }}
        input={ParameterInput}
        addButtonLabel="Add Parameter"
        classNames={{ container: 'gap-3' }}
      />
      <ErrorMessage
        error={getErrorMessage(['trigger', 'settings', 'params'])}
      />
    </Segment>
  )
}
