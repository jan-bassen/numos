import { AddNodeMenu } from './menus/add-node-menu'
import { createRoot, type Root } from 'react-dom/client'
import type { Area, EditorMode, Item } from '@/types/editor.types'
import { useEffect, useRef } from 'react'

export function addBackground(area: Area, nodeList: Item[], mode?: EditorMode) {
  const background = document.createElement('div')
  background.id = 'background'
  area.area.content.add(background)
  const root = createRoot(background)
  root.render(<CustomBackground nodeList={nodeList} mode={mode} />)
  return root
}

const backgroundRoots: Map<string, Root> = new Map()

export function updateBackground(
  area: Area,
  nodeList: Item[],
  mode?: EditorMode,
) {
  const background = document.getElementById('editor-background')

  if (background) {
    let root = backgroundRoots.get('editor-background')
    if (!root) {
      root = createRoot(background)
      backgroundRoots.set('editor-background', root)
    }
    root.render(<CustomBackground nodeList={nodeList} mode={mode} />)
  } else {
    const root = addBackground(area, nodeList, mode)
    backgroundRoots.set('editor-background', root)
  }
}

function CustomBackground({
  nodeList,
  mode,
}: {
  nodeList: Item[]
  mode?: EditorMode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const div = ref.current

    const handleMouseDown = (event: MouseEvent) => {
      if (
        event.button === 1 ||
        mode === 'drag' ||
        div?.getAttribute('space-pressed') === 'true'
      ) {
        if (ref.current) {
          ref.current.style.cursor = 'grabbing'
        }
      }
    }

    const handleMouseUp = (event: MouseEvent) => {
      if (div) {
        if (mode === 'drag') {
          div.style.cursor = 'grab'
        }
        if (mode === 'select') {
          div.style.cursor = 'default'
        }
      }
    }

    const defaultPrevent = (event: WheelEvent | TouchEvent) => {
      event.preventDefault()
    }

    div?.addEventListener('mousedown', handleMouseDown)
    div?.addEventListener('mouseup', handleMouseUp)
    div?.addEventListener('wheel', defaultPrevent, { passive: false })

    return () => {
      div?.removeEventListener('mousedown', handleMouseDown)
      div?.removeEventListener('mouseup', handleMouseUp)
      div?.removeEventListener('wheel', defaultPrevent)
    }
  }, [mode])

  return (
    <AddNodeMenu
      mode="context"
      searchBar={true}
      items={nodeList}
      delay={0}
      onHide={() => {}}
      position="pointer"
    >
      <div
        ref={ref}
        className="-left-[320000px] -top-[320000px] -z-1 absolute table size-[640000px] overscroll-contain bg-[50px_50px] bg-[length:100px_100px] bg-dots_grid opacity-15"
        style={{
          cursor: mode === 'drag' ? 'grab' : 'default',
        }}
      />
    </AddNodeMenu>
  )
}
