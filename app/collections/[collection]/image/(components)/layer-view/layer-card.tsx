import { layerOptions } from '@/lib/constants/layers'
import type { Layer } from '@/types/database.types'
import { PiThreeByTwoDotsVertical } from '@repo/ui/icons/pika'
import Link from 'next/link'
import LayerContextMenu from '../layer-context-menu'
import type { ListInputComponentProps } from '@/components/datatypes/list/list-input'

export function LayerCard({
  value: layer,
  collectionSlug,
  draggableProps,
}: ListInputComponentProps<Layer> & { collectionSlug: string }) {
  if (!layer) return null
  return (
    <div className="flex h-14 w-full items-center">
      <div
        {...draggableProps.attributes}
        {...draggableProps.listeners}
        className="grid h-full w-6 place-items-center rounded-l-lg border-border border-y border-l"
      >
        <PiThreeByTwoDotsVertical className="size-4 focus:outline-hidden" />
      </div>
      <LayerContextMenu
        layerSlug={layer.slug}
        versionId={layer.version}
        collectionSlug={collectionSlug}
      >
        <Link
          key={layer.id}
          href={`/collections/${collectionSlug}/image/${layer.slug}`}
          className="flex h-14 w-full flex-col justify-center gap-2 rounded-r-lg border border-border bg-background p-4 hover:bg-muted data-[state=open]:bg-muted"
        >
          <div className="flex items-center gap-1.5">
            {layerOptions[layer.definition.type]?.Icon({
              className: 'size-4',
            })}
            <h3 className="font-medium">{layer.name}</h3>
          </div>
        </Link>
      </LayerContextMenu>
      {/* <div className="flex flex-col items-center justify-center">
        <Button variant="ghost" size="iconMedium">
          <PiArrowUpStroke className="size-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="iconMedium">
          <PiArrowDownStroke className="size-4 text-muted-foreground" />
        </Button>
      </div> */}
    </div>
  )
}
