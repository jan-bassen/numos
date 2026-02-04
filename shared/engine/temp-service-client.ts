'use server'

import 'server-only'

import { createClient } from '@supabase/supabase-js'

export async function createSupabaseServiceClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_KEY
  ) {
    throw new Error('Missing database service key environment variable')
  }
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  )
}
