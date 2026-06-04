'use client'

import { getAttributeBySlugs } from '@/lib/data/attributes/read'
import { AttributeProvider } from './attribute-context'
import { notFound, useParams } from 'next/navigation'
import { useAsyncResource } from '@/lib/data/use-async-resource'

export default function AttributeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { collection: collectionSlug, attribute: attributeSlug } = useParams<{
    collection: string
    attribute: string
  }>()
  const { data: attribute, loading } = useAsyncResource(
    () => getAttributeBySlugs(collectionSlug, attributeSlug),
    [collectionSlug, attributeSlug],
  )
  if (loading) return null
  if (!attribute) {
    notFound()
  }
  return <AttributeProvider attribute={attribute}>{children}</AttributeProvider>
}
