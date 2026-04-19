import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatForPlatform } from '@/lib/platforms';
import type { Platform } from '@/types/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json() as { platform?: Platform };

    const { data: proposal } = await supabase.from('proposals').select('*').eq('id', id).eq('user_id', user.id).single();
    if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const platform = body.platform ?? (proposal.platform as Platform);
    const text = formatForPlatform((proposal.final_text as string) ?? '', platform);
    return NextResponse.json({ text, platform });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}