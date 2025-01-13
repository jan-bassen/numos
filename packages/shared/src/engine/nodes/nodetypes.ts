import type { AnyNodeLogic, NodeType } from '@repo/shared/types/node-types'
import { actionRootLogic } from '@repo/shared/engine/nodes/action-root/logic'
import { addressInputLogic } from '@repo/shared/engine/nodes/address-input/logic'
import { booleanInputLogic } from '@repo/shared/engine/nodes/boolean-input/logic'
import { cancelLogic } from '@repo/shared/engine/nodes/cancel/logic'
import { changeTokenAttributeLogic } from '@repo/shared/engine/nodes/change-token-attribute/logic'
import { changeTokenDescriptionLogic } from '@repo/shared/engine/nodes/change-token-description/logic'
import { changeTokenNameLogic } from '@repo/shared/engine/nodes/change-token-name/logic'
import { clampLogic } from '@repo/shared/engine/nodes/clamp/logic'
import { colorInputLogic } from '@repo/shared/engine/nodes/color-input/logic'
import { combineColorLogic } from '@repo/shared/engine/nodes/combine-color/logic'
import { compareLogic } from '@repo/shared/engine/nodes/compare/logic'
import { dataSwitchLogic } from '@repo/shared/engine/nodes/data-switch/logic'
import { datetimeInputLogic } from '@repo/shared/engine/nodes/datetime-input/logic'
import { directionInputLogic } from '@repo/shared/engine/nodes/direction-input/logic'
import { enumInputLogic } from '@repo/shared/engine/nodes/enum-input/logic'
import { ImageCombineLogic } from '@repo/shared/engine/nodes/image-combine/logic'
import { imageInputLogic } from '@repo/shared/engine/nodes/image-input/logic'
import { imageMirrorLogic } from '@repo/shared/engine/nodes/image-mirror/logic'
import { imageRootLogic } from '@repo/shared/engine/nodes/image-root/logic'
import { imageRotateLogic } from '@repo/shared/engine/nodes/image-rotate/logic'
import { IsInListLogic } from '@repo/shared/engine/nodes/is-in-list/logic'
import { lengthLogic } from '@repo/shared/engine/nodes/length/logic'
import { listAddLogic } from '@repo/shared/engine/nodes/list-add/logic'
import { listLengthLogic } from '@repo/shared/engine/nodes/list-length/logic'
import { locationDistanceLogic } from '@repo/shared/engine/nodes/location-distance/logic'
import { locationInputLogic } from '@repo/shared/engine/nodes/location-input/logic'
import { logLogic } from '@repo/shared/engine/nodes/log/logic'
import { logicLogic } from '@repo/shared/engine/nodes/logic/logic'
import { mapToDateLogic } from '@repo/shared/engine/nodes/map-to-date/logic'
import { mapToNumberLogic } from '@repo/shared/engine/nodes/map-to-number/logic'
import { mathsLogic } from '@repo/shared/engine/nodes/maths/logic'
import { metadataLogic } from '@repo/shared/engine/nodes/metadata/logic'
import { nowLogic } from '@repo/shared/engine/nodes/now/logic'
import { numberInputLogic } from '@repo/shared/engine/nodes/number-input/logic'
import { parameterLogic } from '@repo/shared/engine/nodes/parameter/logic'
import { randomLogic } from '@repo/shared/engine/nodes/random/logic'
import { replaceLogic } from '@repo/shared/engine/nodes/replace/logic'
import { roundLogic } from '@repo/shared/engine/nodes/round/logic'
import { splitColorLogic } from '@repo/shared/engine/nodes/split-color/logic'
import { stopLogic } from '@repo/shared/engine/nodes/stop/logic'
import { switchLogic } from '@repo/shared/engine/nodes/switch/logic'
import { textCombineLogic } from '@repo/shared/engine/nodes/text-combine/logic'
import { textInputLogic } from '@repo/shared/engine/nodes/text-input/logic'
import { timeDifferenceLogic } from '@repo/shared/engine/nodes/time-difference/logic'
import { timeInformationLogic } from '@repo/shared/engine/nodes/time-information/logic'
import { tokenAttributeLogic } from '@repo/shared/engine/nodes/token-attribute/logic'
import { truncateLogic } from '@repo/shared/engine/nodes/truncate/logic'
import { weatherInputLogic } from '@repo/shared/engine/nodes/weather-input/logic'

export const nodeTypes = [
  'action-root',
  'address-input',
  'boolean-input',
  'cancel',
  'change-token-attribute',
  'change-token-description',
  'change-token-name',
  'clamp',
  'color-input',
  'combine-color',
  'compare',
  'data-switch',
  'datetime-input',
  'enum-input',
  'image-combine',
  'image-input',
  'image-root',
  'is-in-list',
  'length',
  'list-add',
  'list-length',
  'location-distance',
  'location-input',
  'maths',
  'now',
  'number-input',
  'parameter',
  'random',
  'replace',
  'text-combine',
  'truncate',
  'token-attribute',
  'weather-input',
  'map-to-number',
  'map-to-date',
  'direction-input',
  'time-difference',
  'time-information',
  'image-rotate',
  'image-mirror',
  'switch',
  'log',
  'stop',
  'split-color',
  'text-input',
  'metadata',
  'location-input',
  'logic',
  'round',
] as const

export const nodeLogic: Record<NodeType, AnyNodeLogic> = {
  'action-root': actionRootLogic,
  'address-input': addressInputLogic,
  'boolean-input': booleanInputLogic,
  cancel: cancelLogic,
  'change-token-attribute': changeTokenAttributeLogic,
  'change-token-description': changeTokenDescriptionLogic,
  'change-token-name': changeTokenNameLogic,
  clamp: clampLogic,
  'color-input': colorInputLogic,
  'combine-color': combineColorLogic,
  compare: compareLogic,
  'data-switch': dataSwitchLogic,
  'datetime-input': datetimeInputLogic,
  'enum-input': enumInputLogic,
  'image-combine': ImageCombineLogic,
  'image-input': imageInputLogic,
  'image-root': imageRootLogic,
  'is-in-list': IsInListLogic,
  length: lengthLogic,
  'list-add': listAddLogic,
  'list-length': listLengthLogic,
  'location-distance': locationDistanceLogic,
  maths: mathsLogic,
  now: nowLogic,
  'number-input': numberInputLogic,
  parameter: parameterLogic,
  random: randomLogic,
  replace: replaceLogic,
  'text-combine': textCombineLogic,
  truncate: truncateLogic,
  'token-attribute': tokenAttributeLogic,
  'weather-input': weatherInputLogic,
  'map-to-number': mapToNumberLogic,
  'map-to-date': mapToDateLogic,
  'direction-input': directionInputLogic,
  'time-difference': timeDifferenceLogic,
  'time-information': timeInformationLogic,
  'image-rotate': imageRotateLogic,
  'image-mirror': imageMirrorLogic,
  switch: switchLogic,
  log: logLogic,
  stop: stopLogic,
  'split-color': splitColorLogic,
  'text-input': textInputLogic,
  metadata: metadataLogic,
  'location-input': locationInputLogic,
  logic: logicLogic,
  round: roundLogic,
} as const
