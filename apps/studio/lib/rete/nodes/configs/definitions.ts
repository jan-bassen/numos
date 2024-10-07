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
import type { NodeDefinitions2 } from '@/types/nodes.types'

export const nodeDefinitions: NodeDefinitions2 = {
  'action-root': actionRootDefinition,
  'address-input': addressInputDefinition,
  'boolean-input': booleanInputDefinition,
  cancel: cancelDefinition,
  'change-collection-attribute': changeCollectionAttributeDefinition,
  'change-token-attribute': changeTokenAttributeDefinition,
  'change-token-description': changeTokenDescriptionDefinition,
  'change-token-name': changeTokenNameDefinition,
  clamp: clampDefinition,
  'collection-attribute': collectionAttributeDefinition,
  'color-input': colorInputDefinition,
  'combine-color': combineColorDefinition,
  compare: compareDefinition,
  'data-switch': dataSwitchDefinition,
  'datetime-input': datetimeInputDefinition,
  'direction-input': directionInputDefinition,
  'enum-input': enumInputDefinition,
  'image-combine': imageCombineDefinition,
  'image-input': imageInputDefinition,
  'image-mirror': imageMirrorDefinition,
  'image-rotate': imageRotateDefinition,
  'image-root': imageRootDefinition,
  'is-in-list': isInListDefinition,
  length: lengthDefinition,
  'list-add': listAddDefinition,
  'list-length': listLengthDefinition,
  'location-distance': locationDistanceDefinition,
  'location-input': locationInputDefinition,
  logic: logicDefinition,
  log: logDefinition,
  'map-to-choice': mapToChoiceDefinition,
  'map-to-date': mapToDateDefinition,
  'map-to-number': mapToNumberDefinition,
  metadata: metadataDefinition,
  maths: mathsDefinition,
  now: nowDefinition,
  'number-input': numberInputDefinition,
  parameter: parameterDefinition,
  random: randomDefinition,
  replace: replaceDefinition,
  round: roundDefinition,
  'split-color': splitColorDefinition,
  stop: stopDefinition,
  switch: switchDefinition,
  'text-combine': textCombineDefinition,
  'text-input': textInputDefinition,
  'time-difference': timeDifferenceDefinition,
  'time-information': timeInformationDefinition,
  'token-attribute': tokenAttributeDefinition,
  'weather-input': weatherInputDefinition,
  truncate: truncateDefinition,
}
