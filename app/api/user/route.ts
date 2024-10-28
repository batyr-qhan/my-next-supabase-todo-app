import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase: SupabaseClient<Database> = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return new Response(JSON.stringify(user), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response('Error getting user', { status: 500 });
  }
}
