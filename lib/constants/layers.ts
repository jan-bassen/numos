import type { LayerType } from '@/lib/schemas/layers/layer-schema'
import { PiAutomationStroke, PiListCheckStroke } from '@repo/ui/icons/pika'
import type { TabOption } from '@/components/forms/tab-inputs/tab-option'

export const layerOptions: Record<LayerType, TabOption> = {
  custom: {
    value: 'custom',
    label: 'Custom',
    subtext: 'Create your own custom logic',
    description: 'Create your own custom logic with our custom logic builder.',
    Icon: PiAutomationStroke,
  },
  'choice-map': {
    value: 'choice-map',
    label: 'Choice Map',
    subtext: 'Map images to a choice attribute',
    description:
      'Link one uploaded image to each option of a choice attribute. Depending on the state of the token, the corresponding image will be displayed.',
    Icon: PiListCheckStroke,
  },
}

export const layerOptionsArray = Object.values(layerOptions)
