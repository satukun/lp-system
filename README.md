# toB LP生成システム

マーケターがデザイナーなしで品質の高いtoB向けLPを量産できるシステムです。

---

## システム全体像

このプロジェクトは **2つのワークフロー** が共存しています。

```
┌─────────────────────────────────────────────────────────────────┐
│  ワークフロー A: AIハーネス（開発フロー）                           │
│                                                                 │
│  アイデア（1〜4行）                                               │
│       ↓                                                         │
│  [Planner] → /docs/spec.md（スプリント計画）                      │
│       ↓                                                         │
│  [Designer] → /docs/design.md（Figmaデザイン仕様）               │
│       ↓                                ↑ フィードバック           │
│  [Generator] → 実装（1スプリントずつ）  │                         │
│       ↓                                │                         │
│  [Evaluator] → /docs/feedback/sprint-N.md ─────────────────────┘
│       ↓（合格）
│  Next.js Webアプリが完成
│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ワークフロー B: LP生成（エンドユーザーフロー）                      │
│                                                                 │
│  ブラウザ操作（ウィザード / エディタ）                               │
│       ↓                                                         │
│  コンテンツ入力 + レイアウト選択 + カラーパレット選択                 │
│       ↓                                                         │
│  htmlGenerator.ts（SKILL.md準拠）                                │
│       ↓                                                         │
│  standalone index.html をダウンロード                             │
│                                                                 │
│  ─── または ───                                                   │
│                                                                 │
│  references/*.md を編集 → Claude Code に SKILL.md を指示          │
│       ↓                                                         │
│  index.html を生成・出力                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---|---|---|
| **フレームワーク** | Next.js (App Router) | 16.2.2 |
| **言語** | TypeScript | 5.x |
| **UI ライブラリ** | React | 19.x |
| **スタイリング** | CSS Variables + Tailwind CSS | 4.x |
| **フォント** | Inter / Noto Sans JP (Google Fonts) | — |
| **ユニットテスト** | Vitest | 3.x |
| **E2E テスト** | Playwright | 1.59.x |
| **ビルドツール** | Turbopack (Next.js 組み込み) | — |
| **デザインツール** | Figma | fileKey: `jpGxPuHcGbWRXxCAPFotBf` |
| **AI 開発支援** | Claude Code + Figma MCP | — |
| **デプロイ** | Vercel（想定） | — |

### 設計方針
- **外部 UI ライブラリなし** — MUI・shadcn 等は不使用。CSS 変数とインラインスタイルで完結
- **外部 CDN なし** — 生成 HTML は fully standalone（CSS・JS すべてインライン）
- **状態管理ライブラリなし** — `useState` / `localStorage` のみ
- **DB なし** — MVP はブラウザストレージのみ（バックエンド連携は将来計画）

---

## AIハーネスの設計

`.claude/agents/` に4つの専門エージェントが定義されており、
Claude Code のサブエージェント機能を使って **ロール分担した自律開発** を実現します。

### エージェント構成

```
.claude/agents/
├── planner.md    ← 企画・仕様書生成
├── designer.md   ← Figmaデザイン → 仕様書変換
├── generator.md  ← スプリント実装
└── evaluator.md  ← テスト・品質評価
```

### 各エージェントの責務

| エージェント | モデル | 入力 | 出力 | 責務の境界 |
|---|---|---|---|---|
| **Planner** | opus | アイデア（1〜4行） | `/docs/spec.md` | 「何を作るか」のみ。技術選定・DB設計・API設計は行わない |
| **Designer** | sonnet | FigmaURL + spec.md | `/docs/design.md` | デザイン仕様の抽出のみ。CSSの書き方・実装方法は書かない |
| **Generator** | sonnet | spec.md + design.md | 実装コード + ユニットテスト | 1回の呼び出しで1スプリントのみ。仕様を変更しない |
| **Evaluator** | sonnet | spec.md + 実装コード | `/docs/feedback/sprint-N.md` + E2Eテスト | E2Eテストを蓄積し、回帰を防ぐ |

### ハーネスの反復サイクル

```
Generator が実装
    ↓
ユニットテストを自己実行（全PASS確認）
    ↓
Playwright MCP でブラウザ操作・自己確認
    ↓
/docs/progress.md に自己評価を記録
    ↓
Evaluator が引き継ぎ
    ↓
既存E2Eテスト全PASS確認（回帰チェック）
    ↓
今スプリントのE2Eテスト作成・実行
    ↓
評価スコアが閾値以上？
    ├─ 合格 → 次スプリントへ
    └─ 不合格 → /docs/feedback/sprint-N.md を出力 → Generator へ戻す
```

### ドメイン知識層（変更禁止）

Generator・Evaluator はLP関連機能の実装・評価時に **必ず** 以下を読む。
これらのファイルはエージェントが変更してはならない「ルールブック」として機能します。

```
┌─────────────────────────────────────────────────────────────┐
│  ドメイン知識層（references/ + SKILL.md）                     │
│                                                             │
│  SKILL.md                  LP生成フロー・品質チェックリスト    │
│  references/               ├─ design-system.md             │
│  （変更禁止）               │    カラーパレット3種・タイポグラフィ │
│                             ├─ lp-structure.md             │
│                             │    S1〜S11×3レイアウト定義     │
│                             └─ content-source-template.md  │
│                                  コンテンツフィールド定義     │
└─────────────────────────────────────────────────────────────┘
         ↑ 参照のみ（Generator・Evaluator は書き込み禁止）
```

**CSSの分離ルール**（Generator が厳守）
- アプリUI用: `--col-*` 変数（`globals.css` で定義）
- LP出力用: `--color-*` 変数（`htmlGenerator.ts` でインライン定義）
- 2つを混在させてはならない

---

## スプリント進捗

| Sprint | テーマ | ステータス |
|---|---|---|
| Sprint 1 | 基盤構築（型定義・デフォルトコンテンツ・CSS変数体系） | 完了 |
| Sprint 2 | ウィザード画面（入力フォーム・リアルタイムプレビュー） | 完了 |
| Sprint 3 | エディタ画面（3パネル・並び替え・ストック） | 完了 |
| Sprint 4 | 完了画面・カラーパレット・ダークモード | 完了 |
| Sprint 5 | HTMLダウンロード・フィードバック送信 | HTML完了 / フィードバック送信はTODO |
| Sprint 6 | Notion連携 | 未実装（将来計画） |

進捗の詳細は `/docs/progress.md`、評価結果は `/docs/feedback/sprint-N.md` を参照。

---

## ディレクトリ構成

```
lp-systems/
├── .claude/
│   └── agents/
│       ├── planner.md     ← [ハーネス] Plannerエージェント定義
│       ├── designer.md    ← [ハーネス] Designerエージェント定義
│       ├── generator.md   ← [ハーネス] Generatorエージェント定義
│       └── evaluator.md   ← [ハーネス] Evaluatorエージェント定義
├── docs/
│   ├── spec.md            ← [ハーネス] Plannerが生成した製品仕様書
│   ├── progress.md        ← [ハーネス] Generatorの自己評価・進捗記録
│   └── feedback/
│       └── sprint-N.md    ← [ハーネス] Evaluatorの評価フィードバック
├── SKILL.md               ← [ドメイン知識層] CLIワークフロー用AI指揮者
├── index.html             ← [CLIワークフロー出力] 生成されたLP
├── references/
│   ├── design-system.md                  ← [ドメイン知識層] カラー・タイポグラフィ
│   ├── lp-structure.md                   ← [ドメイン知識層] S1〜S11×3レイアウト定義
│   └── content-source-template.md        ← [ドメイン知識層] コンテンツ原稿テンプレート
├── src/
│   ├── app/
│   │   ├── page.tsx                      ← [ルート] ウィザード画面
│   │   ├── editor/page.tsx               ← [/editor] エディタ画面
│   │   ├── generating/page.tsx           ← [/generating] 生成アニメーション
│   │   └── complete/page.tsx             ← [/complete] 完成・ダウンロード画面
│   ├── components/
│   │   ├── editor/
│   │   │   ├── EditorPanel.tsx           ← エディタ左パネル全体
│   │   │   ├── sections/                 ← セクション別フォーム（S1〜S11）
│   │   │   └── LayoutPicker.tsx          ← レイアウト選択UI（Layout 0/1/2）
│   │   ├── preview/
│   │   │   ├── PreviewPanel.tsx          ← リアルタイムプレビューパネル
│   │   │   └── SectionRenderer.tsx       ← セクション別レンダラー
│   │   ├── stock/
│   │   │   └── StockPanel.tsx            ← ストック（保存・比較）パネル
│   │   ├── wizard/
│   │   │   └── LayoutPicker.tsx          ← ウィザード用レイアウト選択
│   │   └── ui/
│   │       ├── Icons.tsx
│   │       ├── SectionCard.tsx
│   │       ├── ThemeToggle.tsx           ← ダークモード切り替え
│   │       └── FieldInput.tsx
│   └── lib/
│       ├── types.ts                      ← 型定義（LPData, SectionKey等）
│       ├── defaultContent.ts             ← デフォルトコンテンツ
│       ├── htmlGenerator.ts              ← standalone HTML生成（SKILL.md準拠）
│       ├── htmlGenerator.test.ts         ← HTMLジェネレーターのユニットテスト
│       ├── markdownGenerator.ts          ← content-source.md形式でMarkdown出力
│       └── sectionLayouts.ts             ← レイアウトパターン定義
├── tests/                                ← Evaluatorが蓄積するE2Eテスト
├── next.config.ts
├── playwright.config.ts
└── vitest.config.ts
```

---

## データモデル

### LPData（src/lib/types.ts）

```typescript
interface LPData {
  s1:  S1Header;       // ナビゲーション（メニュー・CTA）
  s2:  S2Hero;         // ファーストビュー（コピー・信頼バッジ）
  s3:  S3Message;      // メッセージ（サービス概要）
  s4:  S4Problems;     // 課題定義（3枚カード）
  s5:  S5Features;     // 特徴・強み（3枚カード）
  s6:  S6Categories;   // 対応業種（6グリッド）
  s7:  S7CaseStudies;  // 導入事例（3枚カード）
  s8:  S8Flow;         // 導入フロー（ステップ）
  s9:  S9FormFaq;      // フォーム＋FAQ
  s10: S10Closing;     // 最終CTA
  s11: S11Footer;      // フッター（リンク・コピーライト）
  images: Record<string, string>;  // 画像URL
}
```

### SectionLayouts

各セクションのレイアウトパターン（`0` / `1` / `2`）を保持するマップ。
3種のレイアウトは `references/lp-structure.md` で定義。

### ColorPalette

`"A"` (ゴールド) / `"B"` (ブルー) / `"C"` (グリーン) の3種。
カラートークンは `references/design-system.md` で定義。

### StockedLP

エディタで保存したLP状態のスナップショット。
`LPData + SectionLayouts + sectionOrder + hiddenSections` を持つ。

---

## 画面フロー（Webアプリ）

```
/ (ウィザード)
  ├─ ウェルカム画面 → 「はじめる」
  └─ ビルダー画面
       S1〜S11 を任意の順で入力・確定
       └─ 「LPを生成」 → /generating（アニメーション）
                           └─ /complete
                                ├─ プレビュー（PC / Tablet / SP 切り替え）
                                ├─ HTMLダウンロード
                                ├─ フィードバック送信（TODO: バックエンド未実装）
                                └─ エディタへ

/editor
  ├─ 左: エディタパネル（フォーム + 並び替え + 表示/非表示）
  ├─ 中: リサイズ可能ドラッグバー
  ├─ 右: リアルタイムプレビュー（カラー・レイアウト切替）
  └─ ストックパネル（LP状態の保存・読み込み・比較）
```

---

## 11セクション構成

各セクション3レイアウト × 11セクション = **33パターン**を組み合わせて生成。

| # | セクション | 役割 |
|---|---|---|
| S1 | Header | ナビゲーション |
| S2 | Hero & Trust Badges | ファーストビュー |
| S3 | Message | サービス概要 |
| S4 | Problem Identification | 課題提示 |
| S5 | Features & Benefits | 特徴・強み |
| S6 | Categories | 対応業種 |
| S7 | Case Studies | 導入事例 |
| S8 | Implementation Flow | 導入フロー |
| S9 | Lead Form & FAQ | フォーム+FAQ |
| S10 | Closing Message | 最終CTA |
| S11 | Footer | 企業情報 |

---

## ローカル開発

```bash
npm install
npm run dev           # http://localhost:3000
npm run build
npm run test          # vitest（ユニットテスト）
npx playwright test   # E2Eテスト（tests/ 以下）
```

---

## Webアプリのローカルストレージ

ウィザード → エディタ → 完成画面間のデータ受け渡しに使用。

| キー | 内容 |
|---|---|
| `lp_wizard_data` | LPDataのJSON |
| `lp_wizard_layouts` | SectionLayoutsのJSON |
| `lp_wizard_confirmed` | 確定済みセクションキーの配列 |
| `lp_wizard_palette` | カラーパレット（"A" / "B" / "C"） |

---

## CLIワークフロー（SKILL.md）

Claude Code を使ってHTMLを直接生成するAIドリブンのワークフロー。

### 使い方

1. `references/content-source-template.md` をコピーして案件名でリネーム
2. `[可変]` マークの箇所を書き換える
3. Claude Code に以下を指示する

```
以下の3つのmdファイルを読み込んで、toB向けLPのHTMLを生成してください。

1. references/design-system.md
2. references/lp-structure.md
3. references/content-source-（案件名）.md

SKILL.mdのワークフローに従って生成してください。
```

4. 生成された `index.html` をブラウザで確認

### 修正方法

| 修正の種類 | 変更対象 |
|---|---|
| コピー・文言の変更 | content-source.md |
| セクション順序・構成の変更 | lp-structure.md |
| デザイン・カラーの変更 | design-system.md |
| カラーパレット切り替え | content-source.md のパレット指定 |

---

## HTMLジェネレーター仕様（src/lib/htmlGenerator.ts）

Webアプリ・CLIの両ワークフローで共通して使われる出力ロジック。
SKILL.md の品質チェックリストに準拠して生成。

- **出力形式**: standalone HTML（外部CDN不使用、CSS・JSすべてインライン）
- **CSS**: デザインシステムのカラートークンを `--color-*` 変数で定義
- **JS**: FAQアコーディオン・ハンバーガーメニューのみ
- **セクションコメント**: `<!-- S1: Header [Layout N] -->` 形式
- **インデント**: スペース2つ
- **レスポンシブ**: PC/SP対応（ブレークポイント: 768px）

---

## 今後の実装ロードマップ

| 優先度 | 実装内容 | 概要 |
|---|---|---|
| ① | **Supabase 導入（DB）** | localStorage → DB に移行。環境変数で接続先を差し替え可能な設計にする |
| ② | **認証（ログイン）** | ユーザーごとに LP を保存・管理できるようにする |
| ③ | **LP 保存・一覧機能** | 作成した LP を後から呼び出せるようにする |
| ④ | **画像アップロード（Supabase Storage）** | プレースホルダー脱却。実画像を使えるようにする |
| ⑤ | **フィードバック送信** | UI は実装済み。バックエンド（DB 書き込み）が未実装 |
| ⑥ | **Zustand 導入** | 画面間の状態管理が複雑になったタイミングで導入 |
| ⑦ | **Vercel デプロイ** | 本番公開。必要に応じて Cloudflare をドメイン管理に利用 |

> Notion 連携は対象外（除外済み）

---

## 注意事項

- `references/` と `SKILL.md` はドメイン知識層のため**変更禁止**（全案件・全エージェントに影響）
- CSS変数 `--col-*`（アプリUI用）と `--color-*`（LP出力用）を混在させない
- `content-source.md` のテキストはAIが一言一句そのまま使うため誤字に注意
- フォームはUI表示のみ（バックエンド連携は別途実装が必要）
- 画像はMVPではplaceholder.coを使用。本番では実画像URLに差し替えること
