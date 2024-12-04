'use client'

import { migrate } from '@/lib/migrate'
import { getAttributeBySlugs } from '@/lib/supabase/db/attributes/read'
import { Button } from '@repo/ui/components/ui/button'

export function TestButton() {
  async function handleClick() {
    await getAttributeBySlugs('treuekarte', 'bool')
  }
  return <Button onClick={() => migrate()}>Migrate</Button>
}
