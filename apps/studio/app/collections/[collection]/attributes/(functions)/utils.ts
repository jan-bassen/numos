import type { AttributeInfo } from '@/types/attributes.types'
import type { Attribute } from '@/types/database.types'

export function removeAttributeFromLocalForm(
  collectionSlug: string,
  attribute: string,
) {
  const attributeForm =
    JSON.parse(
      localStorage.getItem(`${collectionSlug}-attribute-form`) || '{}',
    ) || undefined
  if (!attributeForm) return
  const newAttributeForm = { ...attributeForm, [attribute]: undefined }
  localStorage.setItem(
    `${collectionSlug}-attribute-form`,
    JSON.stringify(newAttributeForm),
  )
}

export function getInfoFromAttribute(attribute: Attribute): AttributeInfo {
  return {
    id: attribute.id,
    name: attribute.name || undefined,
    description: attribute.description || undefined,
    slug: attribute.slug,
    token_specific: attribute.token_specific,
    value: attribute.value,
    display: attribute.display,
  }
}
