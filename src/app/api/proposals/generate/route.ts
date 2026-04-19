import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  industryAnalyst, pricingEstimator, scheduleEstimator, differentiator, copyReviewer,
} from '@/lib/gemini/agents';
import { mergeAgentOutputs } from '@/lib/gemini/merger';
import { buildNegativePrompt } from '@/lib/gemini/negative-prompt';
import { extractPrice, extractDays } from '@/lib/utils';
import type { Platform } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json() as {
      job_title: string; job_description: string; job_url?: string; platform: Platform;
    };
    const { job_title, job_description, job_url, platform } = body;
    if (!job_title || !job_description) {
      return NextResponse.json({ error: 'job_title and job_description are required' }, { status: 400 });
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile?.display_name && !profile?.bio && !profile?.skills?.length) {
      return NextResponse.json({ error: 'プロフィールを先に設定してください' }, { status: 400 });
    }

    const { data: proposal, error: insertErr } = await supabase
      .from('proposals')
      .insert({ user_id: user.id, job_title, job_description, job_url, platform, status: 'draft' })
      .select().single();
    if (insertErr || !proposal) return NextResponse.json({ error: 'Failed' }, { status: 500 });

    const negativePrompt = await buildNegativePrompt(user.id, supabase);
    const ctx = { jobTitle: job_title, jobDescription: job_description, jobUrl: job_url, platform, profile, negativePrompt };

    const [industryOut, pricingOut, scheduleOut, differentiatorOut] = await Promise.allSettled([
      industryAnalyst(ctx), pricingEstimator(ctx), scheduleEstimator(ctx), differentiator(ctx),
    ]);
    const get = (r: PromiseSettledResult<string>, fb: string) => r.status === 'fulfilled' ? r.value : fb;
    const industry = get(industryOut, '分析失敗');
    const pricing = get(pricingOut, '分析失敗');
    const schedule = get(scheduleOut, '分析失敗');
    const diff = get(differentiatorOut, '分析失敗');

    await Promise.all([
      supabase.from('proposal_agents_output').insert({ proposal_id: proposal.id, agent_name: 'industry-analyst', output_markdown: industry }),
      supabase.from('proposal_agents_output').insert({ proposal_id: proposal.id, agent_name: 'pricing-estimator', output_markdown: pricing }),
      supabase.from('proposal_agents_output').insert({ proposal_id: proposal.id, agent_name: 'schedule-estimator', output_markdown: schedule }),
      supabase.from('proposal_agents_output').insert({ proposal_id: proposal.id, agent_name: 'differentiator', output_markdown: diff }),
    ]);

    const draft = await mergeAgentOutputs({ jobTitle: job_title, jobDescription: job_description, industry, pricing, schedule, differentiator: diff });
    const reviewOut = await copyReviewer({ ctx, industry, pricing, schedule, differentiator: diff, draft }).catch(() => draft);
    await supabase.from('proposal_agents_output').insert({ proposal_id: proposal.id, agent_name: 'copy-reviewer', output_markdown: reviewOut });

    const proposedPrice = extractPrice(pricing);
    const proposedDays = extractDays(schedule);
    await supabase.from('proposals').update({
      final_text: reviewOut,
      ...(proposedPrice ? { proposed_price: proposedPrice } : {}),
      ...(proposedDays ? { proposed_deadline_days: proposedDays } : {}),
    }).eq('id', proposal.id);

    return NextResponse.json({ proposal_id: proposal.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}