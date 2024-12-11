'use server'

import type { OLDSavedControl, SavedNode } from '@repo/engine/types/graph-types'
import type { ReturnInfo } from '@/types/database.types'
import { attributeNodeDependency } from '@/lib/rete/nodes/node-dependencies'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'

// Needs to be called before updating the attribute slug
export async function updateAttributeSlugInNodes(
  attributeId: string,
  slug: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { data: attribute, error: attributeError } = await supabase
    .from('attributes')
    .select('id, slug, version')
    .eq('id', attributeId)
    .single()

  if (attributeError) {
    return { ok: false, message: 'Failed to fetch attribute' }
  }

  // Find all image nodes that depend on the attribute
  const { data: imageNodes, error: imageNodesError } = await supabase
    .from('image_nodes')
    .select('id, controls')
    .eq('version', attribute.version)
    .in(
      'type',
      attributeNodeDependency.nodes.map((node) => node.nodeType),
    )
    .eq('controls->attribute->>value', attribute.slug)

  if (imageNodesError) {
    return { ok: false, message: imageNodesError.message }
  }

  const nodeErrors = []

  // Update the image nodes
  for (const imageNode of imageNodes) {
    if (!imageNode.controls?.attribute) {
      continue
    }
    const updatedControls: Record<string, OLDSavedControl> = {
      ...imageNode.controls,
      attribute: {
        ...imageNode.controls.attribute,
        value: slug,
      } as OLDSavedControl,
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
    .eq('version', attribute.version)

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
    .in(
      'type',
      attributeNodeDependency.nodes.map((node) => node.nodeType),
    )
    .eq('controls->attribute->>value', slug)
    .returns<SavedNode[]>()

  if (actionNodesError) {
    return {
      ok: false,
      message: `Error with fetching action nodes: ${actionNodesError.message}`,
    }
  }

  //Update the action nodes
  for (const actionNode of actionNodes) {
    if (!actionNode.state.controls?.attribute) {
      continue
    }

    const updatedControls = {
      ...actionNode.state.controls,
    }
    // biome-ignore lint/performance/noDelete: <explanation>
    delete updatedControls.attribute

    const { error: updateError } = await supabase
      .from('action_nodes')
      .update({
        controls: undefined,
        state: {
          ...actionNode.state,
          controls: updatedControls,
        },
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

// Needs to be called before updating the attribute slug
export async function clearAttributeNodeControls(
  attributeId: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { data: attribute, error: attributeError } = await supabase
    .from('attributes')
    .select('id, slug, version')
    .eq('id', attributeId)
    .single()

  if (attributeError) {
    return { ok: false, message: 'Failed to fetch attribute' }
  }

  // Find all image nodes that depend on the attribute
  const { data: imageNodes, error: imageNodesError } = await supabase
    .from('image_nodes')
    .select('id, controls')
    .eq('version', attribute.version)
    .in(
      'type',
      attributeNodeDependency.nodes.map((node) => node.nodeType),
    )
    .eq('controls->attribute->>value', attribute.slug)
    .returns<SavedNode[]>()

  if (imageNodesError) {
    return {
      ok: false,
      message: `Image nodes error: ${imageNodesError.message}`,
    }
  }

  const nodeErrors = []

  // Update the image nodes
  for (const imageNode of imageNodes) {
    if (!imageNode.state.controls?.attribute) {
      continue
    }

    //Remove "attribute" key from controls
    const updatedControls = { ...imageNode.state.controls }
    // biome-ignore lint/performance/noDelete: <explanation>
    delete updatedControls.attribute

    const { error: updateError } = await supabase
      .from('image_nodes')
      .update({
        controls: undefined,
        state: {
          controls: updatedControls,
        },
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
    .eq('version', attribute.version)

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
    .in(
      'type',
      attributeNodeDependency.nodes.map((node) => node.nodeType),
    )
    .eq('controls->attribute->>value', attribute.slug)
    .returns<SavedNode[]>()

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

    const updatedControls = {
      ...actionNode.state.controls,
    }
    // biome-ignore lint/performance/noDelete: <explanation>
    delete updatedControls.attribute

    const { error: updateError } = await supabase
      .from('action_nodes')
      .update({
        controls: undefined,
        state: {
          ...actionNode.state,
          controls: updatedControls,
        },
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
