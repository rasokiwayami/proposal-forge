'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProposalStatus } from '@/types/database';

const STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: '下書き',
  submitted: '提出済',
  won: '受注',
  lost: '不採用',
};

type Props = { proposalId: string; currentStatus: string };

export function StatusSwitcher({ proposalId, currentStatus }: Props) {
  const [status, setStatus] = useState<ProposalStatus>(currentStatus as ProposalStatus);

  async function handleChange(value: ProposalStatus | null) {
    if (!value) return;
    const supabase = createClient();
    const { error } = await supabase.from('proposals').update({ status: value }).eq('id', proposalId);
    if (error) {
      toast.error('ステータス更新に失敗しました');
    } else {
      setStatus(value);
      toast.success('ステータスを更新しました');
    }
  }

  return (
    <Select value={status} onValueChange={handleChange as (value: ProposalStatus | null) => void}>
      <SelectTrigger className="w-32" aria-label="ステータスを変更">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(STATUS_LABELS) as ProposalStatus[]).map((s) => (
          <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}