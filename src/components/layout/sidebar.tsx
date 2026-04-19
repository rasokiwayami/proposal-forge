'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Settings } from 'lucide-react';
import { UserMenu } from './user-menu';
import type { Profile } from '@/types/database';
import type { User } from '@supabase/supabase-js';

type Props = { profile: Profile | null; user: User };

export function Sidebar({ profile, user }: Props) {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'ホーム', icon: Home },
    { href: '/new', label: '新規提案', icon: PlusCircle },
    { href: '/settings', label: '設定', icon: Settings },
  ];

  return (
    <aside className="w-56 border-r flex flex-col h-screen bg-card">
      <div className="p-4 border-b">
        <span className="font-bold text-lg">ProposalForge</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
      <UserMenu profile={profile} user={user} />
    </aside>
  );
}