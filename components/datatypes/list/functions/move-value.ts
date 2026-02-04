export function getMoveValue<V extends Record<string, any>>(
  value: V[],
  onChange?: (value: V[]) => void,
) {
  return (from: number, to: number) => {
    if (!onChange) return
    if (from < 0 || from >= value.length || to < 0 || to >= value.length) return
    const newValueArray = value ? [...value] : []
    const [removed] = newValueArray.splice(from, 1)
    if (removed === undefined) return
    newValueArray.splice(to, 0, removed)
    onChange(newValueArray)
  }
}
