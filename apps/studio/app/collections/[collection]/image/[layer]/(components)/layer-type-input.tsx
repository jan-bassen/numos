'use client'

import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import type { LayerType } from '@/lib/schemas/layers/layer-schema'
import type { LayerDefinition } from '@/lib/schemas/layers/layer-schema'
import { useLayer } from '@/app/collections/[collection]/image/[layer]/context'
import { layerOptionsArray } from '@/lib/constants/layers'

const defaultLayerDefinitions: Record<LayerType, LayerDefinition> = {
  custom: {
    type: 'custom',
  },
  'choice-map': {
    type: 'choice-map',
  },
}

export function LayerTypeInput() {
  const {
    layer: { locked, definition },
    updateLayer,
  } = useLayer()
  return (
    <TabSelect
      size="md"
      disabled={locked}
      options={layerOptionsArray}
      value={definition?.type}
      onValueChange={async (value: string) => {
        await updateLayer({
          definition: defaultLayerDefinitions[value as LayerType],
        })
      }}
    />
  )
}
