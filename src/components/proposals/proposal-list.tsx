'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate } from '@/lib/utils';
import { PLATFORM_LABELS } from '@/lib/platforms';
import type { Proposal, Platform, ProposalStatus } from '@/types/database';

const STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: '下書き',
  submitted: '提出済',
  won: '受注',
  lost: '不採用',
};

const STATUS_VARIANTS: Record<ProposalStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  draft: 'secondary',
  submitted: 'default',
  won: 'outline',
  lost: 'destructive',
};

type Props = { proposals: Proposal[] };

export function ProposalList({ proposals }: Props) {
  if (!proposals.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg mb-2">まだ提案がありません</p>
        <p className="text-sm">「新規提案」から最初の提案を作成しましょう</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {proposals.map((p) => (
        <Link key={p.id} href={`/proposals/${p.id}`} aria-label={`提案: ${p.job_title}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{p.job_title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{PLATFORM_LABELS[p.platform as Platform]}</Badge>
              <Badge variant={STATUS_VARIANTS[p.status as ProposalStatus]}>
                {STATUS_LABELS[p.status as ProposalStatus]}
              </Badge>
              {p.proposed_price && (
                <span className="text-sm text-muted-foreground">
                  ¥{p.proposed_price.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {formatRelativeDate(p.created_at)}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}