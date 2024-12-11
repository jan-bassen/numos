'use server'

import 'server-only'

import type { Attribute, UpdateAttribute } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import { revalidatePath } from 'next/cache'
import { updateAttributeNodeControls } from '../nodes'
import { updateAttributeSlugInNodes } from './nodes/update'
import { redirect } from 'next/navigation'
import type { UpdateOptions } from '@/types/state.types'
import { ZodError, type ZodType } from 'zod'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { updateAttributeSchema } from '@/lib/schemas/attribute-schema-new'
import { createSafeUpdate } from '../create-safe-update'

export async function updateAttributeBase(id: string, values: UpdateAttribute) {
  if (values.slug) {
    if (typeof values.slug !== 'string' || values.slug.length === 0) {
      return { ok: false, message: 'Slug cannot be empty' }
    }
    const res = await updateAttributeSlugInNodes(id, values.slug)
    if (!res.ok) {
      return res
    }
  }

  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('attributes')
    .update(values)
    .eq('id', id)
  if (error) {
    return { ok: false, message: error.message }
  }
  return { ok: true, message: 'Attribute updated' }
}

export const updateAttribute = createSafeUpdate<UpdateAttribute>(
  updateAttributeBase,
  updateAttributeSchema,
)

// -----------------------------------------------------------------------------

export async function updateAttributeLegacy(
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

export async function updateAttributeLegacy2(
  id: string,
  attribute: UpdateAttribute,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  //TODO: Settings Validation

  const { data, error } = await supabase
    .from('attributes')
    .update(attribute)
    .eq('id', id)

  /* if (
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
    } */
  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/collections/[collection]/attributes/[attribute]', 'layout')
  return {
    ok: true,
    message: 'Successfully updated.',
  }
}

// -----------------------------------------------------------------------------

/* export async function updateAttributeValue<K extends keyof Attribute>(
  id: string,
  key: K,
  value: Attribute[K] | undefined,
  options?: UpdateValueOptions<Attribute>,
) {


  const attribute: UpdateAttribute = {
    [key]: value,
  }

  return updateAttribute(id, attribute, options)
} */

/* export async function updateAttribute(
  id: string,
  values: UpdateAttribute,
  options?: UpdateOptions,
) {
  try {
    const validValues = (await updateAttributeSchema.parseAsync(
      values,
    )) as UpdateAttribute

    if (validValues.slug) {
      if (
        typeof validValues.slug !== 'string' ||
        validValues.slug.length === 0
      ) {
        return { ok: false, message: 'Slug cannot be empty' }
      }
      const res = await updateAttributeSlugInNodes(id, validValues.slug)
      if (!res.ok) {
        return res
      }
    }

    const supabase = await createSupabaseServerComponentClient()

    const { error } = await supabase
      .from('attributes')
      .update(validValues)
      .eq('id', id)

    if (error) {
      return { ok: false, message: error.message }
    }
    if (options?.revalidate) {
      for (const { path, type } of options.revalidate) {
        revalidatePath(path, type)
      }
    }
  } catch (error) {
    return { ok: false, message: 'Error updating attribute' }
  }
  if (options?.redirect) {
    redirect(`${options.redirect}`)
  }
  return { ok: true, message: 'Attribute updated' }
}
 */
