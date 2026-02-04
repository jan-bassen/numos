import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/clients/server-client';
 
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('actions').select('*').limit(1);

  if (error) {
    return new Response('Error fetching actions', { status: 500 });
  }
 
  return Response.json({ success: !!data?.length });
}