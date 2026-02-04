import type { ElementType } from '@/lib/constants/elements'
import { NewActionDialog } from '@/app/collections/[collection]/actions/(components)/new-action/new-action-dialog'
import { NewAttributeDialog } from '@/app/collections/[collection]/attributes/(components)/new-attribute-dialog'
import { NewLayerDialog } from '@/app/collections/[collection]/image/(components)/new-layer/new-layer-dialog'

export type NewElementDialogProps = {
  children: React.ReactNode
  versionId: string
}

export const NewElementDialog = ({
  elementType,
  children,
  versionId,
}: NewElementDialogProps & { elementType: ElementType }) => {
  switch (elementType) {
    case 'action':
      return <NewActionDialog versionId={versionId}>{children}</NewActionDialog>
    case 'attribute':
      return (
        <NewAttributeDialog versionId={versionId}>
          {children}
        </NewAttributeDialog>
      )
    case 'layer':
      return <NewLayerDialog versionId={versionId}>{children}</NewLayerDialog>
    default:
      return null
  }
}
