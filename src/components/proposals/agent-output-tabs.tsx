'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FinalProposalEditor } from './final-proposal-editor';
import { renderMarkdown } from '@/lib/utils';
import type { Platform } from '@/types/database';

type AgentOutput = { id: string; agent_name: string; output_markdown: string; created_at: string };
type ProposalRow = Record<string, unknown>;

const TABS = [
  { id: 'final',    label: '最終提案文' },
  { id: 'industry', label: '業界分析' },
  { id: 'price',    label: '価格' },
  { id: 'schedule', label: '納期' },
  { id: 'diff',     label: '差別化' },
  { id: 'history',  label: '履歴' },
] as const;

type TabId = typeof TABS[number]['id'];

function MarkdownPane({ content }: { content: string }) {
  return (
    <div
      className="pf-md"
      style={{ padding: 'var(--sp-4) 0', maxHeight: '24rem', overflowY: 'auto' }}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}

function getLatest(outputs: AgentOutput[], name: string) {
  return [...outputs].reverse().find((o) => o.agent_name === name)?.output_markdown ?? '（まだ生成されていません）';
}

type Props = { proposal: ProposalRow; agentOutputs: AgentOutput[] };

export function AgentOutputTabs({ proposal, agentOutputs }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('final');
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--sp-3)' }}>
        <button onClick={handleReReview} disabled={refining} className="btn btn--ghost btn--sm" aria-label="再レビューを実行">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={refining ? { animation: 'spin 1s linear infinite' } : {}}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          再レビュー
        </button>
      </div>

      <div className="pf-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`pf-tab${activeTab === t.id ? ' is-active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ paddingTop: 'var(--sp-4)' }}>
        {activeTab === 'final' && (
          <FinalProposalEditor
            proposalId={proposal.id as string}
            initialText={(proposal.final_text as string) ?? ''}
            platform={proposal.platform as Platform}
          />
        )}
        {activeTab === 'industry' && (
          <MarkdownPane content={getLatest(agentOutputs, 'industry-analyst')} />
        )}
        {activeTab === 'price' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <MarkdownPane content={getLatest(agentOutputs, 'pricing-estimator')} />
            <div className="pf-field" style={{ maxWidth: 280 }}>
              <label htmlFor="proposed_price" className="pf-field__label">提案価格（円）</label>
              <input
                id="proposed_price"
                type="number"
                className="pf-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={() => saveField('proposed_price', price)}
                aria-label="提案価格"
              />
            </div>
          </div>
        )}
        {activeTab === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <MarkdownPane content={getLatest(agentOutputs, 'schedule-estimator')} />
            <div className="pf-field" style={{ maxWidth: 200 }}>
              <label htmlFor="proposed_days" className="pf-field__label">提案納期（日）</label>
              <input
                id="proposed_days"
                type="number"
                className="pf-input"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                onBlur={() => saveField('proposed_deadline_days', days)}
                aria-label="提案納期日数"
              />
            </div>
          </div>
        )}
        {activeTab === 'diff' && (
          <MarkdownPane content={getLatest(agentOutputs, 'differentiator')} />
        )}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', maxHeight: '32rem', overflowY: 'auto' }}>
            {history.map((o) => (
              <div key={o.id} style={{
                border: '1px solid var(--line-1)', borderRadius: 'var(--rd-md)',
                padding: 'var(--sp-3)', background: 'var(--bg-1)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-11)', color: 'var(--fg-3)' }}>
                  <span style={{ color: 'var(--accent)' }}>{o.agent_name}</span>
                  <span>{new Date(o.created_at).toLocaleString('ja-JP')}</span>
                </div>
                <div className="pf-md" dangerouslySetInnerHTML={{ __html: renderMarkdown(o.output_markdown) }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
