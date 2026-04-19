'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ForgeAnvil, LogoMark } from '@/components/layout/logo';
import { toast } from 'sonner';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      toast.error('ログインに失敗しました: ' + error.message);
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-0)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 60%, oklch(72% 0.12 74 / .10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--sp-8)',
        width: '100%',
        maxWidth: 480,
        padding: 'var(--sp-8)',
      }}>
        <ForgeAnvil size={280} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <LogoMark size={28} animated />
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: 'var(--fs-20)',
            letterSpacing: '-0.02em',
            color: 'var(--fg-0)',
          }}>
            Proposal<em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>Forge</em>
          </span>
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-12)',
          color: 'var(--fg-3)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          AI で提案文を自動生成
        </p>

        <div style={{
          width: '100%',
          background: 'var(--bg-1)',
          border: '1px solid var(--line-1)',
          borderRadius: 'var(--rd-xl)',
          padding: 'var(--sp-6)',
          boxShadow: 'var(--shadow-2)',
        }}>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn--ghost"
            aria-label="Googleでログイン"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: 'var(--fs-14)' }}
          >
            {!loading && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 12c0-.67-.06-1.32-.17-1.94H12v3.68h5.04c-.22 1.17-.87 2.16-1.86 2.83v2.34h3c1.75-1.61 2.82-3.98 2.82-6.91z" fill="#4285F4"/>
                <path d="M12 21c2.52 0 4.64-.83 6.18-2.27l-3-2.34c-.83.56-1.89.89-3.18.89-2.44 0-4.51-1.65-5.25-3.87H3.64v2.43A9 9 0 0 0 12 21z" fill="#34A853"/>
                <path d="M6.75 13.41A5.4 5.4 0 0 1 6.46 12c0-.49.08-.96.22-1.41V8.16H3.64A9 9 0 0 0 3 12c0 1.46.35 2.83.96 4.05l2.79-2.17z" fill="#FBBC04"/>
                <path d="M12 6.58c1.37 0 2.6.47 3.57 1.4l2.66-2.66C16.64 3.87 14.52 3 12 3 8.16 3 4.9 5.21 3.64 8.16l3.11 2.43C7.49 8.33 9.56 6.58 12 6.58z" fill="#EA4335"/>
              </svg>
            )}
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                ログイン中...
              </span>
            ) : 'Googleでログイン'}
          </button>
        </div>
      </div>
    </div>
  );
}
