'use server'

import type {
  Attribute,
  InsertAttribute,
  ReturnInfo,
  UpdateAttribute,
} from '@/types/database.types'
import { FetchError } from '@/lib/errors'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerComponentClient } from '../server-client'
import { redirect } from 'next/navigation'
import {
  clearAttributeNodeControls,
  updateAttributeNodeControls,
} from './nodes'

const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

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

export type AttributeNavItem = Pick<
  Attribute,
  'name' | 'slug' | 'type' | 'list'
>
export async function getAttributesForNav(
  version: string,
): Promise<AttributeNavItem[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }

  const supabase = await createSupabaseServerComponentClient()

  const { data: attributes, error } = await supabase
    .from('attributes')
    .select('name, slug, type, list')
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

export async function updateAttribute(
  attribute: UpdateAttribute,
  oldSlug?: string,
): Promise<ReturnInfo> {
  if (!attribute.id) {
    return { ok: false, message: 'No attribute defined' }
  }

  if (attribute.display === undefined) {
    return { ok: false, message: 'Display type not defined' }
  }

  if (!attribute.token_specific) {
    return { ok: false, message: 'Token specific or not?' }
  }

  const supabase = await createSupabaseServerComponentClient()

  //TODO: Settings Validation

  try {
    await supabase.from('attributes').update(attribute).eq('id', attribute.id)
    if (
      oldSlug &&
      attribute.version &&
      attribute.slug &&
      attribute.slug !== oldSlug
    ) {
      const res = await updateAttributeNodeControls(
        attribute.version,
        oldSlug,
        attribute.slug,
      )
      console.log(res)
    }

    revalidatePath('/collections/[collection]/attributes/[attribute]')
    revalidatePath('/collections/[collection]/attributes/')
    return {
      ok: true,
      message: 'Successfully updated.',
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Error updating database entry!',
    }
  }
}

export async function setAttributeLock(id: string, locked: boolean) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('attributes')
    .update({ locked } as UpdateAttribute)
    .eq('id', id)
  if (error) {
    throw new FetchError('Error with updating attribute')
  }
}

/* export async function upsertBasicAttribute(
  attribute: InsertAttribute,
): Promise<ReturnInfo> {
  if (!attribute.slug) {
    return { ok: false, message: "No slug defined" };
  }

  if (!regex.test(attribute.slug)) {
    return {
      ok: false,
      message: "Slug can only contain lowercase letters, numbers, and dashes",
    };
  }

  const supabase = await createSupabaseServerComponentClient();

  const { data: allSlugs, error: fetchAllSlugsError } = await supabase
    .from("attributes")
    .select("id, slug")
    .eq("version", attribute.version);

  if (fetchAllSlugsError) {
    console.log(fetchAllSlugsError);
    throw new FetchError("Error with fetching slug data");
  }
  if (
    allSlugs.some(
      (attr) => attr.slug === attribute.slug && attr.id !== attribute.id,
    )
  ) {
    return { ok: false, message: "Too similar name already in use" };
  }

  const { error } = await supabase.from("attributes").upsert(attribute);

  if (error) {
    throw new FetchError("Error with inserting new attribute");
  }

  revalidatePath(`/collections/[collection]/attributes/[attribute]`);
  revalidatePath("/collections/[collection]/attributes/");

  return {
    ok: true,
    message: "Successfull!",
  };
} */

export async function insertAttribute(
  attribute: InsertAttribute,
): Promise<ReturnInfo> {
  if (!attribute.slug) {
    return { ok: false, message: 'No slug defined' }
  }
  if (!regex.test(attribute.slug)) {
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

export async function deleteAttribute(
  id: string,
  collectionSlug: string,
  versionId: string,
  slug: string,
): Promise<ReturnInfo> {
  if (!id) {
    return { ok: false, message: 'Unknown attribute' }
  }

  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase.from('attributes').delete().eq('id', id)
  if (error) {
    return { ok: false, message: error.message }
  }
  const res = await clearAttributeNodeControls(versionId, slug)
  revalidatePath('/collections/[collection]/attributes')
  return res
}

export async function deleteAttributeBySlug(
  versionId: string,
  attributeSlug: string,
) {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('attributes')
    .delete()
    .eq('slug', attributeSlug)
    .eq('version', versionId)

  if (error) {
    return { ok: false, message: error.message }
  }

  const res = await clearAttributeNodeControls(versionId, attributeSlug)

  revalidatePath('/collections/[collection]/attributes')
  return { ok: true, message: 'Successfully deleted' }
}
