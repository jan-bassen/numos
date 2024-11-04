'use client'

import { useEffect, useRef, useState } from 'react'

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
  }, [container])

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (ref.current) {
      setContainer(ref.current)
    }
  }, [])

  return [ref, editor] as const
}
