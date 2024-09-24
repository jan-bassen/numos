'use client'

import {
  type Action,
  type Attribute,
  type SimulatedTokenStateResult,
  NotatedDataTypeValueMap,
  type Version,
  TokenState,
  type OptionalTokenState,
} from '@/types/database.types'
import type { AutoSaveFunctions, Editor, SavedGraph } from '@/types/nodes.types'
import { Suspense, useState } from 'react'
import {
  deleteActionConnection,
  deleteActionNode,
  insertActionNode,
  saveActionNodePosition,
  updateActionNode,
  upsertActionConnection,
} from '@/lib/supabase/db/action-graph'
import { simulateActionGraph } from '@/lib/rete/engine'
import type { SimulationCheck } from '@/lib/errors'
import { toast } from 'sonner'
import BaseEditor from '../../node-editor/editor/base-editor'
import { actionConfig } from '@/lib/rete/nodes/configs/action-config'
import TokenResult from './token-result'
import SimulationForm from '@/components/node-editor/editor/simulation-form'
import type { ActionTrigger, ParameterState } from './action-schema'

const autoSaveActions: AutoSaveFunctions = {
  uploadNode: insertActionNode,
  updateNode: updateActionNode,
  deleteNode: deleteActionNode,
  saveNodePosition: saveActionNodePosition,
  uploadConnection: upsertActionConnection,
  deleteConnection: deleteActionConnection,
}

export default function ActionNodeEditor({
  initialGraph,
  version,
  action,
  attributes,
  collectionSlug,
}: {
  initialGraph: SavedGraph
  version: Version
  action: Action
  attributes: Attribute[]
  collectionSlug: string
}) {
  const [result, setResult] = useState<SimulatedTokenStateResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function run(
    editor: Editor | null,
    state: OptionalTokenState,
    parameters?: ParameterState,
  ): Promise<SimulationCheck> {
    setLoading(true)
    const graph = editor?.editor.getNodemap()
    if (!state || !graph)
      return {
        success: false,
        error: {
          type: 'unknown',
          message: 'Something went wrong',
        },
      }
    const rootNodeId = Object.entries(graph).find(
      ([key, node]) => node.type === 'action-root',
    )?.[0]
    if (!rootNodeId) {
      toast.error('Root node not found')
      return {
        success: false,
        error: {
          type: 'unknown',
          message: 'No root node found',
        },
      }
    }
    const { result, error } = await simulateActionGraph(
      graph,
      rootNodeId,
      state,
      version,
      attributes,
      parameters,
    )
    if (error) {
      setLoading(false)
      return { success: false, error }
    }
    if (result) {
      setResult(result)
      setLoading(false)
      return { success: true }
    }
    return {
      success: false,
      error: {
        type: 'unknown',
        message: 'Something went wrong',
      },
    }
  }

  const trigger = action.trigger as ActionTrigger | undefined

  return (
    <BaseEditor
      action={action}
      parentId={action.id}
      initialGraph={initialGraph}
      attributes={attributes}
      context={{
        type: 'action',
        attributes: attributes,
        parameters:
          trigger?.type === 'api' ? trigger?.settings.params : undefined,
        action: action,
      }}
      config={actionConfig}
      result={<TokenResult result={result || undefined} loading={loading} />}
      resetResult={() => setResult(null)}
      run={run}
      autosave={autoSaveActions}
      resultClassName="h-full"
      parentUrl={`/studio/${collectionSlug}/actions/${action.slug}`}
    />
  )
}
