'use client'

import { HeaderTitleInput } from '@/components/page/header-title-input'
import { useLayer } from '@/app/collections/[collection]/image/[layer]/context'

export function LayerTitle() {
  const {
    layer: { name, locked },
    updateLayer,
  } = useLayer()
  return (
    <HeaderTitleInput
      value={name || 'Unnamed Layer'}
      disabled={locked}
      onChange={(e) =>
        updateLayer({ name: e.target.value }, { debounce: true })
      }
    />
  )
}
