'use server'

import 'server-only'

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../../types/database-generated.types'

export async function createSupabaseServiceClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_KEY
  ) {
    throw new Error('Missing database service key environment variable')
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  )
}
