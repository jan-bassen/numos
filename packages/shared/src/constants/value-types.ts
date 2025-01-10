import type { Constant, ConstantInfo } from '@repo/shared/types/constants'
import {
  PiAutomationSolid,
  PiAutomationStroke,
  PiCalendarFilledSolid,
  PiCalendarFilledStroke,
  PiCheckTickCircleBrokenStroke,
  PiCloudDefaultSolid,
  PiCloudDefaultStroke,
  PiColorPaletteSolid,
  PiColorPaletteStroke,
  PiFontAaStroke,
  PiHashtagStroke,
  PiListCheckBoxSolid,
  PiListCheckBoxStroke,
  PiMapPin02AreaSolid,
  PiMapPin02AreaStroke,
  PiNavigationSlantSolid,
  PiNavigationSlantStroke,
  PiPhotoImageDefaultSolid,
  PiPhotoImageDefaultStroke,
  PiWalletDefaultSolid,
  PiWalletDefaultStroke,
} from '@repo/ui/icons/pika'

export const valueTypeKeys = [
  'enum',
  'number',
  'string',
  'boolean',
  'address',
  'color',
  'datetime',
  'location',
  'weather',
  'image',
  'buffer',
  'direction',
] as const

export const dataTypeKeys = ['exec', 'generic', ...valueTypeKeys] as const

export const dataTypes: Constant<
  (typeof dataTypeKeys)[number],
  {
    attribute: boolean
    parameter: boolean
  }
> = {
  exec: {
    value: 'exec',
    label: 'Execution',
    description: 'The execution flow within a graph.',
    icons: { stroke: PiAutomationStroke, fill: PiAutomationSolid },
    attribute: false,
    parameter: false,
  },
  generic: {
    value: 'generic',
    label: 'Generic',
    description: 'An undefined data type.',
    icons: { stroke: PiAutomationStroke, fill: PiAutomationSolid },
    attribute: false,
    parameter: false,
  },
  enum: {
    value: 'enum',
    label: 'Choice',
    description: 'A choice of predefined options.',
    icons: { stroke: PiListCheckBoxStroke, fill: PiListCheckBoxSolid },
    attribute: true,
    parameter: false,
  },
  number: {
    value: 'number',
    label: 'Number',
    description: 'A number value, that can be a decimal or a whole number.',
    icons: { stroke: PiHashtagStroke, fill: PiHashtagStroke },
    attribute: true,
    parameter: true,
  },
  string: {
    value: 'string',
    label: 'Text',
    description: 'A string value, that can be a word, sentence or paragraph.',
    icons: { stroke: PiFontAaStroke, fill: PiFontAaStroke },
    attribute: true,
    parameter: true,
  },
  boolean: {
    value: 'boolean',
    label: 'Yes/No',
    description: 'A boolean value, that can be either true or false.',
    icons: {
      stroke: PiCheckTickCircleBrokenStroke,
      fill: PiCheckTickCircleBrokenStroke,
    },
    attribute: true,
    parameter: true,
  },
  address: {
    value: 'address',
    label: 'Wallet',
    description: 'A blockchain address starting with 0x...',
    icons: { stroke: PiWalletDefaultStroke, fill: PiWalletDefaultSolid },
    attribute: true,
    parameter: true,
  },
  color: {
    value: 'color',
    label: 'Color',
    description: 'An RGBA color value.',
    icons: { stroke: PiColorPaletteStroke, fill: PiColorPaletteSolid },
    attribute: true,
    parameter: true,
  },
  datetime: {
    value: 'datetime',
    label: 'Datetime',
    description: 'A specific point in time, including date and time.',
    icons: { stroke: PiCalendarFilledStroke, fill: PiCalendarFilledSolid },
    attribute: true,
    parameter: true,
  },
  location: {
    value: 'location',
    label: 'Location',
    description: 'A geographic location on the map (latitude and longitude).',
    icons: { stroke: PiMapPin02AreaStroke, fill: PiMapPin02AreaSolid },
    attribute: true,
    parameter: true,
  },
  weather: {
    value: 'weather',
    label: 'Weather Condition',
    description: 'A weather condition, such as sunny, rainy, or cloudy.',
    icons: { stroke: PiCloudDefaultStroke, fill: PiCloudDefaultSolid },
    attribute: true,
    parameter: true,
  },
  image: {
    value: 'image',
    label: 'Image',
    description: "An image file uploaded via the 'Layers' page.",
    icons: {
      stroke: PiPhotoImageDefaultStroke,
      fill: PiPhotoImageDefaultSolid,
    },
    attribute: false,
    parameter: false,
  },
  buffer: {
    value: 'buffer',
    label: 'Image',
    description: "An image file uploaded via the 'Layers' page.",
    icons: {
      stroke: PiPhotoImageDefaultStroke,
      fill: PiPhotoImageDefaultSolid,
    },
    attribute: false,
    parameter: false,
  },
  direction: {
    value: 'direction',
    label: 'Direction',
    description:
      'A direction in two dimensions, such as up, down-right or left.',
    icons: { stroke: PiNavigationSlantStroke, fill: PiNavigationSlantSolid },
    attribute: true,
    parameter: true,
  },
} as const

export const attributeTypeOptions: ConstantInfo<keyof typeof dataTypes>[] =
  Object.entries(dataTypes)
    .filter(([, def]) => def.attribute)
    .map(([, def]) => {
      return {
        ...def,
        attribute: undefined,
        parameter: undefined,
      }
    })

export const parameterTypeOptions: ConstantInfo<keyof typeof dataTypes>[] =
  Object.entries(dataTypes)
    .filter(([, def]) => def.parameter)
    .map(([, def]) => {
      return {
        ...def,
        attribute: undefined,
        parameter: undefined,
      }
    })
