import type {
  NodeDefinitions,
  EditorConfig,
  EditorContext,
  NodeType,
} from '@/types/nodes.types'
import { PiPhotoImageDefaultStroke } from '@repo/ui/icons/pika'
import { type ImageNodeType, imageNodes } from '../definitions/image-nodes'
import { type DataNodeType, dataNodes } from '../definitions/data-nodes'
import { type MathNodeType, mathNodes } from '../definitions/math-nodes'
import { type TextNodeType, textNodes } from '../definitions/text-nodes'
import { type TimeNodeType, timeNodes } from '../definitions/time-nodes'
import {
  type UtilityNodeType,
  utilityNodes,
} from '../definitions/utility-nodes'
import { type ColorNodeType, colorNodes } from '../definitions/color-nodes'
import { type LogicNodeType, logicNodes } from '../definitions/logic-nodes'
import { baseConfig } from './base-config'
import { locationNodes } from '../definitions/location-nodes'
import { listNodes, type ListNodeType } from '../definitions/list-nodes'

export type ExtendedImageNodeType =
  | ImageNodeType
  | DataNodeType
  | MathNodeType
  | TextNodeType
  | LogicNodeType
  | TimeNodeType
  | UtilityNodeType
  | ColorNodeType
  | ListNodeType

export const imageEditorNodes: NodeDefinitions<ExtendedImageNodeType> = {
  ...imageNodes,
  ...dataNodes,
  ...mathNodes,
  ...textNodes,
  ...logicNodes,
  ...listNodes,
  ...timeNodes,
  ...locationNodes,
  ...utilityNodes,
  ...colorNodes,
}

export const imageConfig: EditorConfig = (context: EditorContext) => {
  const blocklist: NodeType[] = [
    'parameter-data',
    'change-attribute',
    'change-token-name',
    'change-token-description',
  ]
  if (context.attributes.filter((attr) => attr.type === 'enum').length === 0) {
    blocklist.push('image-map')
  }
  return {
    root: { type: 'image-root', position: { x: 50, y: -50 } },
    nodes: imageEditorNodes,
    blocklist,
    groups: [
      {
        label: 'Image',
        key: 'image',
        Icon: PiPhotoImageDefaultStroke,
        subitems: [
          'image-input',
          {
            key: 'image-combine',
            label: 'Composite',
            subitems: ['image-combine'],
          },
          {
            key: 'img-transform',
            label: 'Transform',
            subitems: ['image-mirror', 'image-rotate'],
          },
        ],
      },
      ...baseConfig(context),
    ],
  }
}
