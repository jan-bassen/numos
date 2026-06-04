import { FetchError } from '@/lib/errors'
import type { Attribute } from '@/types/database.types'
import { getAllBy } from '@/lib/data/store'
import { getCollectionFromSlug } from '@/lib/data/collections'

export async function getAllAttributes(version: string): Promise<Attribute[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const attributes = await getAllBy<Attribute>('attributes', 'version', version)
  return attributes.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
}

export async function getLatestAttributes(
  version: string,
  amount = 3,
): Promise<Attribute[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const attributes = await getAllBy<Attribute>('attributes', 'version', version)
  return attributes
    .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
    .slice(0, amount)
}

export async function getAttribute(id: string): Promise<Attribute> {
  if (!id) {
    throw new FetchError('No attribute defined')
  }
  const [attribute] = await getAllBy<Attribute>('attributes', 'id', id)
  if (!attribute) {
    throw new FetchError('error with fetch')
  }
  return attribute
}

export async function getAttributeBySlug(
  version: string,
  slug: string,
): Promise<Attribute> {
  if (!slug) {
    throw new FetchError('No attribute defined')
  }
  const attributes = await getAllBy<Attribute>('attributes', 'version', version)
  const attribute = attributes.find((a) => a.slug === slug)
  if (!attribute) throw new FetchError('Attribute not found')
  return attribute
}

export async function getAttributeBySlugs(
  collection: string,
  attribute: string,
): Promise<Attribute | null> {
  if (!attribute || !collection) {
    throw new FetchError('No attribute or collection defined')
  }
  const collectionRow = await getCollectionFromSlug(collection)
  if (!collectionRow.editable_version) return null
  const attributes = await getAllBy<Attribute>(
    'attributes',
    'version',
    collectionRow.editable_version,
  )
  return attributes.find((a) => a.slug === attribute) ?? null
}

export type AttributeNavItem = Pick<Attribute, 'name' | 'slug' | 'value'>
export async function getAttributesForNav(
  version: string,
): Promise<AttributeNavItem[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const attributes = await getAllAttributes(version)
  return attributes.map(({ name, slug, value }) => ({ name, slug, value }))
}
