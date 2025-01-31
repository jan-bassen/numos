import 'server-only'
import { FetchError } from '@/lib/errors'
import type { Attribute } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'

export async function getAllAttributes(version: string): Promise<Attribute[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('attributes')
    .select()
    .eq('version', version)
    .order('name', { ascending: true })
    .returns<Attribute[]>()

  if (error) {
    throw new FetchError('error with fetch')
  }
  return data
}

export async function getLatestAttributes(
  version: string,
  amount = 3,
): Promise<Attribute[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const index = amount - 1
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('attributes')
    .select()
    .eq('version', version)
    .order('updated_at', { ascending: false })
    .range(0, index)
    .returns<Attribute[]>()

  if (error) {
    throw new FetchError('error with fetch')
  }
  return data
}

export async function getAttribute(id: string): Promise<Attribute> {
  if (!id) {
    throw new FetchError('No attribute defined')
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('attributes')
    .select()
    .eq('id', id)
    .single()

  if (error) {
    throw new FetchError('error with fetch')
  }

  return data
}

export async function getAttributeBySlug(
  version: string,
  slug: string,
): Promise<Attribute> {
  if (!slug) {
    throw new FetchError('No attribute defined')
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('attributes')
    .select()
    .eq('slug', slug)
    .eq('version', version)
    .maybeSingle()

  if (error) {
    throw new FetchError('error with fetch')
  }

  if (!data) throw new FetchError('Attribute not found')

  return data
}

export async function getAttributeBySlugs(
  collection: string,
  attribute: string,
): Promise<Attribute | null> {
  if (!attribute || !collection) {
    throw new FetchError('No attribute or collection defined')
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .rpc('attribute_from_slugs', {
      collection_slug: collection,
      attribute_slug: attribute,
    })
    .returns<Attribute | null>()

  if (error) {
    throw new FetchError('error with fetch')
  }

  if (!data || !data.id) return null
  return data
}

export type AttributeNavItem = Pick<Attribute, 'name' | 'slug' | 'value'>
export async function getAttributesForNav(
  version: string,
): Promise<AttributeNavItem[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }

  const supabase = await createSupabaseServerComponentClient()

  const { data: attributes, error } = await supabase
    .from('attributes')
    .select('name, slug, value')
    .eq('version', version)
    .order('name', { ascending: true })

  if (error) {
    throw new FetchError('Error with fetching attributes')
  }
  if (attributes.length === 0) {
    return []
  }

  return attributes
}

/* export const isAttributeSlugTaken = async (slug: string) => {
  const supabase = await createSupabaseServerComponentClient()
  const { count, data, error } = await supabase
    .from('attributes')
    .select('slug, version', { count: 'exact'})
    .eq('slug', slug)

  if (error) {
    throw new FetchError('Error with fetching collection')
  }

  if (count === 0) return false
  

  return !!data
} */
