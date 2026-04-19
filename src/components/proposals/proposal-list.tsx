'use client';
import Link from 'next/link';
import { formatRelativeDate } from '@/lib/utils';
import { PLATFORM_LABELS } from '@/lib/platforms';
import type { Proposal, Platform, ProposalStatus } from '@/types/database';

const STATUS_CLASS: Record<ProposalStatus, string> = {
  draft: 'pf-badge--draft',
  submitted: 'pf-badge--submit',
  won: 'pf-badge--won',
  lost: 'pf-badge--lost',
};

const STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: '下書き',
  submitted: '提出済',
  won: '受注',
  lost: '不採用',
};

const PLATFORM_COLORS: Record<string, string> = {
  crowdworks: 'oklch(72% 0.16 150)',
  lancers: 'oklch(72% 0.12 235)',
  coconala: 'oklch(72% 0.12 30)',
  other: 'var(--fg-3)',
};

type Props = { proposals: Proposal[] };

export function ProposalList({ proposals }: Props) {
  if (!proposals.length) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--sp-16) var(--sp-6)', color: 'var(--fg-3)' }}>
        <p style={{ fontSize: 'var(--fs-16)', marginBottom: 'var(--sp-2)', color: 'var(--fg-2)' }}>まだ提案がありません</p>
        <p style={{ fontSize: 'var(--fs-13)', fontFamily: 'var(--font-mono)' }}>「新規提案」から最初の提案を作成しましょう</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      {proposals.map((p) => (
        <Link key={p.id} href={`/proposals/${p.id}`} aria-label={`提案: ${p.job_title}`} style={{ textDecoration: 'none' }}>
          <div className="proposal-card">
            <div>
              <div className="proposal-card__title">{p.job_title}</div>
              <div className="proposal-card__meta">
                <span className="chip-pf">
                  <i className="d" style={{ background: PLATFORM_COLORS[p.platform] ?? 'var(--fg-3)' }} />
                  {PLATFORM_LABELS[p.platform as Platform]}
                </span>
                <span className={`pf-badge ${STATUS_CLASS[p.status as ProposalStatus]}`}>
                  {STATUS_LABELS[p.status as ProposalStatus]}
                </span>
              </div>
            </div>
            <div className="proposal-card__right">
              {p.proposed_price ? (
                <span className="proposal-card__price">
                  <span className="yen">¥</span>{p.proposed_price.toLocaleString()}
                </span>
              ) : null}
              <span>{formatRelativeDate(p.created_at)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
