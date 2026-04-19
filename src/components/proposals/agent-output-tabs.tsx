'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FinalProposalEditor } from './final-proposal-editor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { renderMarkdown } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import type { Platform } from '@/types/database';

type AgentOutput = { id: string; agent_name: string; output_markdown: string; created_at: string };
type ProposalRow = Record<string, unknown>;

function MarkdownPane({ content }: { content: string }) {
  return (
    <ScrollArea className="h-96">
      <div
        className="prose prose-sm max-w-none p-1"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    </ScrollArea>
  );
}

function getLatest(outputs: AgentOutput[], name: string) {
  return [...outputs].reverse().find((o) => o.agent_name === name)?.output_markdown ?? '（まだ生成されていません）';
}

type Props = { proposal: ProposalRow; agentOutputs: AgentOutput[] };

export function AgentOutputTabs({ proposal, agentOutputs }: Props) {
  const router = useRouter();
  const [price, setPrice] = useState(String(proposal.proposed_price ?? ''));
  const [days, setDays] = useState(String(proposal.proposed_deadline_days ?? ''));
  const [refining, setRefining] = useState(false);

  async function handleReReview() {
    setRefining(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id as string}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_name: 'copy-reviewer' }),
      });
      if (!res.ok) throw new Error('再レビュー失敗');
      toast.success('再レビュー完了');
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setRefining(false);
    }
  }

  async function saveField(field: string, value: string) {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    const res = await fetch(`/api/proposals/${proposal.id as string}/refine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_name: 'noop', [field]: num }),
    });
    if (!res.ok) {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.from('proposals').update({ [field]: num }).eq('id', proposal.id as string);
    }
  }

  const history = [...agentOutputs].reverse();

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button onClick={handleReReview} disabled={refining} size="sm" aria-label="再レビューを実行">
          <RefreshCw size={14} className={`mr-1 ${refining ? 'animate-spin' : ''}`} />
          再レビュー
        </Button>
      </div>
      <Tabs defaultValue="final">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="final">最終提案文</TabsTrigger>
          <TabsTrigger value="industry">業界分析</TabsTrigger>
          <TabsTrigger value="price">価格</TabsTrigger>
          <TabsTrigger value="schedule">納期</TabsTrigger>
          <TabsTrigger value="diff">差別化</TabsTrigger>
          <TabsTrigger value="history">履歴</TabsTrigger>
        </TabsList>

        <TabsContent value="final" className="mt-4">
          <FinalProposalEditor
            proposalId={proposal.id as string}
            initialText={(proposal.final_text as string) ?? ''}
            platform={proposal.platform as Platform}
          />
        </TabsContent>

        <TabsContent value="industry" className="mt-4">
          <MarkdownPane content={getLatest(agentOutputs, 'industry-analyst')} />
        </TabsContent>

        <TabsContent value="price" className="mt-4 space-y-3">
          <MarkdownPane content={getLatest(agentOutputs, 'pricing-estimator')} />
          <div className="flex items-center gap-2">
            <label htmlFor="proposed_price" className="text-sm whitespace-nowrap">提案価格(円)</label>
            <Input
              id="proposed_price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={() => saveField('proposed_price', price)}
              className="max-w-40"
              aria-label="提案価格"
            />
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-4 space-y-3">
          <MarkdownPane content={getLatest(agentOutputs, 'schedule-estimator')} />
          <div className="flex items-center gap-2">
            <label htmlFor="proposed_days" className="text-sm whitespace-nowrap">提案納期(日)</label>
            <Input
              id="proposed_days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              onBlur={() => saveField('proposed_deadline_days', days)}
              className="max-w-32"
              aria-label="提案納期日数"
            />
          </div>
        </TabsContent>

        <TabsContent value="diff" className="mt-4">
          <MarkdownPane content={getLatest(agentOutputs, 'differentiator')} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <ScrollArea className="h-[32rem]">
            <div className="space-y-3">
              {history.map((o) => (
                <div key={o.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{o.agent_name}</span>
                    <span>{new Date(o.created_at).toLocaleString('ja-JP')}</span>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(o.output_markdown) }} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}