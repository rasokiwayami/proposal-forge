'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy } from 'lucide-react';
import type { Platform } from '@/types/database';

const PLATFORM_LABELS: Record<Platform, string> = {
  crowdworks: 'CrowdWorks',
  lancers: 'Lancers',
  coconala: 'coconala',
  other: 'その他',
};

type Props = { proposalId: string; defaultPlatform: Platform };

export function ExportDialog({ proposalId, defaultPlatform }: Props) {
  const [platform, setPlatform] = useState<Platform>(defaultPlatform);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchPreview(p: Platform) {
    setLoading(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: p }),
      });
      const data = await res.json() as { text?: string };
      setPreview(data.text ?? '');
    } catch {
      toast.error('プレビュー取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(preview);
    toast.success('コピーしました');
  }

  return (
    <Dialog onOpenChange={(open) => { if (open) fetchPreview(platform); }}>
      <DialogTrigger>
        <Button variant="outline" size="sm" aria-label="エクスポート" className="gap-1">
          <Download size={14} />
          エクスポート
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>エクスポート</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Select value={platform} onValueChange={(v) => { const p = v as Platform; setPlatform(p); fetchPreview(p); }}>
            <SelectTrigger aria-label="プラットフォームを選択">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => (
                <SelectItem key={p} value={p}>{PLATFORM_LABELS[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loading ? (
            <div className="h-48 animate-pulse bg-muted rounded" />
          ) : (
            <Textarea value={preview} readOnly rows={12} className="font-mono text-sm" />
          )}
          <Button onClick={handleCopy} className="w-full" aria-label="クリップボードにコピー">
            <Copy size={14} className="mr-1" />コピー
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}