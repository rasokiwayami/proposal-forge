'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type ControllerRenderProps, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  job_title: z.string().min(1, '案件タイトルは必須です'),
  job_description: z.string().min(10, '案件内容を入力してください'),
  job_url: z.string().optional(),
  platform: z.enum(['crowdworks', 'lancers', 'coconala', 'other']),
});

type FormData = z.infer<typeof schema>;

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
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm animate-pulse">5体のエージェントが分析中...</p>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {profileMissing && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          プロフィールが未設定です。<a href="/settings" className="underline ml-1">設定ページ</a>で情報を入力すると精度が上がります。
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }: { field: ControllerRenderProps<FormData, 'job_title'> }) => (
              <FormItem>
                <FormLabel>案件タイトル *</FormLabel>
                <FormControl>
                  <Input id="job_title" placeholder="例: Webアプリ開発" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="job_description"
            render={({ field }: { field: ControllerRenderProps<FormData, 'job_description'> }) => (
              <FormItem>
                <FormLabel>案件内容 *</FormLabel>
                <FormControl>
                  <Textarea id="job_description" placeholder="案件の詳細を貼り付けてください" rows={8} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="job_url"
            render={({ field }: { field: ControllerRenderProps<FormData, 'job_url'> }) => (
              <FormItem>
                <FormLabel>案件URL（任意）</FormLabel>
                <FormControl>
                  <Input id="job_url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="platform"
            render={({ field }: { field: ControllerRenderProps<FormData, 'platform'> }) => (
              <FormItem>
                <FormLabel>プラットフォーム</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="platform" aria-label="プラットフォームを選択">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="crowdworks">CrowdWorks</SelectItem>
                    <SelectItem value="lancers">Lancers</SelectItem>
                    <SelectItem value="coconala">coconala</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" aria-label="提案文を生成する">生成する</Button>
        </form>
      </Form>
    </div>
  );
}