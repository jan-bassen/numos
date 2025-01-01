'use client'

import { useAttribute } from '../../attribute-context'
import type { FullValue, Value } from '@repo/engine/types/value-types'
import DatatypeListInput from '@/components/datatypes/list/datatype-list-input'
import Segment from '@/components/layouts/segmented/segment'
import { isArray } from 'lodash'
import type { ZodErrorInfo } from '@/types/state.types'
import {
  valueToOptions,
  optionsToValue,
} from '@/components/datatypes/list-value-to-options'

export function AttributeOptionsInput() {
  const {
    attribute: { value: _value, locked },
    updateAttribute,
    getError,
  } = useAttribute()

  const errorArray = getError(['value', 'restrictions', 'options', 'value'])
  let errors: Array<ZodErrorInfo | undefined> = []
  if (isArray(errorArray)) {
    errors = errorArray.map((e) => e?.value)
  }

  if (_value.type !== 'enum') {
    return null
  }

  const attributeValue = _value as FullValue<typeof _value.type, boolean>

  const value: Value<'string', 'objectarray', true> = optionsToValue(
    attributeValue.restrictions?.options || [],
  )

  return (
    <Segment
      title="Options"
      info={{
        description:
          'Define which options are available for this attribute. The attribute will be restricted to the options you choose here.',
      }}
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
      <DatatypeListInput
        errors={errors}
        type="string"
        locked={locked}
        placeholder="Option"
        environment="form"
        classNames={{ container: 'w-full max-w-input' }}
        value={value}
        onChange={async (v) => {
          const newValue = {
            ...attributeValue,
            restrictions: {
              ...attributeValue.restrictions,
              options: valueToOptions(v),
            },
          }
          const res = await updateAttribute(
            { value: newValue },
            { debounce: true },
          )
          console.log(res)
        }}
        addButtonLabel="Add Option"
      />
    </Segment>
  )
}
