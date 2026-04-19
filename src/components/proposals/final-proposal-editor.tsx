'use client';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ExportDialog } from './export-dialog';
import { Copy } from 'lucide-react';
import type { Platform } from '@/types/database';

type Props = { proposalId: string; initialText: string; platform: Platform };

export function FinalProposalEditor({ proposalId, initialText, platform }: Props) {
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (text === initialText) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      const supabase = createClient();
      await supabase.from('proposals').update({ final_text: text }).eq('id', proposalId);
      setSaving(false);
    }, 1000);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [text, proposalId, initialText]);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    toast.success('コピーしました');
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 justify-end">
        {saving && <span className="text-xs text-muted-foreground">保存中...</span>}
        <Button variant="outline" size="sm" onClick={handleCopy} aria-label="テキストをコピー">
          <Copy size={14} className="mr-1" />
          コピー
        </Button>
        <ExportDialog proposalId={proposalId} defaultPlatform={platform} />
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={20}
        className="font-mono text-sm"
        aria-label="最終提案文"
      />
    </div>
  );
}