'use server'

import type { NodeType, SavedControl } from '@/types/nodes.types'
import { createSupabaseServerComponentClient } from '../server-client'
import type { ReturnInfo } from '@/types/database.types'

// Control key has to be 'attribute'
const attributeDependentNodes: NodeType[] = [
  'change-attribute',
  'attribute-data',
  'enum-input',
  'image-map',
]

export async function updateAttributeNodeControls(
  versionId: string,
  oldSlug: string,
  newSlug: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  // Find all image nodes that depend on the attribute
  const { data: imageNodes, error: imageNodesError } = await supabase
    .from('image_nodes')
    .select('id, controls')
    .eq('version', versionId)
    .in('type', attributeDependentNodes)
    .eq('controls->attribute->>value', oldSlug)

  if (imageNodesError) {
    return { ok: false, message: imageNodesError.message }
  }

  const nodeErrors = []

  // Update the image nodes
  for (const imageNode of imageNodes) {
    if (!imageNode.controls?.attribute) {
      continue
    }
    const updatedControls: Record<string, SavedControl> = {
      ...imageNode.controls,
      attribute: {
        ...imageNode.controls.attribute,
        value: newSlug,
      } as SavedControl,
    }
    const { error: updateError } = await supabase
      .from('image_nodes')
      .update({
        controls: updatedControls,
      })
      .eq('id', imageNode.id)

    if (updateError) {
      nodeErrors.push(updateError.message)
    }
  }

  // Find all actions in the version that depend on the attribute
  const { data: actions, error: actionError } = await supabase
    .from('actions')
    .select('id')
    .eq('version', versionId)

  if (actionError) {
    return {
      ok: false,
      message: `Error with fetching actions: ${actionError.message}`,
    }
  }

  const actionIds = actions.map((action) => action.id)

  // Find all action nodes that depend on the attribute
  const { data: actionNodes, error: actionNodesError } = await supabase
    .from('action_nodes')
    .select('id, controls')
    .in('action', actionIds)
    .in('type', attributeDependentNodes)
    .eq('controls->attribute->>value', oldSlug)

  if (actionNodesError) {
    return {
      ok: false,
      message: `Error with fetching action nodes: ${actionNodesError.message}`,
    }
  }

  //Update the action nodes
  for (const actionNode of actionNodes) {
    if (!actionNode.controls?.attribute) {
      continue
    }

    const updatedControls: Record<string, SavedControl> = {
      ...actionNode.controls,
      attribute: {
        ...actionNode.controls.attribute,
        value: newSlug,
      } as SavedControl,
    }

    const { error: updateError } = await supabase
      .from('action_nodes')
      .update({
        controls: updatedControls,
      })
      .eq('id', actionNode.id)

    if (updateError) {
      nodeErrors.push(updateError.message)
    }
  }

  if (nodeErrors.length > 0) {
    return { ok: false, message: nodeErrors.join(', ') }
  }

  return { ok: true, message: 'Successfully updated' }
}

export async function clearAttributeNodeControls(
  versionId: string,
  oldSlug: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  // Find all image nodes that depend on the attribute
  const { data: imageNodes, error: imageNodesError } = await supabase
    .from('image_nodes')
    .select('id, controls')
    .eq('version', versionId)
    .in('type', attributeDependentNodes)
    .eq('controls->attribute->>value', oldSlug)

  if (imageNodesError) {
    return {
      ok: false,
      message: `Image nodes error: ${imageNodesError.message}`,
    }
  }

  const nodeErrors = []

  // Update the image nodes
  for (const imageNode of imageNodes) {
    if (!imageNode.controls?.attribute) {
      continue
    }
    const updatedControls: Record<string, SavedControl> = {
      ...imageNode.controls,
      attribute: {
        key: imageNode.controls.attribute.key,
        type: imageNode.controls.attribute.type,
        value: undefined,
      } as SavedControl,
    }

    const { error: updateError } = await supabase
      .from('image_nodes')
      .update({
        controls: updatedControls,
      })
      .eq('id', imageNode.id)

    if (updateError) {
      nodeErrors.push(updateError.message)
    }
  }

  // Find all actions in the version that depend on the attribute
  const { data: actions, error: actionError } = await supabase
    .from('actions')
    .select('id')
    .eq('version', versionId)

  if (actionError) {
    return {
      ok: false,
      message: `Error with fetching actions: ${actionError.message}`,
    }
  }

  const actionIds = actions.map((action) => action.id)

  // Find all action nodes that depend on the attribute
  const { data: actionNodes, error: actionNodesError } = await supabase
    .from('action_nodes')
    .select('id, controls')
    .in('action', actionIds)
    .in('type', attributeDependentNodes)
    .eq('controls->attribute->>value', oldSlug)

  if (actionNodesError) {
    return {
      ok: false,
      message: `Error with fetching action nodes: ${actionNodesError.message}`,
    }
  }

  //Update the action nodes
  for (const actionNode of actionNodes) {
    if (!actionNode.controls?.attribute) {
      continue
    }

    const updatedControls: Record<string, SavedControl> = {
      ...actionNode.controls,
      attribute: {
        key: actionNode.controls.attribute.key,
        type: actionNode.controls.attribute.type,
        value: undefined,
      } as SavedControl,
    }

    const { error: updateError } = await supabase
      .from('action_nodes')
      .update({
        controls: updatedControls,
      })
      .eq('id', actionNode.id)

    if (updateError) {
      nodeErrors.push(updateError.message)
    }
  }

  if (nodeErrors.length > 0) {
    return { ok: false, message: nodeErrors.join(', ') }
  }

  return { ok: true, message: 'Successfully updated' }
}
