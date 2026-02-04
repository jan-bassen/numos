import ActionContextMenu from '@/app/collections/[collection]/actions/(components)/action-context-menu'
import type { ElementType } from '@/lib/constants/elements'
import AttributeContextMenu from '@/app/collections/[collection]/attributes/(components)/attribute-context-menu'
import LayerContextMenu from '@/app/collections/[collection]/image/(components)/layer-context-menu'

type ElementContextMenuProps = {
  elementType: ElementType
  children: React.ReactNode
  slug: string
  collectionSlug: string
  versionId: string
}

export const ElementContextMenu = ({
  elementType,
  children,
  slug,
  collectionSlug,
  versionId,
}: ElementContextMenuProps) => {
  switch (elementType) {
    case 'action':
      return (
        <ActionContextMenu
          actionSlug={slug}
          collectionSlug={collectionSlug}
          versionId={versionId}
        >
          {children}
        </ActionContextMenu>
      )
    case 'attribute':
      return (
        <AttributeContextMenu
          attributeSlug={slug}
          collectionSlug={collectionSlug}
          versionId={versionId}
        >
          {children}
        </AttributeContextMenu>
      )
    case 'layer':
      return (
        <LayerContextMenu
          layerSlug={slug}
          versionId={versionId}
          collectionSlug={collectionSlug}
        >
          {children}
        </LayerContextMenu>
      )
    default:
      return null
  }
}
