import { getAttributeBySlugs } from '@/lib/supabase/db/attributes/read'
import { AttributeProvider } from './attribute-context'
import { notFound } from 'next/navigation'

export default async function Attribute({
  params,
  children,
}: {
  params: Promise<{ collection: string; attribute: string }>
  children: React.ReactNode
}) {
  const { collection: collectionSlug, attribute: attributeSlug } = await params
  const attribute = await getAttributeBySlugs(collectionSlug, attributeSlug)
  if (!attribute) {
    notFound()
  }
  return <AttributeProvider attribute={attribute}>{children}</AttributeProvider>
}
