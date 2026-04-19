import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProposalList } from '@/components/proposals/proposal-list';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  const total = proposals?.length ?? 0;
  const won = proposals?.filter((p) => p.status === 'won').length ?? 0;
  const submitted = proposals?.filter((p) => p.status === 'submitted').length ?? 0;
  const winRate = submitted + won > 0 ? Math.round((won / (submitted + won)) * 100) : 0;

  const kpis = [
    { label: 'TOTAL', value: total, sub: '件' },
    { label: 'SUBMITTED', value: submitted, sub: '件' },
    { label: 'WON', value: won, sub: '件', accent: true },
    { label: 'WIN RATE', value: `${winRate}`, sub: '%' },
  ];

  return (
    <div>
      <div className="page__head">
        <div>
          <div className="page__crumbs">
            <span>workspace</span>
            <span>/</span>
            <em>proposals</em>
          </div>
          <h1 className="page__title">提案一覧</h1>
        </div>
        <div className="page__actions">
          <Link href="/new" aria-label="新規提案を作成" className="btn btn--primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            新規提案
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-card__label">{k.label}</div>
            <div className="kpi-card__value" style={k.accent ? { color: 'var(--accent)' } : {}}>
              {k.value}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--fg-3)', marginLeft: 2 }}>{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <ProposalList proposals={proposals ?? []} />
    </div>
  );
}
