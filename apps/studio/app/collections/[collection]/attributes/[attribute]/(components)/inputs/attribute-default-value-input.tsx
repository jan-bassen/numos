'use client'

import { useAttribute } from '../../attribute-context'
import { Button } from '@repo/ui/components/ui/button'
import { PiRefreshStroke } from '@repo/ui/icons/pika'
import type { Value, ValueType } from '@repo/engine/types/value-types'
import ListInput from '@/components/datatypes/list/list-input'
import { getDataTypeInput } from '@/components/datatypes/single-datatype-input'
import type { InsertAttribute } from '@/types/database.types'
import ErrorMessage from '@/components/state/error-message'

export function AttributeDefaultValueInput() {
  const {
    attribute: { list, type, settings, locked },
    updateAttribute,
    getError,
  } = useAttribute()

  const error = getError('settings.default.value')
  if (list) {
    const value: Value<ValueType, 'objectarray', true> =
      settings?.default && settings?.default.format === 'objectarray'
        ? settings.default
        : { type, format: 'objectarray', value: [] }

    return (
      <>
        <ListInput
          valid={!error}
          type={type}
          locked={locked}
          settings={settings || {}}
          placeholder="No default value"
          environment="form"
          classNames={{ container: 'w-full max-w-input' }}
          value={value}
          onChange={async (v) => {
            const res = await updateAttribute({
              settings: {
                ...settings,
                default: v,
              },
            })
          }}
        />
        <ErrorMessage error={error} />
      </>
    )
  }
  const value =
    settings?.default &&
    settings.default.format === 'single' &&
    settings.default.type === type
      ? settings.default
      : undefined

  const Input = getDataTypeInput<typeof type>(type)
  if (!Input) return null
  return (
    <>
      <div className="flex w-full max-w-input gap-2">
        <Input
          valid={!error}
          type={type}
          environment="form"
          locked={locked}
          settings={{ type, ...settings }}
          placeholder="No default value"
          value={value || { type, format: 'single', value: undefined }}
          onChange={async (v) => {
            const res = await updateAttribute({
              settings: {
                ...settings,
                default: v,
              },
            } as InsertAttribute)
          }}
        />
        {(settings?.default?.value || settings?.default?.value === false) &&
          !locked &&
          type !== 'boolean' && (
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
                      type: type,
                      value: null,
                      format: list ? 'objectarray' : 'single',
                    },
                  },
                } as InsertAttribute)
              }}
            >
              <PiRefreshStroke className="size-4" />
            </Button>
          )}
      </div>
      <ErrorMessage error={error} />
    </>
  )
}
