import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { ProposalList } from '@/components/proposals/proposal-list';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">提案一覧</h1>
        <Link href="/new" aria-label="新規提案を作成">
          <Button>新規提案</Button>
        </Link>
      </div>
      <ProposalList proposals={proposals ?? []} />
    </div>
  );
}