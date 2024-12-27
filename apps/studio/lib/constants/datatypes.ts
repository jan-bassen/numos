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
  PiListDefaultStroke,
  PiMapPin02AreaSolid,
  PiMapPin02AreaStroke,
  PiNavigationSlantSolid,
  PiNavigationSlantStroke,
  PiPhotoImageDefaultSolid,
  PiPhotoImageDefaultStroke,
  PiWalletDefaultSolid,
  PiWalletDefaultStroke,
} from '@repo/ui/icons/pika'
import type { ValueTypeDefinition } from '@/types/database.types'
import type { DataType, OptionalDataType } from '@repo/engine/types/value-types'
import type { TabOption } from '@/components/forms/tab-inputs/tab-option'

export const dataTypes: Record<OptionalDataType, ValueTypeDefinition> = {
  exec: {
    title: 'Execution',
    description: 'The execution flow within a graph.',
    icons: { stroke: PiAutomationStroke, fill: PiAutomationSolid },
    attribute: false,
    parameter: false,
  },
  generic: {
    title: 'Generic',
    description: 'An undefined data type.',
    icons: { stroke: PiAutomationStroke, fill: PiAutomationSolid },
    attribute: false,
    parameter: false,
  },
  enum: {
    title: 'Choice',
    description: 'A choice of predefined options.',
    icons: { stroke: PiListCheckBoxStroke, fill: PiListCheckBoxSolid },
    attribute: true,
    parameter: false,
  },
  number: {
    title: 'Number',
    description: 'A number value, that can be a decimal or a whole number.',
    icons: { stroke: PiHashtagStroke, fill: PiHashtagStroke },
    attribute: true,
    parameter: true,
  },
  string: {
    title: 'Text',
    description: 'A string value, that can be a word, sentence or paragraph.',
    icons: { stroke: PiFontAaStroke, fill: PiFontAaStroke },
    attribute: true,
    parameter: true,
  },
  boolean: {
    title: 'Yes/No',
    description: 'A boolean value, that can be either true or false.',
    icons: {
      stroke: PiCheckTickCircleBrokenStroke,
      fill: PiCheckTickCircleBrokenStroke,
    },
    attribute: true,
    parameter: true,
  },
  address: {
    title: 'Wallet',
    description: 'A blockchain address starting with 0x...',
    icons: { stroke: PiWalletDefaultStroke, fill: PiWalletDefaultSolid },
    attribute: true,
    parameter: true,
  },
  color: {
    title: 'Color',
    description: 'An RGBA color value.',
    icons: { stroke: PiColorPaletteStroke, fill: PiColorPaletteSolid },
    attribute: true,
    parameter: true,
  },
  datetime: {
    title: 'Datetime',
    description: 'A specific point in time, including date and time.',
    icons: { stroke: PiCalendarFilledStroke, fill: PiCalendarFilledSolid },
    attribute: true,
    parameter: true,
  },
  location: {
    title: 'Location',
    description: 'A geographic location on the map (latitude and longitude).',
    icons: { stroke: PiMapPin02AreaStroke, fill: PiMapPin02AreaSolid },
    attribute: true,
    parameter: true,
  },
  weather: {
    title: 'Weather Condition',
    description: 'A weather condition, such as sunny, rainy, or cloudy.',
    icons: { stroke: PiCloudDefaultStroke, fill: PiCloudDefaultSolid },
    attribute: true,
    parameter: true,
  },
  image: {
    title: 'Image',
    description: "An image file uploaded via the 'Layers' page.",
    icons: {
      stroke: PiPhotoImageDefaultStroke,
      fill: PiPhotoImageDefaultSolid,
    },
    attribute: false,
    parameter: false,
  },
  buffer: {
    title: 'Image',
    description: "An image file uploaded via the 'Layers' page.",
    icons: {
      stroke: PiPhotoImageDefaultStroke,
      fill: PiPhotoImageDefaultSolid,
    },
    attribute: false,
    parameter: false,
  },
  direction: {
    title: 'Direction',
    description:
      'A direction in two dimensions, such as up, down-right or left.',
    icons: { stroke: PiNavigationSlantStroke, fill: PiNavigationSlantSolid },
    attribute: true,
    parameter: true,
  },
}

export const attributeTypeOptions: TabOption<DataType>[] = Object.entries(
  dataTypes,
)
  .filter(([key, def]) => def.attribute)
  .map(([key, def]) => {
    return {
      value: key as DataType,
      label: def.title,
      subtext: def.description,
      Icon: def.icons.stroke,
    }
  })

export const parameterTypeOptions: TabOption<DataType>[] = Object.entries(
  dataTypes,
)
  .filter(([key, def]) => def.parameter)
  .map(([key, def]) => {
    return {
      value: key as DataType,
      label: def.title,
      subtext: def.description,
      Icon: def.icons.stroke,
    }
  })
