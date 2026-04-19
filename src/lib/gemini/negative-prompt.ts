import type { SupabaseClient } from '@supabase/supabase-js';

export async function buildNegativePrompt(
  userId: string,
  supabase: SupabaseClient
): Promise<string> {
  const { data } = await supabase
    .from('proposals')
    .select('final_text')
    .eq('user_id', userId)
    .not('final_text', 'is', null)
    .order('created_at', { ascending: false })
    .limit(20);

  if (!data?.length) return '';

  const snippets = data
    .map((d) => (d.final_text as string).slice(0, 200))
    .join('\n---\n');

  return `以下は過去提案の冒頭。表現・構成・フレーズの重複を避けてください:\n\n${snippets}`;
}