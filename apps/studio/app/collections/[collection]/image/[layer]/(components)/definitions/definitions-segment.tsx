'use client'

import { useLayer } from '@/app/collections/[collection]/image/[layer]/context'
import { LayerLogicButton } from '@/app/collections/[collection]/image/[layer]/(components)/definitions/logic-button'
import Segment from '@/components/layouts/segmented/segment'

export function LayerDefinitionsSegment() {
  const {
    layer: { definition },
  } = useLayer()
  if (!definition) return null
  switch (definition.type) {
    case 'custom':
      return (
        <Segment
          title="Custom Logic"
          info={{
            description:
              'Create your own custom logic with our custom logic builder.',
          }}
        >
          <LayerLogicButton />
        </Segment>
      )
    case 'choice-map':
      return null
    default:
      return null
  }
}
