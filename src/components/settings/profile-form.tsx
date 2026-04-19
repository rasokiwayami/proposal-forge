'use client';
import { useForm, useFieldArray, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import type { Profile } from '@/types/database';

const schema = z.object({
  display_name: z.string().min(1, '表示名は必須です'),
  bio: z.string().optional(),
  skills_raw: z.string().optional(),
  hourly_rate_min: z.string().optional(),
  hourly_rate_max: z.string().optional(),
  portfolio_urls: z.array(z.object({ label: z.string(), url: z.string() })),
});

type FormData = {
  display_name: string;
  bio?: string;
  skills_raw?: string;
  hourly_rate_min?: string;
  hourly_rate_max?: string;
  portfolio_urls: { label: string; url: string }[];
};

type Props = { initialProfile: Profile | null };

export function ProfileForm({ initialProfile }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      display_name: initialProfile?.display_name ?? '',
      bio: initialProfile?.bio ?? '',
      skills_raw: initialProfile?.skills?.join(', ') ?? '',
      hourly_rate_min: String(initialProfile?.hourly_rate_min ?? ''),
      hourly_rate_max: String(initialProfile?.hourly_rate_max ?? ''),
      portfolio_urls: (initialProfile?.portfolio_urls as { label: string; url: string }[]) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'portfolio_urls' });

  async function onSubmit(values: FormData) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未ログイン');

      const skills = values.skills_raw
        ? values.skills_raw.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        display_name: values.display_name,
        bio: values.bio ?? null,
        skills,
        hourly_rate_min: values.hourly_rate_min ? parseInt(values.hourly_rate_min, 10) : null,
        hourly_rate_max: values.hourly_rate_max ? parseInt(values.hourly_rate_max, 10) : null,
        portfolio_urls: values.portfolio_urls,
      });

      if (error) throw error;
      toast.success('プロフィールを保存しました');
    } catch (e) {
      toast.error('保存に失敗しました: ' + (e as Error).message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as never)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>

        <FormField
          control={form.control as never}
          name="display_name"
          render={({ field }: { field: ControllerRenderProps<FormData, 'display_name'> }) => (
            <FormItem>
              <div className="pf-field">
                <label htmlFor="display_name" className="pf-field__label">
                  表示名 <span className="req">*</span>
                </label>
                <FormControl>
                  <input id="display_name" className="pf-input" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name="bio"
          render={({ field }: { field: ControllerRenderProps<FormData, 'bio'> }) => (
            <FormItem>
              <div className="pf-field">
                <label htmlFor="bio" className="pf-field__label">自己紹介</label>
                <FormControl>
                  <textarea id="bio" className="pf-textarea" rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control as never}
          name="skills_raw"
          render={({ field }: { field: ControllerRenderProps<FormData, 'skills_raw'> }) => (
            <FormItem>
              <div className="pf-field">
                <label htmlFor="skills_raw" className="pf-field__label">スキル</label>
                <FormControl>
                  <input id="skills_raw" className="pf-input" placeholder="React, TypeScript, Next.js" {...field} />
                </FormControl>
                <span className="pf-field__hint">カンマ区切りで入力</span>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
          <FormField
            control={form.control as never}
            name="hourly_rate_min"
            render={({ field }: { field: ControllerRenderProps<FormData, 'hourly_rate_min'> }) => (
              <FormItem>
                <div className="pf-field">
                  <label htmlFor="hourly_rate_min" className="pf-field__label">時給 最小（円）</label>
                  <FormControl>
                    <input id="hourly_rate_min" type="number" className="pf-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control as never}
            name="hourly_rate_max"
            render={({ field }: { field: ControllerRenderProps<FormData, 'hourly_rate_max'> }) => (
              <FormItem>
                <div className="pf-field">
                  <label htmlFor="hourly_rate_max" className="pf-field__label">時給 最大（円）</label>
                  <FormControl>
                    <input id="hourly_rate_max" type="number" className="pf-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
            <span className="pf-field__label">ポートフォリオ</span>
            <button
              type="button"
              className="btn btn--subtle btn--sm"
              onClick={() => append({ label: '', url: '' })}
              aria-label="ポートフォリオを追加"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              追加
            </button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
              <input
                className="pf-input"
                placeholder="ラベル"
                {...form.register(`portfolio_urls.${index}.label`)}
                aria-label={`ポートフォリオ${index + 1}のラベル`}
              />
              <input
                className="pf-input"
                placeholder="https://..."
                {...form.register(`portfolio_urls.${index}.url`)}
                aria-label={`ポートフォリオ${index + 1}のURL`}
              />
              <button
                type="button"
                className="btn btn--ghost btn--icon"
                onClick={() => remove(index)}
                aria-label={`ポートフォリオ${index + 1}を削除`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn--primary" aria-label="プロフィールを保存" style={{ width: '100%', justifyContent: 'center' }}>
          保存
        </button>
      </form>
    </Form>
  );
}
