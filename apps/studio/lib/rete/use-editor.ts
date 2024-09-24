'use client'

import { useEffect, useRef, useState } from 'react'

//TODO: Investigate the warnings
export function useEditor<T extends { destroy(): void }>(
  create: (el: HTMLElement) => Promise<T>,
) {
  const [container, setContainer] = useState<null | HTMLElement>(null)
  const editorRef = useRef<T>()
  const [editor, setEditor] = useState<T | null>(null)
  const ref = useRef(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (container) {
      if (editorRef.current) {
        editorRef.current.destroy()
        container.innerHTML = ''
      }
      create(container).then((value) => {
        editorRef.current = value
        setEditor(value)
      })
    }
  }, [container]) //ignore the react warning, this is ok I think

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
      }
    }
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (ref.current) {
      setContainer(ref.current)
    }
  }, [ref.current]) //ignore the react warning, this is ok I think

  return [ref, editor] as const
}
