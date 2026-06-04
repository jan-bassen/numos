import { FetchError } from '@/lib/errors'
import type { Attribute, InsertAttribute } from '@/types/database.types'
import { hrefRegex, type ReturnInfo } from '@repo/ui/lib/utils'
import { getAllBy, newId, put } from '@/lib/data/store'

const now = () => new Date().toISOString()

function buildAttribute(attribute: InsertAttribute): Attribute {
  return {
    id: attribute.id ?? newId(),
    version: attribute.version,
    slug: attribute.slug,
    name: attribute.name ?? null,
    description: attribute.description ?? null,
    display: attribute.display ?? 'public',
    token_specific: attribute.token_specific ?? false,
    locked: attribute.locked ?? false,
    settings: attribute.settings ?? null,
    value: attribute.value,
    created_at: now(),
    updated_at: now(),
  }
}

export async function insertAttribute(
  attribute: InsertAttribute,
): Promise<ReturnInfo> {
  if (!attribute.slug) {
    return { ok: false, message: 'No slug defined' }
  }
  if (!hrefRegex.test(attribute.slug)) {
    return {
      ok: false,
      message: 'Slug can only contain lowercase letters, numbers, and dashes',
    }
  }

  const allSlugs = await getAllBy<Attribute>(
    'attributes',
    'version',
    attribute.version,
  )
  if (allSlugs.some((attr) => attr.slug === attribute.slug)) {
    return { ok: false, message: 'Slug already exists' }
  }

  await put('attributes', buildAttribute(attribute))
  return { ok: true, message: 'Successfully created' }
}

export async function duplicateAttribute(id: string): Promise<ReturnInfo> {
  if (!id) {
    return { ok: false, message: 'Unknown attribute' }
  }
  const [attribute] = await getAllBy<Attribute>('attributes', 'id', id)
  if (!attribute) {
    throw new FetchError('Error with fetching attribute')
  }

  const newSlug = `${attribute.slug}-copy`
  const allSlugs = await getAllBy<Attribute>(
    'attributes',
    'version',
    attribute.version,
  )
  if (allSlugs.some((attr) => attr.slug === newSlug)) {
    return { ok: false, message: 'Slug already exists' }
  }

  await put(
    'attributes',
    buildAttribute({
      name: `${attribute.name}-copy`,
      slug: newSlug,
      version: attribute.version,
      display: attribute.display,
      token_specific: attribute.token_specific,
      settings: attribute.settings,
      value: attribute.value,
    }),
  )
  return { ok: true, message: 'Successfully duplicated' }
}
