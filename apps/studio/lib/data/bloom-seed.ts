'use client'

import {
  DEMO_ACCOUNT_ID,
  DEMO_PROFILE,
  DEMO_USER_ID,
} from '@/lib/data/demo-constants'
import { bulkPut, put, putBlob } from '@/lib/data/store'
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

function stringValue(value: string) {
  return { type: 'string', format: 'single', value } as const
}

function enumValue(value: string) {
  return { type: 'enum', format: 'single', value } as const
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
  const root = graph.node(
    'action-root',
    'trigger',
    -620,
    150,
    {},
    'Run this action in the simulation panel to see how it changes the flower token state.',
  )

  const hydrationChange = createInlineClampedAttributeChange(graph, {
    key: 'hydration',
    attribute: ATTR.hydration,
    delta: 1,
    min: 0,
    max: 3,
    x: -460,
    y: -190,
    execFrom: root,
    comment: 'Watering increases Hydration by one, but at max to 3.',
  })
  createInlineClampedAttributeChange(graph, {
    key: 'health',
    attribute: ATTR.health,
    delta: 1,
    min: 1,
    max: 4,
    x: -260,
    y: 330,
    execFrom: hydrationChange,
  })

  return graph
}

function buildPassDayGraph() {
  const graph = new GraphBuilder('pass-day')
  const root = graph.node(
    'action-root',
    'trigger',
    -820,
    -60,
    {},
    'Pass Day is the collection rulebook: stressed flowers lose health, calm flowers grow but consume care resources.',
  )
  const stress = createAttributeInput(graph, 'stress', ATTR.stress, -620, -300)
  const stressLimit = createNumberInput(graph, 'stress-limit', 3, -620, -80)
  const compare = createCompare(graph, 'stress-check', 'ge', -330, -200)
  const switchNode = graph.node(
    'switch',
    'stress-switch',
    -40,
    -120,
    {},
    'If stress is high, the day damages the flower. Otherwise the flower grows and consumes stored water and sunlight.',
  )

  graph.connect(root, 'exec', switchNode, 'exec', 'exec')
  graph.connect(stress, 'attribute', compare, 'value1', 'number')
  graph.connect(stressLimit, 'output', compare, 'value2', 'number')
  graph.connect(compare, 'output', switchNode, 'switch', 'boolean')

  const hurtHealth = createClampedAttributeChange(graph, {
    key: 'high-stress-health',
    attribute: ATTR.health,
    delta: -1,
    min: 1,
    max: 4,
    x: 260,
    y: -430,
    execFrom: switchNode,
    execOutput: 'true',
    comment: 'High stress makes the flower wilt.',
  })
  const calmStress = createClampedAttributeChange(graph, {
    key: 'high-stress-cooldown',
    attribute: ATTR.stress,
    delta: -1,
    min: 0,
    max: 3,
    x: 1320,
    y: -430,
    execFrom: hurtHealth,
    comment: 'A hard day also burns off a little stress.',
  })
  createLog(
    graph,
    'stress-log',
    'The flower was too stressed and lost health.',
    2380,
    -210,
    calmStress,
  )

  const grow = createClampedAttributeChange(graph, {
    key: 'calm-growth',
    attribute: ATTR.growth,
    delta: 1,
    min: 1,
    max: 4,
    x: 260,
    y: 240,
    execFrom: switchNode,
    execOutput: 'false',
    comment: 'A calm day advances growth.',
  })
  const hydration = createClampedAttributeChange(graph, {
    key: 'calm-hydration',
    attribute: ATTR.hydration,
    delta: -1,
    min: 0,
    max: 3,
    x: 1320,
    y: 240,
    execFrom: grow,
    comment: 'Growth consumes stored water.',
  })
  const sunlight = createClampedAttributeChange(graph, {
    key: 'calm-sunlight',
    attribute: ATTR.sunlight,
    delta: -1,
    min: 0,
    max: 3,
    x: 2380,
    y: 240,
    execFrom: hydration,
    comment: 'Growth also consumes stored sunlight.',
  })
  createLog(
    graph,
    'growth-log',
    'The flower used its care reserves and grew.',
    3440,
    460,
    sunlight,
  )

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
      'water-flower',
      'Water Flower',
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

  const sun = buildSimpleCareActionGraph(
    'give-sun',
    [
      {
        key: 'sunlight',
        attribute: ATTR.sunlight,
        delta: 1,
        min: 0,
        max: 3,
        label: 'Sunlight is stored for the next growth tick.',
      },
      {
        key: 'growth',
        attribute: ATTR.growth,
        delta: 1,
        min: 1,
        max: 4,
        label: 'A little light can advance growth.',
      },
    ],
    'The flower absorbed sun and grew a little.',
  )

  const fertilize = buildSimpleCareActionGraph(
    'fertilize',
    [
      {
        key: 'growth',
        attribute: ATTR.growth,
        delta: 1,
        min: 1,
        max: 4,
        label: 'Fertilizer pushes growth quickly.',
      },
      {
        key: 'bloom',
        attribute: ATTR.bloom,
        delta: 1,
        min: 1,
        max: 2,
        label: 'Fertilizer can reveal the alternate bloom type.',
      },
      {
        key: 'stress',
        attribute: ATTR.stress,
        delta: 1,
        min: 0,
        max: 3,
        label: 'Fast growth adds stress.',
      },
    ],
    'Fertilizer accelerated growth, but the flower is more stressed.',
  )

  const prune = buildSimpleCareActionGraph(
    'prune',
    [
      {
        key: 'stress',
        attribute: ATTR.stress,
        delta: -1,
        min: 0,
        max: 3,
        label: 'Pruning lowers stress.',
      },
      {
        key: 'health',
        attribute: ATTR.health,
        delta: 1,
        min: 1,
        max: 4,
        label: 'A cleaner plant recovers health.',
      },
    ],
    'Pruned the flower. Stress dropped and health improved.',
  )

  return [
    [ACTION.water, water],
    [ACTION.sun, sun],
    [ACTION.fertilize, fertilize],
    [ACTION.prune, prune],
    [ACTION.passDay, buildPassDayGraph()],
  ] as const
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
    name: 'Bloom Lab',
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
