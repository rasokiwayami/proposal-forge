import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { industryAnalyst, pricingEstimator, scheduleEstimator, differentiator, copyReviewer } from '@/lib/gemini/agents';
import { buildNegativePrompt } from '@/lib/gemini/negative-prompt';
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
    const body = await request.json() as { agent_name: string; extra_instruction?: string };
    const { agent_name } = body;

    const { data: proposal } = await supabase.from('proposals').select('*').eq('id', id).eq('user_id', user.id).single();
    if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const negativePrompt = await buildNegativePrompt(user.id, supabase);
    const ctx = {
      jobTitle: proposal.job_title as string,
      jobDescription: proposal.job_description as string,
      jobUrl: proposal.job_url as string | undefined,
      platform: proposal.platform as Platform,
      profile: profile ?? { display_name: null, bio: null, skills: [], hourly_rate_min: null, hourly_rate_max: null, portfolio_urls: [] },
      negativePrompt,
    };

    const agentFns: Record<string, () => Promise<string>> = {
      'industry-analyst': () => industryAnalyst(ctx),
      'pricing-estimator': () => pricingEstimator(ctx),
      'schedule-estimator': () => scheduleEstimator(ctx),
      'differentiator': () => differentiator(ctx),
    };

    let output: string;
    if (agent_name === 'copy-reviewer') {
      const { data: outputs } = await supabase.from('proposal_agents_output').select('*').eq('proposal_id', id).order('created_at', { ascending: false });
      type AgentRow = { agent_name: string; output_markdown: string };
      const get = (name: string) => (outputs as AgentRow[] | null)?.find((o) => o.agent_name === name)?.output_markdown ?? '';
      output = await copyReviewer({
        ctx, industry: get('industry-analyst'), pricing: get('pricing-estimator'),
        schedule: get('schedule-estimator'), differentiator: get('differentiator'),
        draft: (proposal.final_text as string) ?? '',
      });
      await supabase.from('proposals').update({ final_text: output }).eq('id', id);
    } else if (agentFns[agent_name]) {
      output = await agentFns[agent_name]();
    } else {
      return NextResponse.json({ error: 'Unknown agent' }, { status: 400 });
    }

    await supabase.from('proposal_agents_output').insert({ proposal_id: id, agent_name, output_markdown: output });
    return NextResponse.json({ output });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}