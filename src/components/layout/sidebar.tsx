'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogoMark } from './logo';
import type { Profile } from '@/types/database';
import type { User } from '@supabase/supabase-js';

type Props = { profile: Profile | null; user: User };

export function Sidebar({ profile, user }: Props) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  function toggleTheme(t: 'dark' | 'light') {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }

  const initials = (profile?.display_name ?? user.email ?? '?')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__brand">
        <LogoMark size={18} animated />
        <span className="wm">Proposal<em>Forge</em></span>
      </div>

      <div className="app-sidebar__group">
        <div className="app-sidebar__label">Workspace</div>
        <Link
          href="/"
          aria-label="提案一覧"
          className={`app-nav-item${pathname === '/' ? ' is-active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>
          </svg>
          提案一覧
        </Link>
        <Link
          href="/new"
          aria-label="新規提案"
          className={`app-nav-item${pathname === '/new' ? ' is-active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          新規提案
          <span className="kbd-hint">N</span>
        </Link>
      </div>

      <div className="app-sidebar__footer">
        <Link
          href="/settings"
          aria-label="設定"
          className={`app-nav-item${pathname === '/settings' ? ' is-active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9"/>
          </svg>
          設定
        </Link>

        <div className="pf-theme-toggle" role="group" aria-label="テーマ切替">
          <button
            onClick={() => toggleTheme('dark')}
            className={theme === 'dark' ? 'on' : ''}
            aria-label="ダークモード"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>
            </svg>
            Dark
          </button>
          <button
            onClick={() => toggleTheme('light')}
            className={theme === 'light' ? 'on' : ''}
            aria-label="ライトモード"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>
            </svg>
            Light
          </button>
        </div>

        <div className="pf-user-card">
          <div className="av" aria-hidden="true">{initials}</div>
          <div className="meta">
            <strong>{profile?.display_name ?? user.email?.split('@')[0] ?? 'User'}</strong>
            <span>freelancer</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
