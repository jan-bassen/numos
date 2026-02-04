export function getAppendValue<V extends Record<string, any>>(
  value: V[],
  onChange?: (value: V[]) => void,
) {
  return (v: V) => {
    if (!onChange) return
    const newValueArray: V[] = value ? [...value] : []
    newValueArray.push(v)
    onChange(newValueArray)
  }
}
