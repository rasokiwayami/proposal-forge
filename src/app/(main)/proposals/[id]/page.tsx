import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AgentOutputTabs } from '@/components/proposals/agent-output-tabs';
import { StatusSwitcher } from '@/components/proposals/status-switcher';
import { PLATFORM_LABELS } from '@/lib/platforms';
import { Badge } from '@/components/ui/badge';
import type { Platform } from '@/types/database';

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: proposal } = await supabase
    .from('proposals').select('*').eq('id', id).eq('user_id', user!.id).single();
  if (!proposal) notFound();

  const { data: agentOutputs } = await supabase
    .from('proposal_agents_output').select('*').eq('proposal_id', id).order('created_at', { ascending: true });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold flex-1">{proposal.job_title as string}</h1>
        <Badge variant="outline">{PLATFORM_LABELS[proposal.platform as Platform]}</Badge>
        <StatusSwitcher proposalId={id} currentStatus={proposal.status as string} />
      </div>
      <AgentOutputTabs proposal={proposal} agentOutputs={agentOutputs ?? []} />
    </div>
  );
}