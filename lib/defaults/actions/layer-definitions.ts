import type {
  LayerDefinition,
  LayerType,
} from '@/lib/schemas/layers/layer-schema'

export const defaultLayerSettings: Record<LayerType, LayerDefinition> = {
  custom: {
    type: 'custom',
  },
  'choice-map': {
    type: 'choice-map',
  },
}
