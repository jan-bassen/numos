export function getChangeValue<V extends Record<string, any>>(
  value: V[],
  onChange?: (value: V[]) => void,
) {
  return (v: V, index: number) => {
    if (!onChange) return
    const newValueArray = value ? [...value] : []
    newValueArray[index] = v
    onChange(newValueArray)
  }
}
