import { actionRootDefinition } from '@/lib/rete/nodes/node-definitions/action-root'
import { addressInputDefinition } from '@/lib/rete/nodes/node-definitions/address-input'
import { booleanInputDefinition } from '@/lib/rete/nodes/node-definitions/boolean-input'
import { cancelDefinition } from '@/lib/rete/nodes/node-definitions/cancel'
import { changeTokenAttributeDefinition } from '@/lib/rete/nodes/node-definitions/change-token-attribute'
import { changeTokenDescriptionDefinition } from '@/lib/rete/nodes/node-definitions/change-token-description'
import { changeTokenNameDefinition } from '@/lib/rete/nodes/node-definitions/change-token-name'
import { clampDefinition } from '@/lib/rete/nodes/node-definitions/clamp'
import { colorInputDefinition } from '@/lib/rete/nodes/node-definitions/color-input'
import { combineColorDefinition } from '@/lib/rete/nodes/node-definitions/combine-color'
import { compareDefinition } from '@/lib/rete/nodes/node-definitions/compare'
import { dataSwitchDefinition } from '@/lib/rete/nodes/node-definitions/data-switch'
import { datetimeInputDefinition } from '@/lib/rete/nodes/node-definitions/datetime-input'
import { directionInputDefinition } from '@/lib/rete/nodes/node-definitions/direction-input'
import { enumInputDefinition } from '@/lib/rete/nodes/node-definitions/enum-input'
import { imageCombineDefinition } from '@/lib/rete/nodes/node-definitions/image-combine'
import { imageInputDefinition } from '@/lib/rete/nodes/node-definitions/image-input'
import { imageMirrorDefinition } from '@/lib/rete/nodes/node-definitions/image-mirror'
import { imageRotateDefinition } from '@/lib/rete/nodes/node-definitions/image-rotate'
import { imageRootDefinition } from '@/lib/rete/nodes/node-definitions/image-root'
import { isInListDefinition } from '@/lib/rete/nodes/node-definitions/is-in-list'
import { lengthDefinition } from '@/lib/rete/nodes/node-definitions/length'
import { listAddDefinition } from '@/lib/rete/nodes/node-definitions/list-add'
import { listLengthDefinition } from '@/lib/rete/nodes/node-definitions/list-length'
import { locationDistanceDefinition } from '@/lib/rete/nodes/node-definitions/location-distance'
import { locationInputDefinition } from '@/lib/rete/nodes/node-definitions/location-input'
import { logicDefinition } from '@/lib/rete/nodes/node-definitions/logic'
import { logDefinition } from '@/lib/rete/nodes/node-definitions/log'
import { mapToDateDefinition } from '@/lib/rete/nodes/node-definitions/map-to-date'
import { mapToNumberDefinition } from '@/lib/rete/nodes/node-definitions/map-to-number'
import { metadataDefinition } from '@/lib/rete/nodes/node-definitions/metadata'
import { mathsDefinition } from '@/lib/rete/nodes/node-definitions/maths'
import { nowDefinition } from '@/lib/rete/nodes/node-definitions/now'
import { numberInputDefinition } from '@/lib/rete/nodes/node-definitions/number-input'
import { parameterDefinition } from '@/lib/rete/nodes/node-definitions/parameter'
import { randomDefinition } from '@/lib/rete/nodes/node-definitions/random'
import { replaceDefinition } from '@/lib/rete/nodes/node-definitions/replace'
import { roundDefinition } from '@/lib/rete/nodes/node-definitions/round'
import { splitColorDefinition } from '@/lib/rete/nodes/node-definitions/split-color'
import { stopDefinition } from '@/lib/rete/nodes/node-definitions/stop'
import { switchDefinition } from '@/lib/rete/nodes/node-definitions/switch'
import { textCombineDefinition } from '@/lib/rete/nodes/node-definitions/text-combine'
import { textInputDefinition } from '@/lib/rete/nodes/node-definitions/text-input'
import { timeDifferenceDefinition } from '@/lib/rete/nodes/node-definitions/time-difference'
import { timeInformationDefinition } from '@/lib/rete/nodes/node-definitions/time-information'
import { tokenAttributeDefinition } from '@/lib/rete/nodes/node-definitions/token-attribute'
import { weatherInputDefinition } from '@/lib/rete/nodes/node-definitions/weather-input'
import { truncateDefinition } from '@/lib/rete/nodes/node-definitions/truncate'
import type { NodeDefinition, NodeDefinitions } from '@/types/nodes.types'

export const nodeDefinitions: NodeDefinitions = {
  'action-root': actionRootDefinition as NodeDefinition,
  'address-input': addressInputDefinition as NodeDefinition,
  'boolean-input': booleanInputDefinition as NodeDefinition,
  cancel: cancelDefinition as NodeDefinition,
  'change-token-attribute': changeTokenAttributeDefinition as NodeDefinition,
  'change-token-description':
    changeTokenDescriptionDefinition as NodeDefinition,
  'change-token-name': changeTokenNameDefinition as NodeDefinition,
  clamp: clampDefinition as NodeDefinition,
  'color-input': colorInputDefinition as NodeDefinition,
  'combine-color': combineColorDefinition as NodeDefinition,
  compare: compareDefinition as NodeDefinition,
  'data-switch': dataSwitchDefinition as NodeDefinition,
  'datetime-input': datetimeInputDefinition as NodeDefinition,
  'direction-input': directionInputDefinition as NodeDefinition,
  'enum-input': enumInputDefinition as NodeDefinition,
  'image-combine': imageCombineDefinition as NodeDefinition,
  'image-input': imageInputDefinition as NodeDefinition,
  'image-mirror': imageMirrorDefinition as NodeDefinition,
  'image-rotate': imageRotateDefinition as NodeDefinition,
  'image-root': imageRootDefinition as NodeDefinition,
  'is-in-list': isInListDefinition as NodeDefinition,
  length: lengthDefinition as NodeDefinition,
  'list-add': listAddDefinition as NodeDefinition,
  'list-length': listLengthDefinition as NodeDefinition,
  'location-distance': locationDistanceDefinition as NodeDefinition,
  'location-input': locationInputDefinition as NodeDefinition,
  logic: logicDefinition as NodeDefinition,
  log: logDefinition as NodeDefinition,
  'map-to-date': mapToDateDefinition as NodeDefinition,
  'map-to-number': mapToNumberDefinition as NodeDefinition,
  metadata: metadataDefinition as NodeDefinition,
  maths: mathsDefinition as NodeDefinition,
  now: nowDefinition as NodeDefinition,
  'number-input': numberInputDefinition as NodeDefinition,
  parameter: parameterDefinition as NodeDefinition,
  random: randomDefinition as NodeDefinition,
  replace: replaceDefinition as NodeDefinition,
  round: roundDefinition as NodeDefinition,
  'split-color': splitColorDefinition as NodeDefinition,
  stop: stopDefinition as NodeDefinition,
  switch: switchDefinition as NodeDefinition,
  'text-combine': textCombineDefinition as NodeDefinition,
  'text-input': textInputDefinition as NodeDefinition,
  'time-difference': timeDifferenceDefinition as NodeDefinition,
  'time-information': timeInformationDefinition as NodeDefinition,
  'token-attribute': tokenAttributeDefinition as NodeDefinition,
  'weather-input': weatherInputDefinition as NodeDefinition,
  truncate: truncateDefinition as NodeDefinition,
}
