import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProposalForge',
  description: 'AI-powered proposal generator for Japanese freelance platforms',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={geist.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}