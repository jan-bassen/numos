import { actionRootDefinition } from '../node-definitions/action-root'
import { addressInputDefinition } from '../node-definitions/address-input'
import { booleanInputDefinition } from '../node-definitions/boolean-input'
import { cancelDefinition } from '../node-definitions/cancel'
import { changeCollectionAttributeDefinition } from '../node-definitions/change-collection-attribute'
import { changeTokenAttributeDefinition } from '../node-definitions/change-token-attribute'
import { changeTokenDescriptionDefinition } from '../node-definitions/change-token-description'
import { changeTokenNameDefinition } from '../node-definitions/change-token-name'
import { clampDefinition } from '../node-definitions/clamp'
import { collectionAttributeDefinition } from '../node-definitions/collection-attribute'
import { colorInputDefinition } from '../node-definitions/color-input'
import { combineColorDefinition } from '../node-definitions/combine-color'
import { compareDefinition } from '../node-definitions/compare'
import { dataSwitchDefinition } from '../node-definitions/data-switch'
import { datetimeInputDefinition } from '../node-definitions/datetime-input'
import { directionInputDefinition } from '../node-definitions/direction-input'
import { enumInputDefinition } from '../node-definitions/enum-input'
import { imageCombineDefinition } from '../node-definitions/image-combine'
import { imageInputDefinition } from '../node-definitions/image-input'
import { imageMirrorDefinition } from '../node-definitions/image-mirror'
import { imageRotateDefinition } from '../node-definitions/image-rotate'
import { imageRootDefinition } from '../node-definitions/image-root'
import { isInListDefinition } from '../node-definitions/is-in-list'
import { lengthDefinition } from '../node-definitions/length'
import { listAddDefinition } from '../node-definitions/list-add'
import { listLengthDefinition } from '../node-definitions/list-length'
import { locationDistanceDefinition } from '../node-definitions/location-distance'
import { locationInputDefinition } from '../node-definitions/location-input'
import { logicDefinition } from '../node-definitions/logic'
import { logDefinition } from '../node-definitions/log'
import { mapToChoiceDefinition } from '../node-definitions/map-to-choice'
import { mapToDateDefinition } from '../node-definitions/map-to-date'
import { mapToNumberDefinition } from '../node-definitions/map-to-number'
import { metadataDefinition } from '../node-definitions/metadata'
import { mathsDefinition } from '../node-definitions/maths'
import { nowDefinition } from '../node-definitions/now'
import { numberInputDefinition } from '../node-definitions/number-input'
import { parameterDefinition } from '../node-definitions/parameter'
import { randomDefinition } from '../node-definitions/random'
import { replaceDefinition } from '../node-definitions/replace'
import { roundDefinition } from '../node-definitions/round'
import { splitColorDefinition } from '../node-definitions/split-color'
import { stopDefinition } from '../node-definitions/stop'
import { switchDefinition } from '../node-definitions/switch'
import { textCombineDefinition } from '../node-definitions/text-combine'
import { textInputDefinition } from '../node-definitions/text-input'
import { timeDifferenceDefinition } from '../node-definitions/time-difference'
import { timeInformationDefinition } from '../node-definitions/time-information'
import { tokenAttributeDefinition } from '../node-definitions/token-attribute'
import { weatherInputDefinition } from '../node-definitions/weather-input'
import { truncateDefinition } from '../node-definitions/truncate'
import type { NodeDefinition, NodeDefinitions } from '@/types/nodes.types'

export const nodeDefinitions: NodeDefinitions = {
  'action-root': actionRootDefinition as NodeDefinition,
  'address-input': addressInputDefinition as NodeDefinition,
  'boolean-input': booleanInputDefinition as NodeDefinition,
  cancel: cancelDefinition as NodeDefinition,
  'change-collection-attribute':
    changeCollectionAttributeDefinition as NodeDefinition,
  'change-token-attribute': changeTokenAttributeDefinition as NodeDefinition,
  'change-token-description':
    changeTokenDescriptionDefinition as NodeDefinition,
  'change-token-name': changeTokenNameDefinition as NodeDefinition,
  clamp: clampDefinition as NodeDefinition,
  'collection-attribute': collectionAttributeDefinition as NodeDefinition,
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
  'map-to-choice': mapToChoiceDefinition as NodeDefinition,
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
