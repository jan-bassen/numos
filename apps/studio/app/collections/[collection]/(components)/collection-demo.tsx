'use client'

import ActionContextMenu from '@/app/collections/[collection]/actions/(components)/action-context-menu'
import AttributeContextMenu from '@/app/collections/[collection]/attributes/(components)/attribute-context-menu'
import LayerContextMenu from '@/app/collections/[collection]/image/(components)/layer-context-menu'
import { GenericDisplay } from '@/components/datatypes/generic-display'
import { simulateActionGraph, simulateImageGraph } from '@/lib/rete/engine'
import { savedGraphToMapGraph } from '@/lib/rete/saved-graph-to-map'
import type {
  Action,
  Attribute,
  Collection,
  Layer,
  Version,
} from '@/types/database.types'
import type {
  SimulatedTokenStateResult,
  SimulationData,
} from '@repo/shared/types/engine-types'
import type { SavedGraph } from '@repo/shared/types/graph-types'
import type {
  Value,
  ValueFormat,
  ValueMap,
  ValueType,
} from '@repo/shared/types/values'
import InfoButton, { type TooltipInfo } from '@repo/ui/blocks/help/info-tooltip'
import LoadingSpinner from '@repo/ui/blocks/loading/loading-spinner'
import { Button } from '@repo/ui/components/button'
import {
  PiAcLeafStroke,
  PiAcWaterStroke,
  PiActivityStroke,
  PiAutomationStroke,
  PiBarchartDefaultStroke,
  PiPhotoImageDefaultStroke,
  PiPlayBigStroke,
  PiRefreshStroke,
  PiSunStroke,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import {
  type ReactNode,
  type SVGProps,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'

type DemoValue = Value<ValueType, ValueFormat, true>
type DemoState = ValueMap<string, ValueType, ValueFormat, true>
type DemoCollection = Pick<Collection, 'id' | 'slug' | 'name' | 'description'>

type CollectionDemoProps = {
  collection: DemoCollection
  version: Version
  attributes: Attribute[]
  actions: Action[]
  actionGraphs: Record<string, SavedGraph>
  imageGraph?: SavedGraph
  imageLayer?: Layer
}

type DemoSectionHeadingProps = {
  title: string
  href: string
  icon: (props: SVGProps<SVGSVGElement>) => ReactNode
  info: Omit<TooltipInfo, 'title'>
}

const bloomDefaults: Record<string, number> = {
  'growth-stage': 1,
  health: 3,
  'bloom-type': 1,
  hydration: 1,
  sunlight: 1,
  stress: 0,
}

const actionOrder: Record<string, number> = {
  'water-flower': 1,
  'give-sun': 2,
  fertilize: 3,
  prune: 4,
  'pass-day': 5,
}

function getNumberRange(attribute: Attribute) {
  if (attribute.value?.type !== 'number') return null
  const restrictions = attribute.value.restrictions
  return {
    min: restrictions?.min ?? 0,
    max: restrictions?.max ?? 10,
  }
}

function getDefaultValue(attribute: Attribute): DemoValue | null {
  const definition = attribute.value
  if (!definition) return null

  if (definition.list) {
    return {
      type: definition.type,
      format: 'objectarray',
      value: [],
    } as DemoValue
  }

  switch (definition.type) {
    case 'number': {
      const range = getNumberRange(attribute)
      const value = bloomDefaults[attribute.slug] ?? range?.min ?? 0
      return { type: 'number', format: 'single', value }
    }
    case 'boolean':
      return { type: 'boolean', format: 'single', value: false }
    case 'enum':
      return {
        type: 'enum',
        format: 'single',
        value: definition.restrictions?.options?.[0]?.value ?? '',
      }
    case 'color':
      return {
        type: 'color',
        format: 'single',
        value: { r: 120, g: 180, b: 120, a: 1 },
      }
    case 'datetime':
      return { type: 'datetime', format: 'single', value: Date.now() }
    case 'location':
      return { type: 'location', format: 'single', value: { lat: 0, lng: 0 } }
    default:
      return { type: definition.type, format: 'single', value: '' } as DemoValue
  }
}

function getInitialState(attributes: Attribute[]): DemoState {
  return attributes.reduce<DemoState>((state, attribute) => {
    const value = getDefaultValue(attribute)
    if (value) state[attribute.id] = value
    return state
  }, {})
}

function sortActions(actions: Action[]) {
  return [...actions].sort((a, b) => {
    const orderA = actionOrder[a.slug] ?? 100
    const orderB = actionOrder[b.slug] ?? 100
    if (orderA !== orderB) return orderA - orderB
    return (a.name ?? '').localeCompare(b.name ?? '')
  })
}

function sortAttributes(attributes: Attribute[]) {
  return [...attributes].sort((a, b) => {
    const orderA = Object.keys(bloomDefaults).indexOf(a.slug)
    const orderB = Object.keys(bloomDefaults).indexOf(b.slug)
    if (orderA !== -1 || orderB !== -1) {
      return (orderA === -1 ? 100 : orderA) - (orderB === -1 ? 100 : orderB)
    }
    return (a.name ?? '').localeCompare(b.name ?? '')
  })
}

function getActionIcon(action: Action) {
  if (action.slug.includes('water')) return PiAcWaterStroke
  if (action.slug.includes('sun')) return PiSunStroke
  if (action.slug.includes('fertilize') || action.slug.includes('prune')) {
    return PiAcLeafStroke
  }
  if (action.slug.includes('day')) return PiActivityStroke
  return PiPlayBigStroke
}

function getSimulationData(
  collection: DemoCollection,
  attributes: DemoState,
): SimulationData {
  return {
    basicMetadata: {
      id: { type: 'number', format: 'single', value: 1 },
      name: {
        type: 'string',
        format: 'single',
        value: `${collection.name ?? 'Token'} #1`,
      },
      description: {
        type: 'string',
        format: 'single',
        value: collection.description ?? '',
      },
    },
    attributes: attributes as ValueMap<
      string,
      ValueType,
      'single' | 'objectarray',
      true
    >,
    parameters: {},
  }
}

function applyActionResult(
  current: DemoState,
  result: SimulatedTokenStateResult,
) {
  return Object.entries(result.stateChange).reduce<DemoState>(
    (next, [attributeId, change]) => {
      next[attributeId] = change.new as DemoValue
      return next
    },
    { ...current },
  )
}

function DemoSectionHeading({
  title,
  href,
  icon: Icon,
  info,
}: DemoSectionHeadingProps) {
  return (
    <div className="flex h-fit items-center gap-2 pl-1 font-medium text-base">
      <Link href={href} className="flex items-center gap-2 hover:underline">
        <Icon className="size-4 text-muted-foreground" />
        {title}
      </Link>
      {info.description ? (
        <InfoButton
          title={title}
          description={info.description}
          options={info.options}
          link={info.link}
        />
      ) : null}
    </div>
  )
}

export function CollectionDemo({
  collection,
  version,
  attributes,
  actions,
  actionGraphs,
  imageGraph,
  imageLayer,
}: CollectionDemoProps) {
  const initialState = useMemo(() => getInitialState(attributes), [attributes])
  const orderedActions = useMemo(() => sortActions(actions), [actions])
  const orderedAttributes = useMemo(
    () => sortAttributes(attributes),
    [attributes],
  )
  const [attributeState, setAttributeState] = useState<DemoState>(initialState)
  const [image, setImage] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [runningActionId, setRunningActionId] = useState<string | null>(null)
  const imageHref = imageLayer
    ? `/collections/${collection.slug}/image/${imageLayer.slug}`
    : `/collections/${collection.slug}/image`

  useEffect(() => {
    setAttributeState(initialState)
  }, [initialState])

  useEffect(() => {
    if (!imageGraph) return
    let active = true
    setImageLoading(true)
    simulateImageGraph(
      savedGraphToMapGraph(imageGraph),
      getSimulationData(collection, attributeState),
      { collectionId: collection.id, versionId: version.id },
    )
      .then((response) => {
        if (!active) return
        if (response.error) {
          toast.error(response.error.message)
          return
        }
        setImage(response.result.value)
      })
      .catch((error) => {
        if (active) toast.error(error.message ?? 'Could not render image')
      })
      .finally(() => {
        if (active) setImageLoading(false)
      })
    return () => {
      active = false
    }
  }, [attributeState, collection, imageGraph, version.id])

  async function runAction(action: Action) {
    const graph = actionGraphs[action.id]
    if (!graph) {
      toast.error('Action graph not found')
      return
    }

    try {
      setRunningActionId(action.id)
      const response = await simulateActionGraph(
        savedGraphToMapGraph(graph),
        getSimulationData(collection, attributeState),
        {
          collectionId: collection.id,
          versionId: version.id,
          actionId: action.id,
        },
      )

      if (response.error) {
        toast.error(response.error.message)
        return
      }

      setAttributeState((current) =>
        applyActionResult(current, response.result),
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not run action',
      )
    } finally {
      setRunningActionId(null)
    }
  }

  const imageContent = (
    <div className="flex aspect-square min-h-72 items-center justify-center overflow-hidden rounded-md border bg-muted/20">
      {imageLoading && !image ? (
        <LoadingSpinner />
      ) : image ? (
        <Image
          src={`data:image/png;base64,${image}`}
          alt={imageLayer?.name ?? collection.name ?? 'Collection image'}
          width={520}
          height={520}
          className={cn(
            'h-full w-full object-contain p-4 transition-opacity',
            imageLoading && 'opacity-60',
          )}
          priority
        />
      ) : (
        <PiPhotoImageDefaultStroke className="size-10 text-muted-foreground" />
      )}
    </div>
  )

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.95fr)_minmax(320px,1.05fr)]">
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <DemoSectionHeading
            title="Live Image"
            href={imageHref}
            icon={PiPhotoImageDefaultStroke}
            info={{
              description:
                'Live Image renders the token image from the selected image layer and the current demo attribute values.',
            }}
          />
        </div>
        {imageLayer ? (
          <LayerContextMenu
            layerSlug={imageLayer.slug}
            collectionSlug={collection.slug}
            versionId={version.id}
          >
            {imageContent}
          </LayerContextMenu>
        ) : (
          imageContent
        )}
      </section>
      <section className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <DemoSectionHeading
              title="Attributes"
              href={`/collections/${collection.slug}/attributes`}
              icon={PiBarchartDefaultStroke}
              info={{
                description:
                  'Attributes are the traits of all of your tokens. They define the properties the demo reads and changes.',
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-muted-foreground"
              onClick={() => setAttributeState(initialState)}
            >
              <PiRefreshStroke className="size-3.5" />
              Reset
            </Button>
          </div>
          <div className="overflow-hidden rounded-md border bg-background">
            {orderedAttributes.map((attribute) => {
              const value = attributeState[attribute.id]
              const range = getNumberRange(attribute)
              const numberValue =
                value?.type === 'number' && value.format === 'single'
                  ? value.value
                  : null
              const progress =
                range && typeof numberValue === 'number'
                  ? Math.max(
                      0,
                      Math.min(
                        100,
                        ((numberValue - range.min) /
                          Math.max(1, range.max - range.min)) *
                          100,
                      ),
                    )
                  : null

              return (
                <AttributeContextMenu
                  key={attribute.id}
                  attributeSlug={attribute.slug}
                  collectionSlug={collection.slug}
                  versionId={version.id}
                >
                  <div className="min-h-12 border-b px-3 py-2.5 text-sm last:border-b-0 hover:bg-muted/50 data-[state=open]:bg-muted">
                    <div className="flex items-center justify-between gap-3">
                      <span className="line-clamp-1 font-medium">
                        {attribute.name ?? attribute.slug}
                      </span>
                      {value ? (
                        <span className="shrink-0 text-muted-foreground">
                          <GenericDisplay value={value} />
                        </span>
                      ) : null}
                    </div>
                    {progress !== null ? (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-[width]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                </AttributeContextMenu>
              )
            })}
          </div>
        </div>
        <div className="space-y-3">
          <DemoSectionHeading
            title="Actions"
            href={`/collections/${collection.slug}/actions`}
            icon={PiAutomationStroke}
            info={{
              description:
                'Actions change token state. Run them here to test how your action graphs update attributes and refresh the live image.',
            }}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {orderedActions.map((action) => {
              const Icon = getActionIcon(action)
              const isRunning = runningActionId === action.id
              return (
                <ActionContextMenu
                  key={action.id}
                  actionSlug={action.slug}
                  collectionSlug={collection.slug}
                  versionId={version.id}
                >
                  <Button
                    variant="outline"
                    className="h-12 justify-start gap-2 rounded-md px-3"
                    disabled={!!runningActionId}
                    onClick={() => runAction(action)}
                  >
                    {isRunning ? (
                      <PiRefreshStroke className="size-4 animate-spin" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                    <span className="line-clamp-1">
                      {action.name ?? action.slug}
                    </span>
                  </Button>
                </ActionContextMenu>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
