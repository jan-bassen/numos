'use server'

import 'server-only'
import { FetchError } from '@/lib/errors'
import type { InsertAttribute } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { hrefRegex, type ReturnInfo } from '@repo/ui/lib/utils'
import { revalidatePath } from 'next/cache'

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

  const supabase = await createSupabaseServerComponentClient()

  const { data: allSlugs, error: allSlugsFetchError } = await supabase
    .from('attributes')
    .select()
    .eq('version', attribute.version)

  if (allSlugsFetchError) {
    throw new FetchError('Error with fetching slug data')
  }
  if (allSlugs.some((attr) => attr.slug === attribute.slug)) {
    return { ok: false, message: 'Slug already exists' }
  }

  const { error } = await supabase.from('attributes').insert(attribute)

  if (error) {
    throw new FetchError('Error with inserting new attribute')
  }

  return {
    ok: true,
    message: 'Successfully created',
  }
}

export async function duplicateAttribute(id: string): Promise<ReturnInfo> {
  if (!id) {
    return { ok: false, message: 'Unknown attribute' }
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data: attribute, error: fetchAttributeError } = await supabase
    .from('attributes')
    .select()
    .eq('id', id)
    .single()

  if (fetchAttributeError) {
    throw new FetchError('Error with fetching attribute')
  }

  const newSlug = `${attribute.slug}-copy`

  const { data: allSlugs, error: allSlugsFetchError } = await supabase
    .from('attributes')
    .select()
    .eq('version', attribute.version)

  if (allSlugsFetchError) {
    throw new FetchError('Error with fetching slug data')
  }
  if (allSlugs.some((attributes) => attributes.slug === newSlug)) {
    return { ok: false, message: 'Slug already exists' }
  }

  const copiedAttribute: InsertAttribute = {
    name: `${attribute.name}-copy`,
    slug: newSlug,
    version: attribute.version,
    type: attribute.type,
    display: attribute.display,
    token_specific: attribute.token_specific,
    settings: attribute.settings,
    value: attribute.value,
  }

  const { error } = await supabase.from('attributes').insert(copiedAttribute)

  if (error) {
    throw new FetchError('Error with inserting new attribute')
  }

  revalidatePath('/collections/[collection]/attributes/[attribute]')
  return {
    ok: true,
    message: 'Successfully duplicated',
  }
}
