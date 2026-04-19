'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import type { Profile } from '@/types/database';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Props = { profile: Profile | null; user: SupabaseUser };

export function UserMenu({ profile, user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <div className="p-3 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent text-sm" aria-label="ユーザーメニュー">
          <User size={16} />
          <span className="truncate">{profile?.display_name ?? user.email}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={handleLogout} disabled={loading} aria-label="ログアウト">
            <LogOut size={14} className="mr-2" />
            {loading ? 'ログアウト中...' : 'ログアウト'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}