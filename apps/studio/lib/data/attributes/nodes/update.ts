import type { SavedNode } from '@repo/shared/types/graph-types'
import type { Action, Attribute, Layer, ReturnInfo } from '@/types/database.types'
import { attributeNodeDependency } from '@/lib/rete/nodes/node-dependencies'
import { get, getAllBy, put } from '@/lib/data/store'

const dependentTypes = new Set(
  attributeNodeDependency.nodes.map((node) => node.nodeType),
)

type StoredNode = SavedNode & { layer?: string; action?: string }

/** Reads the attribute slug a node currently references, across old/new shapes. */
function referencedSlug(node: StoredNode): string | undefined {
  const newValue = node.state?.controls?.attribute as
    | { value?: unknown }
    | undefined
  if (newValue && typeof newValue.value === 'string') return newValue.value
  const oldValue = node.controls?.attribute as { value?: unknown } | undefined
  if (oldValue && typeof oldValue.value === 'string') return oldValue.value
  return undefined
}

/** Collects all attribute-dependent image + action nodes within a version. */
async function dependentNodesInVersion(versionId: string): Promise<{
  imageNodes: StoredNode[]
  actionNodes: StoredNode[]
}> {
  const layers = await getAllBy<Layer>('layers', 'version', versionId)
  const imageNodes: StoredNode[] = []
  for (const layer of layers) {
    const nodes = await getAllBy<StoredNode>('image_nodes', 'layer', layer.id)
    imageNodes.push(...nodes.filter((n) => dependentTypes.has(n.type)))
  }

  const actions = await getAllBy<Action>('actions', 'version', versionId)
  const actionNodes: StoredNode[] = []
  for (const action of actions) {
    const nodes = await getAllBy<StoredNode>('action_nodes', 'action', action.id)
    actionNodes.push(...nodes.filter((n) => dependentTypes.has(n.type)))
  }

  return { imageNodes, actionNodes }
}

function withRenamedAttribute(node: StoredNode, newSlug: string): StoredNode {
  const next: StoredNode = { ...node, state: { ...node.state } }
  if (next.state?.controls?.attribute) {
    next.state.controls = {
      ...next.state.controls,
      attribute: { ...next.state.controls.attribute, value: newSlug } as never,
    }
  }
  if (next.controls?.attribute) {
    next.controls = {
      ...next.controls,
      attribute: { ...next.controls.attribute, value: newSlug },
    }
  }
  return next
}

function withClearedAttribute(node: StoredNode): StoredNode {
  const next: StoredNode = { ...node, state: { ...node.state } }
  if (next.state?.controls) {
    const { attribute, ...rest } = next.state.controls
    next.state.controls = rest
  }
  if (next.controls) {
    const { attribute, ...rest } = next.controls
    next.controls = rest
  }
  return next
}

// Needs to be called before updating the attribute slug
export async function updateAttributeSlugInNodes(
  attributeId: string,
  slug: string,
): Promise<ReturnInfo> {
  const attribute = await get<Attribute>('attributes', attributeId)
  if (!attribute) {
    return { ok: false, message: 'Failed to fetch attribute' }
  }

  const oldSlug = attribute.slug
  const { imageNodes, actionNodes } = await dependentNodesInVersion(
    attribute.version,
  )

  for (const node of [...imageNodes, ...actionNodes]) {
    if (referencedSlug(node) !== oldSlug) continue
    const store = node.layer ? 'image_nodes' : 'action_nodes'
    await put(store, withRenamedAttribute(node, slug))
  }

  return { ok: true, message: 'Successfully updated' }
}

// Needs to be called before deleting the attribute
export async function clearAttributeNodeControls(
  attributeId: string,
): Promise<ReturnInfo> {
  const attribute = await get<Attribute>('attributes', attributeId)
  if (!attribute) {
    return { ok: false, message: 'Failed to fetch attribute' }
  }

  const { imageNodes, actionNodes } = await dependentNodesInVersion(
    attribute.version,
  )

  for (const node of [...imageNodes, ...actionNodes]) {
    if (referencedSlug(node) !== attribute.slug) continue
    const store = node.layer ? 'image_nodes' : 'action_nodes'
    await put(store, withClearedAttribute(node))
  }

  return { ok: true, message: 'Successfully updated' }
}
