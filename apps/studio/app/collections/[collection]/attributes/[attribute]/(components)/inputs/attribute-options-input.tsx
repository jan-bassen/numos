'use client'

import { useAttribute } from '../../attribute-context'
import type { FullValue, Value } from '@repo/engine/types/value-types'
import ListInput from '@/components/datatypes/list/list-input'
import Segment from '@/components/layouts/segmented/segment'
import { isArray } from 'lodash'
import type { ZodErrorInfo } from '@/types/state.types'
import {
  valueToOptions,
  optionsToValue,
} from '@/components/datatypes/list-value-to-options'

export function AttributeOptionsInput() {
  const {
    attribute: { list, type, value: _value, locked },
    updateAttribute,
    getError,
  } = useAttribute()

  const errorArray = getError(['value', 'restrictions', 'options', 'value'])
  let errors: Array<ZodErrorInfo | undefined> = []
  if (isArray(errorArray)) {
    errors = errorArray.map((e) => e?.value)
  }

  if (type !== 'enum') {
    return null
  }

  const attributeValue = _value as FullValue<typeof type, boolean>

  const value: Value<'enum', 'objectarray', true> = optionsToValue(
    attributeValue.restrictions?.options || [],
  )

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
        errors={errors}
        type="enum"
        locked={locked}
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
                  options: valueToOptions(v),
                },
              },
            },
            { debounce: true },
          )
        }}
        addButtonLabel="Add Option"
      />
    </Segment>
  )
}
