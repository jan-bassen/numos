'use client'

import { useAttribute } from '../../attribute-context'
import { Button } from '@repo/ui/components/ui/button'
import { PiRefreshStroke } from '@repo/ui/icons/pika'
import type {
  FullValue,
  Value,
  ValueSettings,
  ValueType,
} from '@repo/engine/types/value-types'
import ListInput from '@/components/datatypes/list/list-input'
import { getDataTypeInput } from '@/components/datatypes/single-datatype-input'
import type { UpdateAttribute } from '@/types/database.types'
import ErrorMessage from '@/components/state/error-message'
import Segment from '@/components/layouts/segmented/segment'

export function AttributeOptionsInput() {
  const {
    attribute: { list, type, value: _value, locked },
    updateAttribute,
    getError,
  } = useAttribute()

  const error = getError('settings.default.value')
  if (type !== 'enum') {
    return null
  }

  const attributeValue = _value as FullValue<typeof type, boolean>
  const options = attributeValue?.restrictions?.options?.value?.map(
    (option) => {
      return {
        id: option.id || crypto.randomUUID(),
        value: option.value,
      }
    },
  )
  const value: Value<'string', 'objectarray', true> = {
    value: options || [],
    type: 'string',
    format: 'objectarray',
  }

  return (
    <Segment
      title="Options"
      description="Define which options are available for this attribute. The attribute will be restricted to the options you choose here."
      /*             options={[
              {
                label: 'Single',
                explanation: 'Value1',
              },
              {
                label: 'List',
                explanation: '[ Value1, Value2, Value3 ]',
              },
            ]} */
    >
      <ListInput
        valid={!error}
        type="string"
        locked={locked}
        /* settings={settings || {}} */
        placeholder="No default value"
        environment="form"
        classNames={{ container: 'w-full max-w-input' }}
        value={value}
        onChange={async (v) => {
          const res = await updateAttribute(
            {
              value: {
                ...attributeValue,
                restrictions: {
                  ...attributeValue.restrictions,
                  options: v,
                },
              },
            } as UpdateAttribute,
            { debounce: true },
          )
          console.log(v)
        }}
        addButtonLabel="Add Option"
      />
      <ErrorMessage error={error} />
    </Segment>
  )
}
