import type { Attribute } from '@/types/database.types'
import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { getDefaultValuesFromAttributes } from './get-attributes'
import type { Parameter } from '@/lib/schemas/actions/triggers/api'
import { getDefaultValuesFromParameters } from './get-parameters'

type TokenFormData = {
  attributes?:
    | {
        [x: string]: any
      }
    | undefined
  metadata?:
    | {
        description?: string | null | undefined
        id?: number | null | undefined
        name?: string | null | undefined
      }
    | null
    | undefined
  parameters?:
    | {
        [x: string]: any
      }
    | undefined
}

export function storeLocalData({
  data,
  collectionId,
  actionId,
}: {
  data: TokenFormData
  collectionId: string
  actionId?: string
}) {
  if (!collectionId) return
  localStorage.setItem(
    `${collectionId}-metadata`,
    JSON.stringify(data.metadata),
  )
  localStorage.setItem(
    `${collectionId}-attribute-form`,
    JSON.stringify(data.attributes),
  )
  if (data.parameters && actionId) {
    localStorage.setItem(
      `${collectionId}-${actionId}-param-form`,
      JSON.stringify(data.parameters),
    )
  }
}

export function useLocalData({
  collectionId,
  actionId,
  attributes,
  parameters,
  form,
}: {
  collectionId: string
  actionId?: string
  attributes: Attribute[]
  parameters?: Parameter[]
  form: UseFormReturn<TokenFormData>
}) {
  useEffect(() => {
    const storedMetadata = JSON.parse(
      localStorage?.getItem(`${collectionId}-metadata`) || '{}',
    )
    form.setValue('metadata', storedMetadata, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    })
  }, [collectionId, form.setValue])

  useEffect(() => {
    const storedAttributeData = JSON.parse(
      localStorage?.getItem(`${collectionId}-attribute-form`) || '{}',
    )
    form.setValue(
      'attributes',
      getDefaultValuesFromAttributes(attributes, storedAttributeData),
      { shouldValidate: false, shouldDirty: false, shouldTouch: false },
    )
  }, [collectionId, attributes, form.setValue])

  useEffect(() => {
    if (!parameters || !actionId) return
    const storedParamsData = JSON.parse(
      localStorage.getItem(`${collectionId}-${actionId}-param-form`) || '{}',
    )
    form.setValue(
      'parameters',
      getDefaultValuesFromParameters(parameters, storedParamsData),
      { shouldValidate: false, shouldDirty: false, shouldTouch: false },
    )
  }, [collectionId, actionId, parameters, form.setValue])
}
