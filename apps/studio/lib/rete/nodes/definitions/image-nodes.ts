import type { ValueSettings } from '@/types/database.types'
import type { NodeDefinitions } from '@/types/nodes.types'

export type ImageNodeType =
  | 'image-root'
  | 'image-input'
  | 'image-combine'
  | 'image-mirror'
  | 'image-rotate'

export const imageNodes: NodeDefinitions<ImageNodeType> = {
  'image-root': {
    type: 'image-root',
    title: 'Output',
    root: true,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node outputs the resulting image, which will be image of your tokens.',
      link: '#',
    },
    inputs: [{ key: 'image', type: 'image', label: 'Image' }],
  },
  'image-combine': {
    type: 'image-combine',
    title: 'Merge',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node adds one image on top of another. If the overlayed image is bigger than the base image, it will be cropped.',
      link: '#',
    },
    inputs: [
      { key: 'image1', type: 'image', label: 'Overlay' },
      { key: 'image2', type: 'image', label: 'Background' },
    ],
    outputs: [{ key: 'output', type: 'image', label: 'Image' }],
  },
  'image-input': {
    type: 'image-input',
    title: 'Layer',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node outputs the selected image from the Layers page.',
      link: '#',
    },
    controls: (node) => {
      return [{ key: 'image', type: 'image' }]
    },
    outputs: [{ key: 'image', type: 'image', label: 'Image' }],
  },
  'image-mirror': {
    type: 'image-mirror',
    title: 'Mirror',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node mirrors the image horizontally or vertically.',
      link: '#',
    },
    controls: [
      {
        key: 'mirror',
        type: 'enum',
        label: 'Mirror',
        placeholder: 'Select Direction',
        defaultValue: 'horizontal',
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
      },
    ],
    inputs: [{ key: 'image', type: 'image', label: 'Image' }],
    outputs: [{ key: 'output', type: 'image', label: 'Image' }],
  },
  'image-rotate': {
    type: 'image-rotate',
    title: 'Rotate',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node rotates the image clockwise, for counter-clockwise you can use a negative value.',
      link: '#',
    },
    inputs: [
      { key: 'image', type: 'image', label: 'Image' },
      { key: 'angle', type: 'number', label: 'Angle (degrees)' },
    ],
    outputs: [{ key: 'output', type: 'image', label: 'Image' }],
  },
}
