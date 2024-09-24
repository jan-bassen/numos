'use client'

import {
  type Attribute,
  type LayerTree,
  type LegacyLayerTree,
  NotatedDataTypeValueMap,
  type OptionalTokenState,
  TokenState,
  type Version,
} from '@/types/database.types'
import type { AutoSaveFunctions, Editor, SavedGraph } from '@/types/nodes.types'
import NodeEditor from '../../node-editor/editor/base-editor'
import { useState } from 'react'
import { simulateImageGraph } from '@/lib/rete/engine'
import type { SimulationCheck } from '@/lib/errors'
import type { FullFileObject } from '@/lib/supabase/storage/user-images'
import Image from 'next/image'
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
import SimulationForm from '@/components/node-editor/editor/simulation-form'
import type { ParameterState } from '../actions/action-schema'
import LoadingSpinner from '@repo/ui/components/loading/loading-spinner'

export function ImageResult({
  result,
  loading,
}: {
  result?: string
  loading?: boolean
}) {
  if (loading && !result) return <LoadingSpinner containerClassName="!h-80" />
  if (!result) return null
  return (
    <Image
      src={
        result ? `data:image/jpeg;base64,${result}` : '/images/placeholder.png'
      }
      alt="Result"
      width={320}
      height={320}
    />
  )
}

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

    const { image, error } = await simulateImageGraph(
      graph,
      rootNodeId,
      state,
      attributes,
      version,
    )
    if (error) {
      setLoading(false)
      return { success: false, error }
    }
    if (image) {
      setResult(image)
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
      attributes={attributes}
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
      resultClassName="!min-h-[20.2rem] overflow-hidden"
    />
  )
}
