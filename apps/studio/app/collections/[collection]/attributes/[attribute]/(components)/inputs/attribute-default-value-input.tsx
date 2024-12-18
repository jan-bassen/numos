'use client'

import { useAttribute } from '../../attribute-context'
import { Button } from '@repo/ui/components/ui/button'
import { PiRefreshStroke } from '@repo/ui/icons/pika'
import type { Value, ValueType } from '@repo/engine/types/value-types'
import ListInput from '@/components/datatypes/list/datatype-list-input'
import { getDataTypeInput } from '@/components/datatypes/single-datatype-input'
import type { InsertAttribute } from '@/types/database.types'
import ErrorMessage from '@/components/state/error-message'
import { isArray } from 'lodash'
import type { ZodErrorInfo } from '@/types/state.types'

export function AttributeDefaultValueInput() {
  const {
    attribute: { settings, locked, value },
    updateAttribute,
    getError,
  } = useAttribute()

  if (value.list) {
    const valueErrorArray = getError(['value', 'default', 'value'])
    let errors: Array<ZodErrorInfo | undefined> = []
    if (isArray(valueErrorArray)) {
      errors = valueErrorArray.map((e) => e?.value)
    }
    return (
      <>
        <ListInput
          type={value.type}
          errors={errors}
          locked={locked}
          restrictions={value.restrictions}
          placeholder="No default value"
          environment="form"
          classNames={{ container: 'w-full max-w-input' }}
          value={
            (value.default as Value<
              typeof value.type,
              'objectarray',
              true
            >) || {
              type: value.type,
              format: 'objectarray',
              value: [],
            }
          }
          onChange={async (v) => {
            const res = await updateAttribute({
              value: {
                ...value,
                default: v,
              },
            })
          }}
        />
      </>
    )
  }
  const error = getError(['value', 'default', 'value'])
  const errorMessage = typeof error === 'string' ? error : undefined

  const Input = getDataTypeInput<typeof value.type>(value.type)
  if (!Input) return null
  return (
    <>
      <div className="flex w-full max-w-input gap-2">
        <Input
          valid={!error}
          type={value.type}
          environment="form"
          locked={locked}
          restrictions={value.restrictions}
          placeholder="No default value"
          value={
            (value.default as Value<typeof value.type, 'single', true>) || {
              type: value.type,
              format: 'single',
              value: undefined,
            }
          }
          onChange={async (v) => {
            const res = await updateAttribute({
              value: {
                ...value,
                default: v,
              },
            })
          }}
        />
        {(settings?.default?.value || settings?.default?.value === false) &&
          !locked &&
          value.type !== 'boolean' && (
            <Button
              variant="outline"
              type="button"
              size="icon"
              className="shrink-0"
              onClick={async () => {
                const res = await updateAttribute({
                  settings: {
                    ...settings,
                    default: {
                      type: value.type,
                      value: null,
                      format: value.list ? 'objectarray' : 'single',
                    },
                  },
                } as InsertAttribute)
              }}
            >
              <PiRefreshStroke className="size-4" />
            </Button>
          )}
      </div>
      <ErrorMessage error={errorMessage} />
    </>
  )
}
