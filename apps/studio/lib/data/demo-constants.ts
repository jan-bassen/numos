/**
 * Stable identifiers for the seeded demo account/profile/user. Fixed (not random)
 * so the stubbed `UserProvider` and the seed always agree, and so `getProfile`
 * can fall back to a known profile.
 */
export const DEMO_ACCOUNT_ID = '00000000-0000-4000-8000-000000000001'
export const DEMO_USER_ID = '00000000-0000-4000-8000-000000000002'

export const DEMO_PROFILE = {
  id: DEMO_USER_ID,
  full_name: 'Demo User',
  username: 'demo',
  avatar_url: null as string | null,
  updated_at: null as string | null,
}

/** Minimal `@supabase/supabase-js` `User`-shaped object for the stubbed auth. */
export const DEMO_USER = {
  id: DEMO_USER_ID,
  app_metadata: {},
  user_metadata: { name: 'Demo User' },
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00.000Z',
  email: 'demo@numos.local',
}
