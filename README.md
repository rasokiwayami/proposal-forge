# ProposalForge

AI-powered proposal generator for Japanese freelance platforms. This is a
standalone Proposal Forge product; its Gemini pipeline is not the Jinsei Global
role model.

## 動機

フリーランス案件への提案文作成を自動化するために開発。ECC（Everything Claude Code）の評価プロセスで活用しながら、実際の案件獲得にもドッグフーディングとして使用する。

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router, TypeScript strict), Tailwind CSS, shadcn/ui
- **バックエンド**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Google Gemini API (gemini-2.5-flash / gemini-2.5-pro)
- **パッケージマネージャ**: pnpm

## アーキテクチャ

案件情報を入力すると複数のGemini pipeline stepが並列分析し、提案文を生成する。

Note: these are Proposal Forge product-local Gemini pipeline steps, not Jinsei
canonical sub-agents. See `docs/LEGACY_AGENT_PIPELINE.md` for the Global role
mapping.

```
案件入力
   ↓
┌─────────────────────────────────────┐
│ 並列実行                              │
│  ① industry-analyst (flash)         │
│  ② pricing-estimator (flash)        │
│  ③ schedule-estimator (flash)       │
│  ④ differentiator (flash)           │
└─────────────────────────────────────┘
   ↓
merger (flash) → ドラフト生成
   ↓
copy-reviewer (pro) → 最終提案文
```

## セットアップ

```bash
# 1. クローン
git clone https://github.com/rasokiwayami/proposal-forge
cd proposal-forge
pnpm install

# 2. 環境変数
cp .env.local.example .env.local
# .env.local に各値を入力

# 3. Supabase セットアップ
# - Supabase でプロジェクト作成
# - SQL Editor で supabase/migrations/20260419000001_init.sql を実行
# - Authentication → Providers → Google を有効化

# 4. 起動
pnpm dev
```

## Vercel デプロイ

1. Vercel で GitHub リポジトリをインポート
2. Environment Variables に `.env.local` の4値を設定
3. Deploy
4. 本番URLを Supabase の Authentication → URL Configuration → Redirect URLs に追加

## ライセンス

MIT
