import type { Platform } from '@/types/database';

export function formatForPlatform(text: string, platform: Platform): string {
  switch (platform) {
    case 'crowdworks':
      return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/#+\s/g, '').trim() +
        '\n\nポートフォリオ・実績の詳細はURLをご確認ください。';
    case 'lancers':
      return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/#+\s/g, '').trim() +
        '\n\n---\nどうぞよろしくお願いいたします。';
    case 'coconala':
      return text
        .split('\n')
        .map((line) => (line.trim() && !line.startsWith('・') && !line.startsWith('-') ? '・' + line : line))
        .join('\n')
        .trim();
    case 'other':
    default:
      return text;
  }
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  crowdworks: 'CrowdWorks',
  lancers: 'Lancers',
  coconala: 'coconala',
  other: 'その他',
};