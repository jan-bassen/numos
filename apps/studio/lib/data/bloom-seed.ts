'use client'

import {
  DEMO_ACCOUNT_ID,
  DEMO_PROFILE,
  DEMO_USER_ID,
} from '@/lib/data/demo-constants'
import {
  bulkPut,
  getAll,
  patch,
  put,
  putBlob,
  removeMany,
} from '@/lib/data/store'
import type {
  Action,
  Attribute,
  Collection,
  Folder,
  Layer,
  Profile,
  Upload,
  Version,
} from '@/types/database.types'
import type { Tables } from '@/types/database.types'
import type { SavedConnection, SavedNode } from '@repo/shared/types/graph-types'
import type { OptionalDataType, ValueType } from '@repo/shared/types/values'

type StoredActionNode = SavedNode & { action: string }
type StoredActionConnection = SavedConnection & { action: string }
type StoredImageNode = SavedNode & { layer: string }
type StoredImageConnection = SavedConnection & { layer: string }

const now = () => new Date().toISOString()

const COLLECTION_ID = '00000000-0000-4000-8000-000000000100'
const VERSION_ID = '00000000-0000-4000-8000-000000000101'
const LAYER_ID = '00000000-0000-4000-8000-000000000300'
const FLOWER_FOLDER_ID = '00000000-0000-4000-8000-000000000301'

const ATTR = {
  growth: '00000000-0000-4000-8000-000000000201',
  health: '00000000-0000-4000-8000-000000000202',
  bloom: '00000000-0000-4000-8000-000000000203',
  hydration: '00000000-0000-4000-8000-000000000204',
  sunlight: '00000000-0000-4000-8000-000000000205',
  stress: '00000000-0000-4000-8000-000000000206',
} as const

const ACTION = {
  water: '00000000-0000-4000-8000-000000000401',
  sun: '00000000-0000-4000-8000-000000000402',
  fertilize: '00000000-0000-4000-8000-000000000403',
  prune: '00000000-0000-4000-8000-000000000404',
  passDay: '00000000-0000-4000-8000-000000000405',
} as const

const flowerFiles = [
  '1-1.svg',
  '1-2.svg',
  '1-3.svg',
  '1-4.svg',
  '2-1.svg',
  '2-2.svg',
  '2-3.svg',
  '2-4.svg',
  '3-1-1.svg',
  '3-1-2.svg',
  '3-2-1.svg',
  '3-2-2.svg',
  '3-3-1.svg',
  '3-3-2.svg',
  '3-4-1.svg',
  '3-4-2.svg',
  '4-1-1.svg',
  '4-1-2.svg',
  '4-2-1.svg',
  '4-2-2.svg',
  '4-3-1.svg',
  '4-3-2.svg',
  '4-4-1.svg',
  '4-4-2.svg',
]

function numberValue(value: number) {
  return { type: 'number', format: 'single', value } as const
}

function emptyNumberValue() {
  return { type: 'number', format: 'single', value: undefined } as const
}

function stringValue(value: string) {
  return { type: 'string', format: 'single', value } as const
}

function enumValue(value: string) {
  return { type: 'enum', format: 'single', value } as const
}

function emptyBooleanValue() {
  return { type: 'boolean', format: 'single', value: undefined } as const
}

function imageValue(value: string) {
  return { type: 'image', format: 'single', value } as const
}

function breakpointsValue(values: number[]) {
  return {
    type: 'number',
    format: 'objectarray',
    value: values.map((value) => ({
      id: `breakpoint-${value}`,
      value,
    })),
  } as const
}

class GraphBuilder {
  nodes: SavedNode[] = []
  connections: SavedConnection[] = []
  private connectionIndex = 0

  constructor(private readonly prefix: string) {}

  node(
    type: SavedNode['type'],
    key: string,
    x: number,
    y: number,
    state: SavedNode['state'] = {},
    comment?: string,
  ) {
    const id = `${this.prefix}-${key}`
    this.nodes.push({
      id,
      type,
      x,
      y,
      state,
      comment,
    })
    return id
  }

  connect(
    source: string,
    sourceOutput: string,
    target: string,
    targetInput: string,
    type: OptionalDataType,
  ) {
    this.connectionIndex += 1
    this.connections.push({
      id: `${this.prefix}-connection-${this.connectionIndex}`,
      source,
      target,
      sourceOutput,
      targetInput,
      type,
    })
  }
}

function createNumberInput(
  graph: GraphBuilder,
  key: string,
  value: number,
  x: number,
  y: number,
  comment?: string,
) {
  return graph.node(
    'number-input',
    key,
    x,
    y,
    { controls: { number: numberValue(value) } },
    comment,
  )
}

function createTextInput(
  graph: GraphBuilder,
  key: string,
  value: string,
  x: number,
  y: number,
) {
  return graph.node('text-input', key, x, y, {
    controls: { text: stringValue(value) },
  })
}

function createAttributeInput(
  graph: GraphBuilder,
  key: string,
  attribute: string,
  x: number,
  y: number,
  comment?: string,
) {
  return graph.node(
    'token-attribute',
    key,
    x,
    y,
    { controls: { attribute: enumValue(attribute) } },
    comment,
  )
}

function createCompare(
  graph: GraphBuilder,
  key: string,
  mode: string,
  x: number,
  y: number,
) {
  return graph.node('compare', key, x, y, {
    controls: { mode: enumValue(mode) },
  })
}

function createClampedAttributeChange(
  graph: GraphBuilder,
  options: {
    key: string
    attribute: string
    delta: number
    min: number
    max: number
    x: number
    y: number
    execFrom: string
    execOutput?: string
    comment?: string
  },
) {
  const { key, attribute, delta, min, max, x, y, execFrom, comment } = options
  const current = createAttributeInput(
    graph,
    `${key}-current`,
    attribute,
    x,
    y,
    comment,
  )
  const deltaNode = createNumberInput(
    graph,
    `${key}-delta`,
    Math.abs(delta),
    x,
    y + 170,
  )
  const math = graph.node('maths', `${key}-math`, x + 250, y + 70, {
    controls: { mode: enumValue(delta >= 0 ? 'add' : 'sub') },
  })
  const minNode = createNumberInput(graph, `${key}-min`, min, x + 250, y + 250)
  const maxNode = createNumberInput(graph, `${key}-max`, max, x + 250, y + 420)
  const clamp = graph.node('clamp', `${key}-clamp`, x + 520, y + 120, {})
  const change = graph.node(
    'change-token-attribute',
    `${key}-change`,
    x + 800,
    y + 145,
    {
      controls: {
        attribute: enumValue(attribute),
        mode: enumValue('set'),
      },
    },
  )

  graph.connect(execFrom, options.execOutput ?? 'exec', change, 'exec', 'exec')
  graph.connect(current, 'attribute', math, 'number1', 'number')
  graph.connect(deltaNode, 'output', math, 'number2', 'number')
  graph.connect(math, 'output', clamp, 'number', 'number')
  graph.connect(minNode, 'output', clamp, 'min', 'number')
  graph.connect(maxNode, 'output', clamp, 'max', 'number')
  graph.connect(clamp, 'output', change, 'value', 'number')

  return change
}

function createLog(
  graph: GraphBuilder,
  key: string,
  message: string,
  x: number,
  y: number,
  execFrom: string,
  execOutput = 'exec',
) {
  const text = createTextInput(graph, `${key}-message`, message, x, y + 130)
  const log = graph.node('log', key, x + 260, y, {})
  graph.connect(execFrom, execOutput, log, 'exec', 'exec')
  graph.connect(text, 'output', log, 'value', 'string')
  return log
}

function buildSimpleCareActionGraph(
  prefix: string,
  steps: Array<{
    key: string
    attribute: string
    delta: number
    min: number
    max: number
    label: string
  }>,
  message: string,
) {
  const graph = new GraphBuilder(prefix)
  const root = graph.node(
    'action-root',
    'trigger',
    -720,
    -80,
    {},
    'Run this action in the simulation panel to see how it changes the flower token state.',
  )
  let execFrom = root
  let y = -280
  steps.forEach((step, index) => {
    const change = createClampedAttributeChange(graph, {
      ...step,
      x: -420,
      y,
      execFrom,
      comment: index === 0 ? step.label : undefined,
    })
    execFrom = change
    y += 520
  })
  createLog(graph, 'result-log', message, 680, y - 440, execFrom)
  return graph
}

function createInlineClampedAttributeChange(
  graph: GraphBuilder,
  options: {
    key: string
    attribute: string
    delta: number
    min: number
    max: number
    x: number
    y: number
    execFrom?: string
    comment?: string
  },
) {
  const { key, attribute, delta, min, max, x, y, execFrom, comment } = options
  const current = createAttributeInput(graph, `${key}-current`, attribute, x, y)
  const math = graph.node('maths', `${key}-math`, x + 230, y - 15, {
    inputs: {
      number2: numberValue(Math.abs(delta)),
    },
    controls: { mode: enumValue(delta >= 0 ? 'add' : 'sub') },
  })
  const clamp = graph.node('clamp', `${key}-clamp`, x + 475, y - 10, {
    inputs: {
      min: numberValue(min),
      max: numberValue(max),
    },
  })
  const change = graph.node(
    'change-token-attribute',
    `${key}-change`,
    x + 745,
    y - 85,
    {
      controls: {
        attribute: enumValue(attribute),
        mode: enumValue('set'),
      },
    },
    comment,
  )

  if (execFrom) {
    graph.connect(execFrom, 'exec', change, 'exec', 'exec')
  }
  graph.connect(current, 'attribute', math, 'number1', 'number')
  graph.connect(math, 'output', clamp, 'number', 'number')
  graph.connect(clamp, 'output', change, 'value', 'number')

  return change
}

function buildWaterFlowerGraph() {
  const graph = new GraphBuilder('water-flower')
  const trigger = graph.node(
    'action-root',
    'trigger',
    -739.1982421875,
    171.55322265625,
    {},
    '',
  )
  const hydrationCurrent = graph.node(
    'token-attribute',
    'hydration-current',
    -530.3359375,
    -145.08203125,
    { inputs: {}, controls: { attribute: enumValue(ATTR.hydration) } },
  )
  const hydrationMath = graph.node(
    'maths',
    'hydration-math',
    -298.3046875,
    -160.03515625,
    {
      inputs: {
        number1: emptyNumberValue(),
        number2: numberValue(1),
      },
      controls: { mode: enumValue('add') },
    },
  )
  const hydrationClamp = graph.node(
    'clamp',
    'hydration-clamp',
    -51.37890625,
    -102.22265625,
    {
      inputs: {
        number: emptyNumberValue(),
        min: numberValue(0),
        max: numberValue(3),
      },
      controls: {},
    },
  )
  const hydrationChange = graph.node(
    'change-token-attribute',
    'hydration-change',
    211.96484375,
    -45.66015625,
    {
      inputs: { value: emptyNumberValue() },
      controls: {
        attribute: enumValue(ATTR.hydration),
        mode: enumValue('set'),
      },
    },
    'Watering increases hydration...',
  )
  const healthCurrent = graph.node(
    'token-attribute',
    'health-current',
    -277.6376953125,
    344.267578125,
    { inputs: {}, controls: { attribute: enumValue(ATTR.health) } },
  )
  const healthMath = graph.node(
    'maths',
    'health-math',
    -45.29052734375,
    319.77734375,
    {
      inputs: {
        number1: emptyNumberValue(),
        number2: numberValue(1),
      },
      controls: { mode: enumValue('add') },
    },
  )
  const healthClamp = graph.node(
    'clamp',
    'health-clamp',
    217.8125,
    316.12890625,
    {
      inputs: {
        number: emptyNumberValue(),
        min: numberValue(1),
        max: numberValue(4),
      },
      controls: {},
    },
  )
  const healthChange = graph.node(
    'change-token-attribute',
    'health-change',
    537.6953125,
    108.546875,
    {
      inputs: { value: emptyNumberValue() },
      controls: {
        attribute: enumValue(ATTR.health),
        mode: enumValue('set'),
      },
    },
    '...and health',
  )

  graph.connect(trigger, 'exec', hydrationChange, 'exec', 'exec')
  graph.connect(
    hydrationCurrent,
    'attribute',
    hydrationMath,
    'number1',
    'number',
  )
  graph.connect(hydrationMath, 'output', hydrationClamp, 'number', 'number')
  graph.connect(hydrationClamp, 'output', hydrationChange, 'value', 'number')
  graph.connect(hydrationChange, 'exec', healthChange, 'exec', 'exec')
  graph.connect(healthCurrent, 'attribute', healthMath, 'number1', 'number')
  graph.connect(healthMath, 'output', healthClamp, 'number', 'number')
  graph.connect(healthClamp, 'output', healthChange, 'value', 'number')

  return graph
}

function buildFertilizeGraph() {
  const graph = new GraphBuilder('fertilize')
  const trigger = graph.node(
    'action-root',
    'trigger',
    -717.7272879636481,
    -19.14542961711251,
    {},
    '',
  )
  const growthCurrent = graph.node(
    'token-attribute',
    'growth-current',
    -381.5857553665198,
    -292.0778411074698,
    { controls: { attribute: enumValue(ATTR.growth) } },
    '',
  )
  const growthMath = graph.node(
    'maths',
    'growth-math',
    -128.86932336116595,
    -309.91275009333407,
    {
      inputs: {
        number1: emptyNumberValue(),
        number2: numberValue(1),
      },
      controls: { mode: enumValue('add') },
    },
  )
  const growthClamp = graph.node(
    'clamp',
    'growth-clamp',
    107.90037993588972,
    -182.65677451477413,
    {
      inputs: {
        number: emptyNumberValue(),
        min: numberValue(1),
        max: numberValue(4),
      },
      controls: {},
    },
  )
  const growthChange = graph.node(
    'change-token-attribute',
    'growth-change',
    380,
    -135,
    {
      inputs: { value: emptyNumberValue() },
      controls: {
        attribute: enumValue(ATTR.growth),
        mode: enumValue('set'),
      },
    },
    'Fertilizer pushes growth...',
  )
  const stressCurrent = graph.node(
    'token-attribute',
    'stress-current',
    -183.76781747862913,
    234.2513601430761,
    { inputs: {}, controls: { attribute: enumValue(ATTR.stress) } },
  )
  const stressMath = graph.node(
    'maths',
    'stress-math',
    67.65533315365786,
    220.5181552609135,
    {
      inputs: {
        number1: emptyNumberValue(),
        number2: numberValue(1),
      },
      controls: { mode: enumValue('add') },
    },
  )
  const stressClamp = graph.node(
    'clamp',
    'stress-clamp',
    372.18432244880324,
    223.74898828427325,
    {
      inputs: {
        number: emptyNumberValue(),
        min: numberValue(0),
        max: numberValue(3),
      },
      controls: {},
    },
  )
  const stressChange = graph.node(
    'change-token-attribute',
    'stress-change',
    744.0181223748198,
    21.483195868223806,
    {
      inputs: { value: emptyNumberValue() },
      controls: {
        attribute: enumValue(ATTR.stress),
        mode: enumValue('set'),
      },
    },
    '... but adds stress.',
  )

  graph.connect(trigger, 'exec', growthChange, 'exec', 'exec')
  graph.connect(growthChange, 'exec', stressChange, 'exec', 'exec')
  graph.connect(growthCurrent, 'attribute', growthMath, 'number1', 'number')
  graph.connect(growthMath, 'output', growthClamp, 'number', 'number')
  graph.connect(growthClamp, 'output', growthChange, 'value', 'number')
  graph.connect(stressCurrent, 'attribute', stressMath, 'number1', 'number')
  graph.connect(stressMath, 'output', stressClamp, 'number', 'number')
  graph.connect(stressClamp, 'output', stressChange, 'value', 'number')

  return graph
}

function buildGiveSunGraph() {
  const graph = new GraphBuilder('give-sun')
  const trigger = graph.node(
    'action-root',
    'trigger',
    -637.3021910148884,
    -18.010369936935177,
    {},
    '',
  )
  const sunlightCurrent = graph.node(
    'token-attribute',
    'sunlight-current',
    -413.8280183343086,
    -263.4739288732852,
    { inputs: {}, controls: { attribute: enumValue(ATTR.sunlight) } },
    '',
  )
  const sunlightMath = graph.node(
    'maths',
    'sunlight-math',
    -165.8769138872635,
    -240.12213729601456,
    {
      inputs: {
        number1: emptyNumberValue(),
        number2: numberValue(1),
      },
      controls: { mode: enumValue('add') },
    },
  )
  const sunlightClamp = graph.node(
    'clamp',
    'sunlight-clamp',
    108.26303556335739,
    -193.18283312203368,
    {
      inputs: {
        number: emptyNumberValue(),
        min: numberValue(0),
        max: numberValue(3),
      },
      controls: {},
    },
  )
  const sunlightChange = graph.node(
    'change-token-attribute',
    'sunlight-change',
    380,
    -135,
    {
      inputs: { value: emptyNumberValue() },
      controls: {
        attribute: enumValue(ATTR.sunlight),
        mode: enumValue('set'),
      },
    },
    'Plant absorbs sunlight...',
  )
  const growthCurrent = graph.node(
    'token-attribute',
    'growth-current',
    -204.5835060301671,
    233.71419080358885,
    { inputs: {}, controls: { attribute: enumValue(ATTR.growth) } },
  )
  const growthMath = graph.node(
    'maths',
    'growth-math',
    75.31940787335023,
    212.49196451791173,
    {
      inputs: {
        number1: emptyNumberValue(),
        number2: numberValue(1),
      },
      controls: { mode: enumValue('add') },
    },
  )
  const growthClamp = graph.node(
    'clamp',
    'growth-clamp',
    383.67506989142447,
    210.6287688544308,
    {
      inputs: {
        number: emptyNumberValue(),
        min: numberValue(1),
        max: numberValue(4),
      },
      controls: {},
    },
  )
  const growthChange = graph.node(
    'change-token-attribute',
    'growth-change',
    682.3048424192186,
    36.69197183213058,
    {
      inputs: { value: emptyNumberValue() },
      controls: {
        attribute: enumValue(ATTR.growth),
        mode: enumValue('set'),
      },
    },
    '... and grows',
  )

  graph.connect(trigger, 'exec', sunlightChange, 'exec', 'exec')
  graph.connect(sunlightChange, 'exec', growthChange, 'exec', 'exec')
  graph.connect(sunlightCurrent, 'attribute', sunlightMath, 'number1', 'number')
  graph.connect(sunlightMath, 'output', sunlightClamp, 'number', 'number')
  graph.connect(sunlightClamp, 'output', sunlightChange, 'value', 'number')
  graph.connect(growthCurrent, 'attribute', growthMath, 'number1', 'number')
  graph.connect(growthMath, 'output', growthClamp, 'number', 'number')
  graph.connect(growthClamp, 'output', growthChange, 'value', 'number')

  return graph
}

function buildPruneGraph() {
  const graph = new GraphBuilder('prune')
  const trigger = graph.node(
    'action-root',
    'trigger',
    -718.1015625,
    -22.54296875,
    {},
    '',
  )
  const stressCurrent = graph.node(
    'token-attribute',
    'stress-current',
    -399.94140625,
    -211.9375,
    { inputs: {}, controls: { attribute: enumValue(ATTR.stress) } },
    '',
  )
  const stressMath = graph.node(
    'maths',
    'stress-math',
    -156.62890625,
    -241.75,
    {
      inputs: {
        number1: emptyNumberValue(),
        number2: numberValue(1),
      },
      controls: { mode: enumValue('sub') },
    },
  )
  const stressClamp = graph.node(
    'clamp',
    'stress-clamp',
    109.5703125,
    -211.87890625,
    {
      inputs: {
        number: emptyNumberValue(),
        min: numberValue(0),
        max: numberValue(3),
      },
      controls: {},
    },
  )
  const stressChange = graph.node(
    'change-token-attribute',
    'stress-change',
    380,
    -135,
    {
      inputs: { value: emptyNumberValue() },
      controls: {
        attribute: enumValue(ATTR.stress),
        mode: enumValue('set'),
      },
    },
    'Pruning lowers stress...',
  )
  const healthCurrent = graph.node(
    'token-attribute',
    'health-current',
    -146.74394269577047,
    245.78339015447028,
    { inputs: {}, controls: { attribute: enumValue(ATTR.health) } },
  )
  const healthMath = graph.node(
    'maths',
    'health-math',
    99.43190775563117,
    206.08698036980203,
    {
      inputs: {
        number1: emptyNumberValue(),
        number2: numberValue(1),
      },
      controls: { mode: enumValue('sub') },
    },
  )
  const healthClamp = graph.node(
    'clamp',
    'health-clamp',
    376.6045720901256,
    191.87043583889778,
    {
      inputs: {
        number: emptyNumberValue(),
        min: numberValue(1),
        max: numberValue(4),
      },
      controls: {},
    },
  )
  const healthChange = graph.node(
    'change-token-attribute',
    'health-change',
    690.3046322909926,
    36.34142321313006,
    {
      inputs: { value: emptyNumberValue() },
      controls: {
        attribute: enumValue(ATTR.health),
        mode: enumValue('set'),
      },
    },
    '..., but resets growth a bit.',
  )
  const resultMessage = graph.node(
    'text-input',
    'result-log-message',
    940,
    230,
    {
      inputs: {},
      controls: {
        text: stringValue(
          'Pruned the flower. Stress dropped and health improved.',
        ),
      },
    },
  )
  const resultLog = graph.node('log', 'result-log', 1210, 105, {})

  graph.connect(trigger, 'exec', stressChange, 'exec', 'exec')
  graph.connect(stressChange, 'exec', healthChange, 'exec', 'exec')
  graph.connect(healthChange, 'exec', resultLog, 'exec', 'exec')
  graph.connect(stressCurrent, 'attribute', stressMath, 'number1', 'number')
  graph.connect(stressMath, 'output', stressClamp, 'number', 'number')
  graph.connect(stressClamp, 'output', stressChange, 'value', 'number')
  graph.connect(healthCurrent, 'attribute', healthMath, 'number1', 'number')
  graph.connect(healthMath, 'output', healthClamp, 'number', 'number')
  graph.connect(healthClamp, 'output', healthChange, 'value', 'number')
  graph.connect(resultMessage, 'output', resultLog, 'value', 'string')

  return graph
}

function buildPassDayGraph() {
  const graph = new GraphBuilder('pass-day')
  const savedGraph: {
    nodes: SavedNode[]
    connections: SavedConnection[]
  } = {
    nodes: [
      {
        id: 'pass-day-calm-growth-change',
        type: 'change-token-attribute',
        x: 1092.3564327039066,
        y: 152.86230820641356,
        comment: 'A calm day advances growth.',
        state: {
          inputs: {
            value: emptyNumberValue(),
          },
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000201',
            },
            mode: {
              type: 'enum',
              format: 'single',
              value: 'set',
            },
          },
        },
      },
      {
        id: 'pass-day-calm-growth-clamp',
        type: 'clamp',
        x: 803.4639971206806,
        y: 366.70009241791,
        state: {
          inputs: {
            number: emptyNumberValue(),
            min: numberValue(1),
            max: numberValue(4),
          },
          controls: {},
        },
      },
      {
        id: 'pass-day-calm-growth-current',
        type: 'token-attribute',
        x: 280.06381416574123,
        y: 409.0109707132783,
        comment: '',
        state: {
          inputs: {},
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000201',
            },
          },
        },
      },
      {
        id: 'pass-day-calm-growth-math',
        type: 'maths',
        x: 521.1257997225293,
        y: 356.9416678993569,
        state: {
          inputs: {
            number1: emptyNumberValue(),
            number2: numberValue(1),
          },
          controls: {
            mode: {
              type: 'enum',
              format: 'single',
              value: 'add',
            },
          },
        },
      },
      {
        id: 'pass-day-calm-hydration-change',
        type: 'change-token-attribute',
        x: 2005.3327040477698,
        y: 292.6754612127999,
        comment: 'Growth consumes stored water...',
        state: {
          inputs: {
            value: emptyNumberValue(),
          },
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000204',
            },
            mode: {
              type: 'enum',
              format: 'single',
              value: 'set',
            },
          },
        },
      },
      {
        id: 'pass-day-calm-hydration-clamp',
        type: 'clamp',
        x: 1713.2087272915514,
        y: 536.7502611388642,
        state: {
          inputs: {
            number: emptyNumberValue(),
            min: numberValue(0),
            max: numberValue(3),
          },
          controls: {},
        },
      },
      {
        id: 'pass-day-calm-hydration-current',
        type: 'token-attribute',
        x: 1215.5286950265888,
        y: 591.4221262623768,
        comment: '',
        state: {
          inputs: {},
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000204',
            },
          },
        },
      },
      {
        id: 'pass-day-calm-hydration-math',
        type: 'maths',
        x: 1459.8814742743505,
        y: 528.1176344619599,
        state: {
          inputs: {
            number1: emptyNumberValue(),
            number2: numberValue(1),
          },
          controls: {
            mode: {
              type: 'enum',
              format: 'single',
              value: 'sub',
            },
          },
        },
      },
      {
        id: 'pass-day-calm-sunlight-change',
        type: 'change-token-attribute',
        x: 3029.753845942868,
        y: 362.3199592710749,
        comment: '...and sunlight.',
        state: {
          inputs: {
            value: emptyNumberValue(),
          },
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000205',
            },
            mode: {
              type: 'enum',
              format: 'single',
              value: 'set',
            },
          },
        },
      },
      {
        id: 'pass-day-calm-sunlight-clamp',
        type: 'clamp',
        x: 2766.330877319697,
        y: 611.5451703755327,
        state: {
          inputs: {
            number: emptyNumberValue(),
            min: numberValue(0),
            max: numberValue(3),
          },
          controls: {},
        },
      },
      {
        id: 'pass-day-calm-sunlight-current',
        type: 'token-attribute',
        x: 2273.190499509318,
        y: 611.3081828741736,
        comment: '',
        state: {
          inputs: {},
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000205',
            },
          },
        },
      },
      {
        id: 'pass-day-calm-sunlight-math',
        type: 'maths',
        x: 2507.547834762198,
        y: 594.0611290893896,
        state: {
          inputs: {
            number1: emptyNumberValue(),
            number2: numberValue(1),
          },
          controls: {
            mode: {
              type: 'enum',
              format: 'single',
              value: 'sub',
            },
          },
        },
      },
      {
        id: 'pass-day-high-stress-cooldown-change',
        type: 'change-token-attribute',
        x: 2113.2725602660985,
        y: -269.352777366881,
        comment: 'A hard day also burns off a little stress.',
        state: {
          inputs: {
            value: emptyNumberValue(),
          },
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000206',
            },
            mode: {
              type: 'enum',
              format: 'single',
              value: 'set',
            },
          },
        },
      },
      {
        id: 'pass-day-high-stress-cooldown-clamp',
        type: 'clamp',
        x: 1861.180496235393,
        y: -345.9024680108005,
        state: {
          inputs: {
            number: emptyNumberValue(),
            min: numberValue(0),
            max: numberValue(3),
          },
          controls: {},
        },
      },
      {
        id: 'pass-day-high-stress-cooldown-current',
        type: 'token-attribute',
        x: 1356.8322767545103,
        y: -373.0309829037711,
        comment: '',
        state: {
          inputs: {},
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000206',
            },
          },
        },
      },
      {
        id: 'pass-day-high-stress-cooldown-math',
        type: 'maths',
        x: 1607.9444009381637,
        y: -397.06928682643655,
        state: {
          inputs: {
            number1: emptyNumberValue(),
            number2: numberValue(1),
          },
          controls: {
            mode: {
              type: 'enum',
              format: 'single',
              value: 'sub',
            },
          },
        },
      },
      {
        id: 'pass-day-high-stress-health-change',
        type: 'change-token-attribute',
        x: 1060,
        y: -285,
        comment: 'High stress makes the flower wilt.',
        state: {
          inputs: {
            value: emptyNumberValue(),
          },
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000202',
            },
            mode: {
              type: 'enum',
              format: 'single',
              value: 'set',
            },
          },
        },
      },
      {
        id: 'pass-day-high-stress-health-clamp',
        type: 'clamp',
        x: 777.6800360267237,
        y: -394.1249018757579,
        state: {
          inputs: {
            number: emptyNumberValue(),
            min: numberValue(1),
            max: numberValue(4),
          },
          controls: {},
        },
      },
      {
        id: 'pass-day-high-stress-health-current',
        type: 'token-attribute',
        x: 268.9015513552232,
        y: -398.69188107576633,
        comment: '',
        state: {
          inputs: {},
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000202',
            },
          },
        },
      },
      {
        id: 'pass-day-high-stress-health-math',
        type: 'maths',
        x: 511.11212418365307,
        y: -411.5633643019152,
        state: {
          inputs: {
            number1: emptyNumberValue(),
            number2: numberValue(1),
          },
          controls: {
            mode: {
              type: 'enum',
              format: 'single',
              value: 'sub',
            },
          },
        },
      },
      {
        id: 'pass-day-stress',
        type: 'token-attribute',
        x: -584.5106188350246,
        y: 17.713087654750396,
        state: {
          inputs: {},
          controls: {
            attribute: {
              type: 'enum',
              format: 'single',
              value: '00000000-0000-4000-8000-000000000206',
            },
          },
        },
      },
      {
        id: 'pass-day-stress-check',
        type: 'compare',
        x: -329.3539204308403,
        y: -25.041498600499892,
        state: {
          inputs: {
            value1: emptyNumberValue(),
            value2: numberValue(3),
          },
          controls: {
            mode: {
              type: 'enum',
              format: 'single',
              value: 'ge',
            },
          },
        },
      },
      {
        id: 'pass-day-stress-switch',
        type: 'switch',
        x: -40,
        y: -120,
        comment:
          'If stress is high, the day damages the flower. Otherwise the flower grows and consumes stored water and sunlight.',
        state: {
          inputs: {
            switch: emptyBooleanValue(),
          },
          controls: {},
        },
      },
      {
        id: 'pass-day-trigger',
        type: 'action-root',
        x: -830.8399318283964,
        y: -249.0423255317234,
        comment:
          'Pass Day is the collection rulebook: stressed flowers lose health, calm flowers grow but consume care resources.',
        state: {
          inputs: {},
          controls: {},
        },
      },
    ],
    connections: [
      {
        id: 'pass-day-connection-1',
        source: 'pass-day-trigger',
        target: 'pass-day-stress-switch',
        sourceOutput: 'exec',
        targetInput: 'exec',
        type: 'exec',
      },
      {
        id: 'pass-day-connection-11',
        source: 'pass-day-high-stress-health-clamp',
        target: 'pass-day-high-stress-health-change',
        sourceOutput: 'output',
        targetInput: 'value',
        type: 'number',
      },
      {
        id: 'pass-day-connection-12',
        source: 'pass-day-high-stress-health-change',
        target: 'pass-day-high-stress-cooldown-change',
        sourceOutput: 'exec',
        targetInput: 'exec',
        type: 'exec',
      },
      {
        id: 'pass-day-connection-13',
        source: 'pass-day-high-stress-cooldown-current',
        target: 'pass-day-high-stress-cooldown-math',
        sourceOutput: 'attribute',
        targetInput: 'number1',
        type: 'number',
      },
      {
        id: 'pass-day-connection-15',
        source: 'pass-day-high-stress-cooldown-math',
        target: 'pass-day-high-stress-cooldown-clamp',
        sourceOutput: 'output',
        targetInput: 'number',
        type: 'number',
      },
      {
        id: 'pass-day-connection-18',
        source: 'pass-day-high-stress-cooldown-clamp',
        target: 'pass-day-high-stress-cooldown-change',
        sourceOutput: 'output',
        targetInput: 'value',
        type: 'number',
      },
      {
        id: 'pass-day-connection-2',
        source: 'pass-day-stress',
        target: 'pass-day-stress-check',
        sourceOutput: 'attribute',
        targetInput: 'value1',
        type: 'number',
      },
      {
        id: 'pass-day-connection-21',
        source: 'pass-day-stress-switch',
        target: 'pass-day-calm-growth-change',
        sourceOutput: 'false',
        targetInput: 'exec',
        type: 'exec',
      },
      {
        id: 'pass-day-connection-22',
        source: 'pass-day-calm-growth-current',
        target: 'pass-day-calm-growth-math',
        sourceOutput: 'attribute',
        targetInput: 'number1',
        type: 'number',
      },
      {
        id: 'pass-day-connection-24',
        source: 'pass-day-calm-growth-math',
        target: 'pass-day-calm-growth-clamp',
        sourceOutput: 'output',
        targetInput: 'number',
        type: 'number',
      },
      {
        id: 'pass-day-connection-27',
        source: 'pass-day-calm-growth-clamp',
        target: 'pass-day-calm-growth-change',
        sourceOutput: 'output',
        targetInput: 'value',
        type: 'number',
      },
      {
        id: 'pass-day-connection-28',
        source: 'pass-day-calm-growth-change',
        target: 'pass-day-calm-hydration-change',
        sourceOutput: 'exec',
        targetInput: 'exec',
        type: 'exec',
      },
      {
        id: 'pass-day-connection-29',
        source: 'pass-day-calm-hydration-current',
        target: 'pass-day-calm-hydration-math',
        sourceOutput: 'attribute',
        targetInput: 'number1',
        type: 'number',
      },
      {
        id: 'pass-day-connection-31',
        source: 'pass-day-calm-hydration-math',
        target: 'pass-day-calm-hydration-clamp',
        sourceOutput: 'output',
        targetInput: 'number',
        type: 'number',
      },
      {
        id: 'pass-day-connection-34',
        source: 'pass-day-calm-hydration-clamp',
        target: 'pass-day-calm-hydration-change',
        sourceOutput: 'output',
        targetInput: 'value',
        type: 'number',
      },
      {
        id: 'pass-day-connection-35',
        source: 'pass-day-calm-hydration-change',
        target: 'pass-day-calm-sunlight-change',
        sourceOutput: 'exec',
        targetInput: 'exec',
        type: 'exec',
      },
      {
        id: 'pass-day-connection-36',
        source: 'pass-day-calm-sunlight-current',
        target: 'pass-day-calm-sunlight-math',
        sourceOutput: 'attribute',
        targetInput: 'number1',
        type: 'number',
      },
      {
        id: 'pass-day-connection-38',
        source: 'pass-day-calm-sunlight-math',
        target: 'pass-day-calm-sunlight-clamp',
        sourceOutput: 'output',
        targetInput: 'number',
        type: 'number',
      },
      {
        id: 'pass-day-connection-4',
        source: 'pass-day-stress-check',
        target: 'pass-day-stress-switch',
        sourceOutput: 'output',
        targetInput: 'switch',
        type: 'boolean',
      },
      {
        id: 'pass-day-connection-41',
        source: 'pass-day-calm-sunlight-clamp',
        target: 'pass-day-calm-sunlight-change',
        sourceOutput: 'output',
        targetInput: 'value',
        type: 'number',
      },
      {
        id: 'pass-day-connection-5',
        source: 'pass-day-stress-switch',
        target: 'pass-day-high-stress-health-change',
        sourceOutput: 'true',
        targetInput: 'exec',
        type: 'exec',
      },
      {
        id: 'pass-day-connection-6',
        source: 'pass-day-high-stress-health-current',
        target: 'pass-day-high-stress-health-math',
        sourceOutput: 'attribute',
        targetInput: 'number1',
        type: 'number',
      },
      {
        id: 'pass-day-connection-8',
        source: 'pass-day-high-stress-health-math',
        target: 'pass-day-high-stress-health-clamp',
        sourceOutput: 'output',
        targetInput: 'number',
        type: 'number',
      },
    ],
  }

  graph.nodes = savedGraph.nodes
  graph.connections = savedGraph.connections

  return graph
}

function createImagePicker(
  graph: GraphBuilder,
  file: string,
  x: number,
  y: number,
) {
  return graph.node('image-input', `image-${file.replaceAll('.', '-')}`, x, y, {
    controls: { image: imageValue(`flower/${file}`) },
  })
}

function createMapToNumber(
  graph: GraphBuilder,
  key: string,
  breakpoints: number[],
  x: number,
  y: number,
  comment?: string,
) {
  return graph.node(
    'map-to-number',
    key,
    x,
    y,
    {
      controls: {
        breakpoints: breakpointsValue(breakpoints),
        mode: enumValue('down'),
      },
    },
    comment,
  )
}

function buildHealthImageMap(
  graph: GraphBuilder,
  key: string,
  files: string[],
  healthNode: string,
  x: number,
  y: number,
) {
  const map = createMapToNumber(
    graph,
    key,
    [1, 2, 3],
    x + 320,
    y + 210,
    'Health picks the wilted, weak, healthy, or thriving artwork for this growth branch.',
  )
  graph.connect(healthNode, 'attribute', map, 'number', 'number')
  files.forEach((file, index) => {
    const picker = createImagePicker(graph, file, x, y + index * 190)
    graph.connect(picker, 'image', map, `${index}`, 'buffer')
  })
  return map
}

function buildBloomImageGraph() {
  const graph = new GraphBuilder('living-flower')
  const root = graph.node(
    'image-root',
    'output',
    3260,
    260,
    {},
    'The final image is selected entirely from token attributes.',
  )
  const growth = createAttributeInput(
    graph,
    'growth-stage',
    ATTR.growth,
    -860,
    0,
    'Growth Stage chooses seedling, sprout, bud, or full bloom.',
  )
  const health = createAttributeInput(
    graph,
    'health',
    ATTR.health,
    -860,
    240,
    'Health chooses how alive or wilted the flower looks.',
  )
  const bloom = createAttributeInput(
    graph,
    'bloom-type',
    ATTR.bloom,
    -860,
    480,
    'Bloom Type switches between the two flower head designs on mature stages.',
  )

  const growthOne = buildHealthImageMap(
    graph,
    'growth-1-health',
    ['1-1.svg', '1-2.svg', '1-3.svg', '1-4.svg'],
    health,
    -420,
    -650,
  )
  const growthTwo = buildHealthImageMap(
    graph,
    'growth-2-health',
    ['2-1.svg', '2-2.svg', '2-3.svg', '2-4.svg'],
    health,
    -420,
    160,
  )
  const growthThreeBloomOne = buildHealthImageMap(
    graph,
    'growth-3-bloom-1-health',
    ['3-1-1.svg', '3-2-1.svg', '3-3-1.svg', '3-4-1.svg'],
    health,
    660,
    -650,
  )
  const growthThreeBloomTwo = buildHealthImageMap(
    graph,
    'growth-3-bloom-2-health',
    ['3-1-2.svg', '3-2-2.svg', '3-3-2.svg', '3-4-2.svg'],
    health,
    660,
    160,
  )
  const growthFourBloomOne = buildHealthImageMap(
    graph,
    'growth-4-bloom-1-health',
    ['4-1-1.svg', '4-2-1.svg', '4-3-1.svg', '4-4-1.svg'],
    health,
    660,
    980,
  )
  const growthFourBloomTwo = buildHealthImageMap(
    graph,
    'growth-4-bloom-2-health',
    ['4-1-2.svg', '4-2-2.svg', '4-3-2.svg', '4-4-2.svg'],
    health,
    660,
    1790,
  )

  const growthThreeBloomMap = createMapToNumber(
    graph,
    'growth-3-bloom',
    [1],
    1740,
    -40,
    'For buds, Bloom Type selects which flower head design to use.',
  )
  const growthFourBloomMap = createMapToNumber(
    graph,
    'growth-4-bloom',
    [1],
    1740,
    1050,
    'For full blooms, Bloom Type selects which flower head design to use.',
  )
  graph.connect(bloom, 'attribute', growthThreeBloomMap, 'number', 'number')
  graph.connect(
    growthThreeBloomOne,
    'output',
    growthThreeBloomMap,
    '0',
    'buffer',
  )
  graph.connect(
    growthThreeBloomTwo,
    'output',
    growthThreeBloomMap,
    '1',
    'buffer',
  )
  graph.connect(bloom, 'attribute', growthFourBloomMap, 'number', 'number')
  graph.connect(growthFourBloomOne, 'output', growthFourBloomMap, '0', 'buffer')
  graph.connect(growthFourBloomTwo, 'output', growthFourBloomMap, '1', 'buffer')

  const growthMap = createMapToNumber(
    graph,
    'growth-selector',
    [1, 2, 3],
    2580,
    260,
    'Growth Stage chooses which branch of the artwork tree becomes the token image.',
  )
  graph.connect(growth, 'attribute', growthMap, 'number', 'number')
  graph.connect(growthOne, 'output', growthMap, '0', 'buffer')
  graph.connect(growthTwo, 'output', growthMap, '1', 'buffer')
  graph.connect(growthThreeBloomMap, 'output', growthMap, '2', 'buffer')
  graph.connect(growthFourBloomMap, 'output', growthMap, '3', 'buffer')
  graph.connect(growthMap, 'output', root, 'image', 'buffer')

  return graph
}

async function seedFlowerUploads() {
  const uploads: Upload[] = flowerFiles.map((file) => ({
    id: `flower/${file}`,
    version: VERSION_ID,
    folder: FLOWER_FOLDER_ID,
    name: file.replace('.svg', ''),
    type: 'svg+xml',
    bytes: 0,
    width: 750,
    height: 751,
    tags: ['flower', 'demo'],
    created_at: now(),
    updated_at: now(),
  }))

  let coverBlob: Blob | undefined
  for (const upload of uploads) {
    const res = await fetch(`/${upload.id}`)
    if (!res.ok) continue
    const blob = await res.blob()
    upload.bytes = blob.size
    await putBlob(upload.id, blob)
    if (upload.id === 'flower/4-4-2.svg') {
      coverBlob = blob
    }
  }

  if (coverBlob) {
    await putBlob('bloom-collection-cover.svg', coverBlob)
  }

  await bulkPut('uploads', uploads)
}

function getAttributes(): Attribute[] {
  const numberAttribute = (
    id: string,
    slug: string,
    name: string,
    description: string,
    min: number,
    max: number,
  ): Attribute => ({
    id,
    version: VERSION_ID,
    slug,
    name,
    description,
    display: 'public',
    token_specific: true,
    locked: false,
    settings: null,
    value: {
      type: 'number',
      list: false,
      optional: false,
      restrictions: { min, max },
    },
    created_at: now(),
    updated_at: now(),
  })

  return [
    numberAttribute(
      ATTR.growth,
      'growth-stage',
      'Growth Stage',
      '1 seedling, 2 sprout, 3 bud, 4 full bloom.',
      1,
      4,
    ),
    numberAttribute(
      ATTR.health,
      'health',
      'Health',
      '1 withered, 2 weak, 3 healthy, 4 thriving.',
      1,
      4,
    ),
    numberAttribute(
      ATTR.bloom,
      'bloom-type',
      'Bloom Type',
      'Chooses between the two mature flower head designs.',
      1,
      2,
    ),
    numberAttribute(
      ATTR.hydration,
      'hydration',
      'Hydration',
      'Short-term water reserve used by Pass Day.',
      0,
      3,
    ),
    numberAttribute(
      ATTR.sunlight,
      'sunlight',
      'Sunlight',
      'Short-term light reserve used by Pass Day.',
      0,
      3,
    ),
    numberAttribute(
      ATTR.stress,
      'stress',
      'Stress',
      'Too much stress makes the flower lose health when a day passes.',
      0,
      3,
    ),
  ]
}

function getActions(): Action[] {
  const action = (
    id: string,
    slug: string,
    name: string,
    description: string,
  ): Action => ({
    id,
    version: VERSION_ID,
    slug,
    name,
    description,
    trigger: { type: 'api', settings: { params: [] } },
    locked: false,
    created_at: now(),
    updated_at: now(),
  })

  return [
    action(
      ACTION.water,
      'water',
      'Water',
      'Stores water and gently restores health.',
    ),
    action(
      ACTION.sun,
      'give-sun',
      'Give Sun',
      'Stores sunlight and nudges the flower toward growth.',
    ),
    action(
      ACTION.fertilize,
      'fertilize',
      'Fertilize',
      'Accelerates growth and bloom variety, but adds stress.',
    ),
    action(
      ACTION.prune,
      'prune',
      'Prune',
      'Reduces stress and restores health.',
    ),
    action(
      ACTION.passDay,
      'pass-day',
      'Pass Day',
      'Applies the collection rulebook for growth, stress, and decay.',
    ),
  ]
}

function actionGraphRows(actionId: string, graph: GraphBuilder) {
  const nodes = graph.nodes.map<StoredActionNode>((node) => ({
    ...node,
    action: actionId,
  }))
  const connections = graph.connections.map<StoredActionConnection>(
    (connection) => ({
      ...connection,
      action: actionId,
    }),
  )
  return { nodes, connections }
}

function imageGraphRows(layerId: string, graph: GraphBuilder) {
  const nodes = graph.nodes.map<StoredImageNode>((node) => ({
    ...node,
    layer: layerId,
  }))
  const connections = graph.connections.map<StoredImageConnection>(
    (connection) => ({
      ...connection,
      layer: layerId,
    }),
  )
  return { nodes, connections }
}

function buildActionGraphs() {
  const water = buildWaterFlowerGraph()

  return [
    [ACTION.water, water],
    [ACTION.sun, buildGiveSunGraph()],
    [ACTION.fertilize, buildFertilizeGraph()],
    [ACTION.prune, buildPruneGraph()],
    [ACTION.passDay, buildPassDayGraph()],
  ] as const
}

async function replaceActionGraph(actionId: string, graph: GraphBuilder) {
  const [nodes, connections] = await Promise.all([
    getAll<StoredActionNode>('action_nodes'),
    getAll<StoredActionConnection>('action_connections'),
  ])
  await removeMany(
    'action_nodes',
    nodes.filter((node) => node.action === actionId).map((node) => node.id),
  )
  await removeMany(
    'action_connections',
    connections
      .filter((connection) => connection.action === actionId)
      .map((connection) => connection.id),
  )

  const graphRows = actionGraphRows(actionId, graph)
  await bulkPut('action_nodes', graphRows.nodes)
  await bulkPut('action_connections', graphRows.connections)
}

export async function migrateDemoActionGraphs(): Promise<void> {
  const nodes = await getAll<StoredActionNode>('action_nodes')
  const actions = await getAll<Action>('actions')
  const waterAction = actions.find((action) => action.id === ACTION.water)
  const waterNodes = nodes.filter((node) => node.action === ACTION.water)
  const waterTrigger = waterNodes.find(
    (node) => node.id === 'water-flower-trigger',
  )
  const hasOldWaterLayout = waterTrigger && waterTrigger.x !== -739.1982421875
  const fertilizeNodes = nodes.filter(
    (node) => node.action === ACTION.fertilize,
  )
  const hasOldBloomStep = fertilizeNodes.some(
    (node) => node.id === 'fertilize-bloom-change',
  )
  const giveSunNodes = nodes.filter((node) => node.action === ACTION.sun)
  const hasOldGiveSunLog = giveSunNodes.some(
    (node) => node.id === 'give-sun-result-log',
  )
  const pruneNodes = nodes.filter((node) => node.action === ACTION.prune)
  const hasOldPruneDeltaNodes = pruneNodes.some(
    (node) =>
      node.id === 'prune-stress-delta' || node.id === 'prune-health-delta',
  )
  const passDayNodes = nodes.filter((node) => node.action === ACTION.passDay)
  const hasOldPassDayLog = passDayNodes.some(
    (node) =>
      node.id === 'pass-day-stress-log' || node.id === 'pass-day-growth-log',
  )

  if (
    waterAction &&
    (waterAction.slug === 'water-flower' || waterAction.name === 'Water Flower')
  ) {
    await patch<Action>('actions', ACTION.water, {
      slug: 'water',
      name: 'Water',
      updated_at: now(),
    })
  }
  if (hasOldWaterLayout) {
    await replaceActionGraph(ACTION.water, buildWaterFlowerGraph())
  }
  if (hasOldBloomStep) {
    await replaceActionGraph(ACTION.fertilize, buildFertilizeGraph())
  }
  if (hasOldGiveSunLog) {
    await replaceActionGraph(ACTION.sun, buildGiveSunGraph())
  }
  if (hasOldPruneDeltaNodes) {
    await replaceActionGraph(ACTION.prune, buildPruneGraph())
  }
  if (hasOldPassDayLog) {
    await replaceActionGraph(ACTION.passDay, buildPassDayGraph())
  }
}

export async function seedBloomLab(): Promise<void> {
  const account: Tables<'accounts'> = {
    id: DEMO_ACCOUNT_ID,
    owner: DEMO_USER_ID,
    created_at: now(),
  }

  const profile: Profile = { ...DEMO_PROFILE, updated_at: now() }

  const version: Version = {
    id: VERSION_ID,
    collection: COLLECTION_ID,
    name: 'v1',
    description:
      'A no-code dynamic flower collection. Actions mutate token attributes, and the image graph renders the matching growth, health, and bloom artwork.',
    banner: null,
    external_link: null,
    featured: null,
    image: null,
    locked: false,
    major: 1,
    minor: 0,
    patch: 0,
    status: 'development',
    created_at: now(),
    updated_at: now(),
  }

  const collection: Collection = {
    id: COLLECTION_ID,
    account: DEMO_ACCOUNT_ID,
    slug: 'bloom-lab',
    name: 'Flower Demo',
    description:
      'A living flower collection built from editable no-code logic.',
    symbol: 'BLOOM',
    external_link: null,
    image: 'bloom-collection-cover.svg',
    banner: null,
    max_supply: 1000,
    editable_version: VERSION_ID,
    settings_locked: false,
    created_at: now(),
    updated_at: now(),
  }

  const flowerFolder: Folder = {
    id: FLOWER_FOLDER_ID,
    version: VERSION_ID,
    name: 'Flower States',
    parent: null,
    created_at: now(),
  }

  const layer: Layer = {
    id: LAYER_ID,
    version: VERSION_ID,
    slug: 'living-flower',
    name: 'Living Flower',
    description:
      'Selects one of the bundled flower artworks from Growth Stage, Health, and Bloom Type.',
    definition: { type: 'custom' },
    index: 0,
    locked: false,
    created_at: now(),
    updated_at: now(),
  }

  await put('accounts', account)
  await put('profiles', profile)
  await put('versions', version)
  await put('collections', collection)
  await bulkPut('attributes', getAttributes())
  await bulkPut('actions', getActions())
  await put('folders', flowerFolder)
  await seedFlowerUploads()
  await put('layers', layer)

  const actionRows = buildActionGraphs().map(([actionId, graph]) =>
    actionGraphRows(actionId, graph),
  )
  await bulkPut(
    'action_nodes',
    actionRows.flatMap((row) => row.nodes),
  )
  await bulkPut(
    'action_connections',
    actionRows.flatMap((row) => row.connections),
  )

  const imageRows = imageGraphRows(LAYER_ID, buildBloomImageGraph())
  await bulkPut('image_nodes', imageRows.nodes)
  await bulkPut('image_connections', imageRows.connections)
}
