type Path = Array<string | number>

export function setValueAtPath(obj: any, path: Path, value: any): any {
  if (path.length === 0) {
    throw new Error('Path cannot be empty')
  }

  function traverseAndSet(target: any, path: Path, value: any): any {
    const [currentKey, ...remainingPath] = path
    if (currentKey === undefined) {
      throw new Error('Current key cannot be undefined')
    }

    if (remainingPath.length === 0) {
      if (Array.isArray(target) && typeof currentKey === 'number') {
        const newArray = [...target]
        newArray[currentKey] = value
        return newArray
      }

      if (typeof target === 'object' && target !== null) {
        return { ...target, [currentKey]: value }
      }

      return typeof currentKey === 'number'
        ? (() => {
            const newArray: any[] = []
            newArray[currentKey] = value
            return newArray
          })()
        : { [currentKey]: value }
    }

    const nextTarget =
      Array.isArray(target) && typeof currentKey === 'number'
        ? target[currentKey] ?? []
        : target[currentKey] ?? (typeof remainingPath[0] === 'number' ? [] : {})

    if (Array.isArray(target) && typeof currentKey === 'number') {
      const newArray = [...target]
      newArray[currentKey] = traverseAndSet(nextTarget, remainingPath, value)
      return newArray
    }

    if (typeof target === 'object' && target !== null) {
      return {
        ...target,
        [currentKey]: traverseAndSet(nextTarget, remainingPath, value),
      }
    }

    const newTarget = typeof currentKey === 'number' ? [] : {}
    return traverseAndSet(newTarget, path, value)
  }

  return traverseAndSet(obj, path, value)
}

export function getValueAtPath<O extends object>(
  obj: O,
  path: Path,
): O | undefined {
  let current: any = obj

  for (const key of path) {
    if (
      current == null ||
      (typeof key === 'number' && !Array.isArray(current))
    ) {
      return undefined // Path does not exist
    }
    current = current[key]
  }

  return current
}
