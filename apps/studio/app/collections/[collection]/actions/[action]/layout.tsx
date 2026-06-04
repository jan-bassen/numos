'use client'

import { getActionBySlugs } from '@/lib/data/actions/read'
import { ActionProvider } from '@/app/collections/[collection]/actions/[action]/action-context'
import { notFound, useParams } from 'next/navigation'
import { useAsyncResource } from '@/lib/data/use-async-resource'

export default function ActionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { collection: collectionSlug, action: actionSlug } = useParams<{
    collection: string
    action: string
  }>()
  const { data: action, loading } = useAsyncResource(
    () => getActionBySlugs(collectionSlug, actionSlug),
    [collectionSlug, actionSlug],
  )
  if (loading) return null
  if (!action) {
    notFound()
  }
  return <ActionProvider action={action}>{children}</ActionProvider>
}
