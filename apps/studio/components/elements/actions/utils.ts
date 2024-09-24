export function removeActionParameterFromLocalForm(
  collectionSlug: string,
  action: string,
  parameter: string,
) {
  const pointer = `${collectionSlug}-${action}-param-form`
  const actionForm =
    JSON.parse(localStorage.getItem(pointer) || '{}') || undefined
  if (!actionForm) return
  const newActionForm = {
    ...actionForm,
    [parameter]: undefined,
  }
  localStorage.setItem(pointer, JSON.stringify(newActionForm))
}
