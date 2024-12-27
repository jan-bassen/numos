'use client'

import type { Attribute, LayerTree, Version } from '@/types/database.types'
import type { AutoSaveFunctions, Editor } from '@/types/editor.types'
import type { SavedGraph } from '@repo/engine/types/graph-types'
import NodeEditor from '@/components/node-editor/editor/base-editor'
import { useState } from 'react'
import type { SimulationCheck } from '@/lib/errors'
import {
  deleteImageConnection,
  deleteImageNode,
  insertImageNode,
  saveImageNodePosition,
  updateImageNode,
  upsertImageConnection,
} from '@/lib/supabase/db/image-graph'
import { toast } from 'sonner'
import { imageConfig } from '@/lib/rete/nodes/configs/image-config'
import type {
  EngineContext,
  SimulationData,
} from '@repo/engine/types/engine-types'
import { simulateImageGraph } from '@/lib/rete/engine'
import ImageResult from './image-result'

const autoSaveActions: AutoSaveFunctions = {
  uploadNode: insertImageNode,
  updateNode: updateImageNode,
  deleteNode: deleteImageNode,
  saveNodePosition: saveImageNodePosition,
  uploadConnection: upsertImageConnection,
  deleteConnection: deleteImageConnection,
}

export default function ImageNodeEditor({
  version,
  attributes,
  layerTree,
  initialGraph,
}: {
  version: Version
  attributes: Attribute[]
  layerTree: LayerTree
  initialGraph: SavedGraph
}) {
  const [result, setResult] = useState<string | null>(null)
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
      ([key, node]) => node.type === 'image-root',
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

    const context: EngineContext = {
      collectionId: version.collection,
    }

    const { result, error } = await simulateImageGraph(graph, data, context)
    if (error) {
      setLoading(false)
      return { success: false, error }
    }
    if (result) {
      setResult(result.value)
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
    <NodeEditor
      parentId={version.id}
      initialGraph={initialGraph}
      context={{
        type: 'image',
        attributes: attributes,
        layers: layerTree,
      }}
      config={imageConfig}
      result={<ImageResult result={result || undefined} loading={loading} />}
      resetResult={() => setResult(null)}
      run={run}
      autosave={autoSaveActions}
      resultClassName=" overflow-hidden"
    />
  )
}
