import type { Action } from '@/types/database.types'
import ActionCard from './action-card'
import { cn } from '@/lib/utils'
import { NewActionDialog } from './new-action-dialog'

export default function ActionGrid({
  actions,
  collectionSlug,
  versionId,
  className,
}: {
  actions: Action[]
  collectionSlug: string
  versionId: string
  className?: string
}) {
  return (
    <ul className={cn('grid gap-2 lg:grid-cols-2 xl:grid-cols-3', className)}>
      {actions.map((action) => {
        return (
          <ActionCard
            key={action.slug}
            action={action}
            collectionSlug={collectionSlug}
          />
        )
      })}
      <NewActionDialog
        button={<ActionCard key="new" collectionSlug={collectionSlug} />}
        versionId={versionId}
        collectionSlug={collectionSlug}
      />
    </ul>
  )
}
