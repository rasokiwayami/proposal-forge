'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { createClient } from '@/lib/supabase/client';

const PLATFORMS = [
  { value: 'crowdworks', label: 'CrowdWorks', color: 'oklch(72% 0.16 150)' },
  { value: 'lancers',    label: 'Lancers',    color: 'oklch(72% 0.12 235)' },
  { value: 'coconala',   label: 'Coconala',   color: 'oklch(72% 0.12 30)'  },
  { value: 'other',      label: 'その他',      color: 'var(--fg-3)'         },
] as const;

const schema = z.object({
  job_title: z.string().min(1, '案件タイトルは必須です'),
  job_description: z.string().min(10, '案件内容を入力してください'),
  job_url: z.string().optional(),
  platform: z.enum(['crowdworks', 'lancers', 'coconala', 'other']),
});

type FormData = z.infer<typeof schema>;

const AGENT_NAMES = [
  { id: 'A01', label: '業界アナリスト' },
  { id: 'A02', label: '価格エスティメーター' },
  { id: 'A03', label: '納期エスティメーター' },
  { id: 'A04', label: '差別化ストラテジスト' },
  { id: 'A05', label: 'コピーライター' },
];

function AgentsLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div className="terminal">
        <div className="terminal__head">
          <span style={{ color: 'var(--accent)' }}>◆</span> ProposalForge — Agent Pipeline
        </div>
        <div className="terminal__body">
          <div className="term-line">
            <span className="ts">00:00</span>
            <span className="ag">FORGE</span>
            <span className="msg">5エージェントを並列起動中...</span>
          </div>
          {AGENT_NAMES.map((a, i) => (
            <div key={a.id} className="term-line ok">
              <span className="ts">00:0{i}</span>
              <span className="ag">{a.id}</span>
              <span className="msg">{a.label} — 分析中</span>
            </div>
          ))}
          <div className="term-line">
            <span className="ag">›</span>
            <span className="caret" />
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)' }}>
        {AGENT_NAMES.map((a) => (
          <div key={a.id} className="agent-tile">
            <div className="agent-tile__top">
              <span className="agent-tile__id">{a.id}</span>
              <span className="agent-tile__name">{a.label}</span>
              <span className="agent-tile__status">
                <span className="dot" />running
              </span>
            </div>
            <div className="agent-tile__bar"><i /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProposalForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileMissing, setProfileMissing] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { job_title: '', job_description: '', job_url: '', platform: 'other' },
  });

  useEffect(() => {
    async function checkProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!profile?.display_name && !profile?.bio && !profile?.skills?.length) {
        setProfileMissing(true);
      }
    }
    checkProfile();
  }, []);

  async function onSubmit(values: FormData) {
    setLoading(true);
    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json() as { proposal_id?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? '生成失敗');
      toast.success('提案文を生成しました');
      router.push(`/proposals/${data.proposal_id}`);
    } catch (e) {
      toast.error((e as Error).message);
      setLoading(false);
    }
  }

  if (loading) return <AgentsLoading />;

  const platform = form.watch('platform');

  return (
    <div>
      {profileMissing && (
        <div style={{
          marginBottom: 'var(--sp-4)', padding: 'var(--sp-3) var(--sp-4)',
          background: 'var(--accent-soft)', border: '1px solid var(--accent-line)',
          borderRadius: 'var(--rd-md)', fontSize: 'var(--fs-13)', color: 'var(--fg-1)',
        }}>
          プロフィールが未設定です。
          <a href="/settings" style={{ color: 'var(--accent)', marginLeft: 4 }}>設定ページ</a>
          で情報を入力すると精度が上がります。
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div className="pf-field">
            <label className="pf-field__label">プラットフォーム</label>
            <div className="pf-segmented" role="group" aria-label="プラットフォームを選択">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={platform === p.value ? 'on' : ''}
                  onClick={() => form.setValue('platform', p.value)}
                  aria-pressed={platform === p.value}
                >
                  <i style={{ width: 6, height: 6, borderRadius: 2, background: p.color, display: 'inline-block', flexShrink: 0 }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="job_title"
            render={({ field }: { field: ControllerRenderProps<FormData, 'job_title'> }) => (
              <FormItem>
                <div className="pf-field">
                  <label htmlFor="job_title" className="pf-field__label">
                    案件タイトル <span className="req">*</span>
                  </label>
                  <FormControl>
                    <input id="job_title" className="pf-input" placeholder="例: Webアプリ開発" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="job_description"
            render={({ field }: { field: ControllerRenderProps<FormData, 'job_description'> }) => (
              <FormItem>
                <div className="pf-field">
                  <label htmlFor="job_description" className="pf-field__label">
                    案件内容 <span className="req">*</span>
                  </label>
                  <FormControl>
                    <textarea id="job_description" className="pf-textarea" placeholder="案件の詳細を貼り付けてください" rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="job_url"
            render={({ field }: { field: ControllerRenderProps<FormData, 'job_url'> }) => (
              <FormItem>
                <div className="pf-field">
                  <label htmlFor="job_url" className="pf-field__label">案件URL（任意）</label>
                  <FormControl>
                    <input id="job_url" className="pf-input" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <button type="submit" className="btn btn--primary" aria-label="提案文を生成する" style={{ width: '100%', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
            </svg>
            生成する
          </button>
        </form>
      </Form>
    </div>
  );
}
