'use client';
import { useForm, useFieldArray, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2 } from 'lucide-react';
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
      <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-5">
        <FormField
          control={form.control as never}
          name="display_name"
          render={({ field }: { field: ControllerRenderProps<FormData, 'display_name'> }) => (
            <FormItem>
              <FormLabel>表示名 *</FormLabel>
              <FormControl><Input id="display_name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as never}
          name="bio"
          render={({ field }: { field: ControllerRenderProps<FormData, 'bio'> }) => (
            <FormItem>
              <FormLabel>自己紹介</FormLabel>
              <FormControl><Textarea id="bio" rows={4} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as never}
          name="skills_raw"
          render={({ field }: { field: ControllerRenderProps<FormData, 'skills_raw'> }) => (
            <FormItem>
              <FormLabel>スキル（カンマ区切り）</FormLabel>
              <FormControl><Input id="skills_raw" placeholder="React, TypeScript, Next.js" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control as never}
            name="hourly_rate_min"
            render={({ field }: { field: ControllerRenderProps<FormData, 'hourly_rate_min'> }) => (
              <FormItem>
                <FormLabel>時給 最小(円)</FormLabel>
                <FormControl><Input id="hourly_rate_min" type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as never}
            name="hourly_rate_max"
            render={({ field }: { field: ControllerRenderProps<FormData, 'hourly_rate_max'> }) => (
              <FormItem>
                <FormLabel>時給 最大(円)</FormLabel>
                <FormControl><Input id="hourly_rate_max" type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <FormLabel>ポートフォリオ</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ label: '', url: '' })} aria-label="ポートフォリオを追加">
              <PlusCircle size={14} className="mr-1" />追加
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <Input placeholder="ラベル" {...form.register(`portfolio_urls.${index}.label`)} aria-label={`ポートフォリオ${index + 1}のラベル`} />
              <Input placeholder="https://..." {...form.register(`portfolio_urls.${index}.url`)} aria-label={`ポートフォリオ${index + 1}のURL`} />
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} aria-label={`ポートフォリオ${index + 1}を削除`}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" aria-label="プロフィールを保存">保存</Button>
      </form>
    </Form>
  );
}