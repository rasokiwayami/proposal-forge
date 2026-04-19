import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ja });
}

export function extractPrice(text: string): number | null {
  const m = text.match(/([0-9,]+)\s*円/);
  if (!m) return null;
  return parseInt(m[1].replace(/,/g, ''), 10);
}

export function extractDays(text: string): number | null {
  const m = text.match(/([0-9]+)\s*日/);
  return m ? parseInt(m[1], 10) : null;
}

export function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="font-semibold text-base mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-bold text-lg mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-bold text-xl mt-6 mb-2">$1</h1>')
    .replace(/^[-*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
}