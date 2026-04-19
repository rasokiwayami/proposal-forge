import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runAgent } from '@/lib/gemini/client';

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: wonProposals } = await supabase
      .from('proposals').select('final_text, job_title')
      .eq('user_id', user.id).eq('status', 'won').not('final_text', 'is', null).limit(10);

    if (!wonProposals?.length) return NextResponse.json({ message: '受注案件がまだありません' });

    const combined = (wonProposals as Array<{ job_title: string; final_text: string }>)
      .map((p, i) => '## 提案' + (i + 1) + ': ' + p.job_title + '\n' + p.final_text)
      .join('\n\n---\n\n');

    const system = '以下の受注した提案文から共通する成功パターンを3〜5個抽出し、JSON配列で返してください。\n形式: [{"pattern_text": "...", "tag": "..."}]';
    const raw = await runAgent('flash', system, combined);
    const match = raw.match(/\[.*\]/s);
    if (!match) return NextResponse.json({ message: 'パターン抽出失敗' });

    const patterns = JSON.parse(match[0]) as { pattern_text: string; tag: string }[];
    await Promise.all(patterns.map((p) => supabase.from('win_patterns').insert({ user_id: user.id, ...p, used_count: 0 })));
    return NextResponse.json({ patterns });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}