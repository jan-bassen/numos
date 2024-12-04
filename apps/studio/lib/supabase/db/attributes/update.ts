'use server'

import 'server-only'
import { FetchError } from '@/lib/errors'
import type { Attribute, UpdateAttribute } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import { revalidatePath } from 'next/cache'
import { updateAttributeNodeControls } from '../nodes'

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

export async function updateAttribute(
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

export async function updateAttributeValue<K extends keyof Attribute>(
  id: string,
  key: K,
  value: Attribute[K],
  options?: {
    revalidate?: boolean
  },
) {
  const attribute: UpdateAttribute = {
    [key]: value,
  }
  try {
    //TODO: HANDLE SLUG CHANGES --- NODE CONTROLS VIA ID!!!!!

    const supabase = await createSupabaseServerComponentClient()
    const { error } = await supabase
      .from('attributes')
      .update(attribute)
      .eq('id', id)

    if (error) {
      return { ok: false, message: error.message }
    }
    if (options?.revalidate) {
      revalidatePath('/collections/[collection]/attributes/[attribute]')
    }
    return { ok: true, message: 'Attribute renamed' }
  } catch (error) {
    return { ok: false, message: 'Unkown error' }
  }
}
