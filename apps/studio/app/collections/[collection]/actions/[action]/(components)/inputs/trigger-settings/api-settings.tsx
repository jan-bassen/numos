import Segment from '@/components/layouts/segmented/segment'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import ErrorMessage from '@/components/state/error-message'
import type { ActionTrigger, ParameterInfo } from '@/types/actions.types'
import ListInput, {} from '@/components/datatypes/list/list-input'
import { ParameterInput } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/trigger-settings/parameters/parameter-input'

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
  }))

  return (
    <Segment
      title="Parameters"
      description="You can pass data to the action via the API trigger. Just give it a unique key, and select the type of data you want to pass."
    >
      <ListInput<ParameterInfo>
        locked={locked}
        value={_value}
        defaultNewValue={(index) => ({
          key: `Key${index + 1}`,
          value: { type: 'string', list: false },
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
