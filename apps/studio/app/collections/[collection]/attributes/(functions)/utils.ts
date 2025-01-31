export function removeAttributeFromLocalForm(
  collectionId: string,
  attributeId: string,
) {
  const attributeForm =
    JSON.parse(
      localStorage.getItem(`${collectionId}-attribute-form`) || '{}',
    ) || undefined
  if (!attributeForm) return
  const newAttributeForm = { ...attributeForm, [attributeId]: undefined }
  localStorage.setItem(
    `${collectionId}-attribute-form`,
    JSON.stringify(newAttributeForm),
  )
}
