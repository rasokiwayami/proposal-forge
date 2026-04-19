import { runAgent } from './client';

type MergerInput = {
  jobTitle: string;
  jobDescription: string;
  industry: string;
  pricing: string;
  schedule: string;
  differentiator: string;
};

export async function mergeAgentOutputs(input: MergerInput): Promise<string> {
  const system = `あなたは日本語フリーランス提案文ライターです。
以下の分析結果を統合し、500〜800字の提案文ドラフトをプレーンテキストで作成してください。
構成: 挨拶 → 要件理解 → アプローチ → 想定価格・納期 → 差別化 → クロージング`;

  const user = `案件: ${input.jobTitle}
内容: ${input.jobDescription}

業界分析:
${input.industry}

価格見積もり:
${input.pricing}

スケジュール:
${input.schedule}

差別化:
${input.differentiator}`;

  return runAgent('flash', system, user);
}