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
