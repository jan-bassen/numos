'use client'

import type { Action, Attribute, Version } from '@/types/database.types'
import { useState } from 'react'
import {
  deleteActionConnection,
  deleteActionNode,
  insertActionNode,
  saveActionNodePosition,
  updateActionNode,
  upsertActionConnection,
} from '@/lib/data/action-graph'
import { simulateActionGraph } from '@/lib/rete/engine'
import type { SimulationCheck } from '@/lib/errors'
import { toast } from 'sonner'
import BaseEditor from '@/components/node-editor/editor/base-editor'
import { actionConfig } from '@/lib/rete/nodes/configs/action-config'
import TokenResult from './token-result'
import type { AutoSaveFunctions, Editor } from '@/types/editor.types'
import type { SavedGraph } from '@repo/shared/types/graph-types'
import type {
  ActionContext,
  SimulatedTokenStateResult,
  SimulationData,
} from '@repo/shared/types/engine-types'

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
    data: SimulationData,
  ): Promise<SimulationCheck> {
    setLoading(true)
    const graph = editor?.editor.getNodemap()
    if (!data || !graph)
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
    const context: ActionContext = {
      collectionId: version.id,
      versionId: version.id,
      actionId: action.id,
    }
    const { result, error } = await simulateActionGraph(graph, data, context)
    console.log(result, error)
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

  return (
    <BaseEditor
      parentId={action.id}
      initialGraph={initialGraph}
      context={{
        type: 'action',
        attributes: attributes,
        action: action,
      }}
      config={actionConfig}
      result={
        <TokenResult
          result={result || undefined}
          loading={loading}
          attributes={attributes}
        />
      }
      resetResult={() => setResult(null)}
      run={run}
      autosave={autoSaveActions}
      resultClassName="h-full"
      parentUrl={`/collections/${collectionSlug}/actions/${action.slug}`}
    />
  )
}
