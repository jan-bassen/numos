'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './server-client'
import type { ReturnInfo } from '@/types/database.types'
import { z } from 'zod'
import { signupSchema } from '../validation/auth'
import { hubspot } from '../hubspot/hubspot-client'
import {
  type CollectionResponseWithTotalSimplePublicObjectForwardPaging,
  FilterOperatorEnum,
} from '@hubspot/api-client/lib/codegen/crm/contacts'

export async function signInWithPassword(data: {
  email: string
  password: string
}) {
  const supabase = await createSupabaseServerClient()
  const res = await supabase.auth.signInWithPassword(data)
  return res
}

export async function resendVerificationEmail(
  email: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.resend({ email, type: 'signup' })
  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }
  return {
    ok: true,
    message: 'Email sent',
  }
}

export async function signup(data: {
  email: string
  password: string
}): Promise<ReturnInfo> {
  try {
    signupSchema.safeParse(data)
  } catch (error) {
    return {
      ok: false,
      message: 'Login credentials are invalid. Please try again.',
    }
  }

  const supabase = await createSupabaseServerClient()

  let contact: CollectionResponseWithTotalSimplePublicObjectForwardPaging
  try {
    contact = await hubspot.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: FilterOperatorEnum.Eq,
              value: data.email,
            },
          ],
        },
      ],
      sorts: [],
      properties: ['email', 'accepted', 'firstname', 'lastname'],
      limit: 1,
      after: '0',
    })
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message:
        'There was an error looking up your account. Please try again later.',
    }
  }

  if (!contact.results[0]) {
    return {
      ok: false,
      message:
        "It doesn't look like you signed up with the beta yet. Please do that first. We'll get back to you soon!",
    }
  }

  const properties = contact.results[0].properties

  if (properties.accepted !== 'YES') {
    return {
      ok: false,
      message:
        "Email has not been accepted yet. Please sign up for the beta, if you haven't already. We'll get back to you soon!",
    }
  }

  const firstName = properties.firstname as string | undefined
  const lastName = properties.lastname as string | undefined
  const fullName = firstName
    ? lastName
      ? `${firstName} ${lastName}`
      : firstName
    : null

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        firstName: firstName,
        lastName: lastName,
        name: fullName,
      },
    },
  })

  if (error) {
    return {
      ok: false,
      message: `Error with creating user: ${error.message}`,
    }
  }

  revalidatePath('/', 'layout')

  return {
    ok: true,
    message: 'Account created, please verify you email before logging in.',
  }
}

export async function changePassword(password: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.updateUser({
    password,
  })
  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }
  return {
    ok: true,
    message: 'Password changed',
  }
}

export async function resetPassword(password: string, code: string) {
  const supabase = await createSupabaseServerClient()
  const { error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code)
  if (sessionError) {
    return {
      ok: false,
      message: sessionError.message,
    }
  }
  const { data, error } = await supabase.auth.updateUser({
    password,
  })
  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }
  return {
    ok: true,
    message: 'Password reset successfull',
  }
}
