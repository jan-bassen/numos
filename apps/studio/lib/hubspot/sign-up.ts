'use server'

import { hubspot } from './hubspot-client'
import {
  FilterOperatorEnum,
  PublicObjectSearchRequest,
  type SimplePublicObjectInputForCreate,
} from '@hubspot/api-client/lib/codegen/crm/contacts'

export type SignUp = {
  email: string
  firstname: string
  lastname?: string
  message?: string
}

export async function signUp(data: SignUp) {
  let existing = false
  try {
    const res = await hubspot.crm.contacts.searchApi.doSearch({
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
    existing = res.total > 0
  } catch (e) {
    return {
      ok: false,
      message: 'Error with looking up sign ups. Please try again later.',
    }
  }

  if (existing) {
    return {
      ok: false,
      message: "You've already signed up. We'll get back to you soon.",
    }
  }

  try {
    const newContact: SimplePublicObjectInputForCreate = {
      properties: {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname || '',
        message: data.message || '',
        accepted: 'NO',
        lifecyclestage: 'lead',
      },
      associations: [],
    }

    await hubspot.crm.contacts.basicApi.create(newContact)
    return {
      ok: true,
      message: "Thanks for signing up! We'll get back to you soon.",
    }
  } catch (e) {
    return {
      ok: false,
      message:
        'Error with signing up. Please send us a message if this persists!',
    }
  }
}
