export function getRemoveValue<V extends Record<string, any>>(
  value: V[],
  onChange?: (value: V[]) => void,
) {
  return (index: number) => {
    if (!onChange) return
    const newValueArray = value ? [...value] : []
    newValueArray.splice(index, 1)
    onChange(newValueArray)
  }
}
