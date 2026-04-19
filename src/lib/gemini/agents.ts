import { runAgent } from './client';
import type { Profile, Platform } from '@/types/database';

type AgentContext = {
  jobTitle: string;
  jobDescription: string;
  jobUrl?: string;
  platform: Platform;
  profile: Pick<Profile, 'display_name' | 'bio' | 'skills' | 'hourly_rate_min' | 'hourly_rate_max' | 'portfolio_urls'>;
  negativePrompt?: string;
};

function profileSummary(ctx: AgentContext): string {
  return `フリーランサー情報:
名前: ${ctx.profile.display_name ?? '未設定'}
スキル: ${ctx.profile.skills.join(', ')}
時給レンジ: ${ctx.profile.hourly_rate_min ?? '?'}〜${ctx.profile.hourly_rate_max ?? '?'}円
ポートフォリオ: ${ctx.profile.portfolio_urls.map((p) => p.label + ' ' + p.url).join(', ') || 'なし'}
自己紹介: ${ctx.profile.bio ?? 'なし'}`;
}

function jobSummary(ctx: AgentContext): string {
  return `案件タイトル: ${ctx.jobTitle}
プラットフォーム: ${ctx.platform}
案件内容: ${ctx.jobDescription}
${ctx.jobUrl ? 'URL: ' + ctx.jobUrl : ''}`;
}

export async function industryAnalyst(ctx: AgentContext): Promise<string> {
  const system = `あなたは日本のフリーランス市場の業界アナリストです。
与えられた案件を分析し、以下をMarkdownで出力してください:
- 業界分類・ドメイン特性
- この案件で注意すべきポイント3〜5個
出力は日本語で簡潔に。`;
  return runAgent('flash', system, jobSummary(ctx));
}

export async function pricingEstimator(ctx: AgentContext): Promise<string> {
  const system = `あなたは日本のフリーランス案件の価格見積もり専門家です。
以下をMarkdownで出力してください:
- 作業の分解
- 市場相場感
- 推奨価格(円)と根拠
フリーランサーの時給レンジ情報も考慮すること。`;
  return runAgent('flash', system, jobSummary(ctx) + '\n\n' + profileSummary(ctx));
}

export async function scheduleEstimator(ctx: AgentContext): Promise<string> {
  const system = `あなたはフリーランス案件のスケジュール見積もり専門家です。
以下をMarkdownで出力してください:
- 工数の分解
- 合計工数
- 推奨納期日数
- リスク要因`;
  return runAgent('flash', system, jobSummary(ctx));
}

export async function differentiator(ctx: AgentContext): Promise<string> {
  const system = `あなたは提案の差別化戦略専門家です。
フリーランサーのポートフォリオとスキルから、この案件に最も刺さる実績・強みを1〜3個選定し、
選定理由とアピール文言をMarkdownで出力してください。`;
  return runAgent('flash', system, jobSummary(ctx) + '\n\n' + profileSummary(ctx));
}

type ReviewerInput = {
  ctx: AgentContext;
  industry: string;
  pricing: string;
  schedule: string;
  differentiator: string;
  draft: string;
};

export async function copyReviewer(input: ReviewerInput): Promise<string> {
  const system = `あなたは日本語のフリーランス提案文の校閲専門家です。
以下の観点でレビューし、改善した最終提案文(500〜800字)と変更点サマリをMarkdownで出力してください:
- 日本語の自然さ
- 具体性
- プラットフォーム規約違反チェック
- 掴み(冒頭)の訴求力
- クロージング
- 重複表現の回避
${input.ctx.negativePrompt ? '\n' + input.ctx.negativePrompt : ''}`;

  const user = `## 案件情報
${jobSummary(input.ctx)}

## 業界分析
${input.industry}

## 価格見積もり
${input.pricing}

## スケジュール見積もり
${input.schedule}

## 差別化ポイント
${input.differentiator}

## マージャードラフト
${input.draft}`;

  return runAgent('pro', system, user);
}