import type { DragEndEvent } from '@dnd-kit/core'

export function getEndDrag(move: (from: number, to: number) => void) {
  return (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over?.id) {
      const activeIndex = active.data.current?.sortable?.index
      const overIndex = over.data.current?.sortable?.index
      if (activeIndex !== undefined && overIndex !== undefined) {
        move(activeIndex, overIndex)
      }
    }
  }
}
