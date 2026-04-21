# toB LP生成システム

マーケターがデザイナーなしで品質の高いtoB向けLPを量産できるシステムです。

---

## このシステムでできること

- **ウィザード形式で入力するだけ**でLPのHTMLが完成する
- **11セクション**それぞれで**複数のレイアウトパターン**を選択できる（Figmaで定義したデザインを読み込む設計）
- **3種のカラーパレット**を切り替えられる
- **リアルタイムプレビュー**で仕上がりを確認しながら編集できる
- 生成した HTMLは**完全スタンドアロン**（外部サービス依存ゼロ）

---

## 現在の仕組み（アーキテクチャ）

**現在はブラウザだけで完結しています。サーバー・DBは未使用です。**

```
ユーザー操作（ブラウザ）
        ↓
  Next.js / React
  （画面描画・ルーティング）
        ↓
  useState + localStorage
  （画面間のデータ受け渡し）
        ↓
  htmlGenerator.ts
  （HTMLを文字列で生成）
        ↓
  index.html ダウンロード
```

### 画面フロー

```
/ ウィザード画面
  └─ S1〜S11 を入力・確定
       └─ 「LPを生成」
            └─ /generating（生成アニメーション）
                 └─ /complete（プレビュー・ダウンロード）
                      └─ /editor（3パネル編集）
```

### localStorage によるデータ受け渡し

ページ遷移時のデータは localStorage 経由で受け渡しています。
（バックエンド導入後は DB に移行予定）

| キー | 内容 |
|---|---|
| `lp_wizard_data` | LPData（コンテンツ全体）のJSON |
| `lp_wizard_layouts` | セクションごとのレイアウト選択 |
| `lp_wizard_confirmed` | 確定済みセクションキーの配列 |
| `lp_wizard_palette` | カラーパレット（"A" / "B" / "C"） |

---

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---|---|---|
| **フレームワーク** | Next.js (App Router) | 16.2.2 |
| **言語** | TypeScript | 5.x |
| **UI** | React | 19.x |
| **スタイリング** | CSS Variables + Tailwind CSS | 4.x |
| **フォント** | Inter / Noto Sans JP (Google Fonts) | — |
| **ユニットテスト** | Vitest | 3.x |
| **E2E テスト** | Playwright | 1.59.x |
| **ビルドツール** | Turbopack (Next.js 組み込み) | — |
| **デザインツール** | Figma | fileKey: `jpGxPuHcGbWRXxCAPFotBf` |
| **AI 開発支援** | Claude Code + Figma MCP | — |
| **デプロイ先（予定）** | Vercel | — |

---

## 設計方針

### フロントエンド

- **外部 UI ライブラリなし**
  MUI・shadcn 等は使わず、CSS 変数とインラインスタイルで完結させる。依存を最小にすることで保守性を高める。

- **CSS 変数の分離**
  アプリ UI 用（`--col-*`）と LP 出力用（`--color-*`）を厳密に分ける。混在させると LP の見た目がアプリのテーマ変更に引きずられる。

- **状態管理ライブラリなし（現状）**
  `useState` + `localStorage` で十分なうちは導入しない。画面間の受け渡しが複雑になったタイミングで Zustand を検討する。

### LP 出力

- **完全スタンドアロン HTML**
  外部 CDN を一切使わず、CSS・JS すべてインライン。サーバーなしでそのまま使えるファイルを出力する。

- **パターンは Figma 起点で管理（目標）**
  セクションのレイアウトパターンは Figma でデザインし、Figma MCP 経由でウィザードに読み込むことを想定した設計。**現状は Figma 同期が未実装のため、`sectionLayouts.ts` / `SectionRenderer.tsx` / `htmlGenerator.ts` にハードコーディングされている暫定状態。** Figma → ウィザード同期が実装されれば、この3ファイルへの手動追記は不要になる。

- **デザインシステムに準拠**
  カラー・フォント・余白は `references/design-system.md` で定義したルールに従う。独自カラーの直書き禁止。

### Figma 連携

- **Pattern Overview**（Figma）は 320×240px の矩形のみで構成された schematic thumbnail。コンポーネントインスタンスへの置き換えは不要。
- **LP Preview**（Figma）は 1440px 幅のフルサイズデザイン。コード実装の視覚的ドキュメントとして機能する。
- Figma への書き込みは現在社内許可待ちのため、読み取り（参照・確認）のみ実施中。

---

## セクション構成

11 セクションで構成される。各セクションのレイアウトパターンは **Figma で定義し、Figma MCP 経由でウィザードに読み込む設計**。現状は Figma 同期が未実装のため各セクション 4 パターン（A/B/C/D）をコードにハードコーディングしている。

| # | セクション | 役割 |
|---|---|---|
| S1 | Header | ナビゲーション |
| S2 | Hero | ファーストビュー・キャッチコピー |
| S3 | Message | サービス概要・共感メッセージ |
| S4 | Problems | 課題提示（3枚カード）|
| S5 | Features | 特徴・強み（3枚カード）|
| S6 | Categories | 対応業種・カテゴリ（6グリッド）|
| S7 | Case Studies | 導入事例（3枚カード）|
| S8 | Flow | 導入フロー（ステップ）|
| S9 | FAQ & Form | よくある質問 + 問い合わせフォーム |
| S10 | Closing CTA | 最終アクション誘導 |
| S11 | Footer | 企業情報・リンク・コピーライト |

---

## ディレクトリ構成

```
lp-system/
├── references/
│   ├── design-system.md          ← カラー・フォント・余白ルール（変更禁止）
│   ├── lp-structure.md           ← S1〜S11 の構造定義（変更禁止）
│   ├── content-source-template.md← コンテンツ原稿テンプレート
│   └── figma-design-guide.md     ← Figma LP Preview デザイン仕様
├── src/
│   ├── app/
│   │   ├── page.tsx              ← ウィザード画面（/）
│   │   ├── editor/page.tsx       ← エディタ画面（/editor）
│   │   ├── generating/page.tsx   ← 生成アニメーション（/generating）
│   │   ├── complete/page.tsx     ← 完成・ダウンロード画面（/complete）
│   │   └── globals.css           ← CSS 変数定義（--col-* アプリUI用）
│   ├── components/
│   │   ├── wizard/
│   │   │   └── LayoutPicker.tsx  ← レイアウト選択 UI
│   │   ├── editor/
│   │   │   ├── EditorPanel.tsx   ← 左パネル（フォーム・並び替え）
│   │   │   └── sections/         ← S1〜S11 フォーム（11ファイル）
│   │   ├── preview/
│   │   │   ├── PreviewPanel.tsx  ← リアルタイムプレビュー
│   │   │   ├── SectionRenderer.tsx← セクション別 React レンダラー
│   │   │   └── SectionParts.tsx  ← 共通パーツ（SectionHeader / CtaRow）
│   │   ├── stock/
│   │   │   └── StockPanel.tsx    ← LP 状態の保存・読み込み
│   │   └── ui/
│   │       ├── Icons.tsx
│   │       ├── SectionCard.tsx
│   │       ├── FieldInput.tsx
│   │       └── ThemeToggle.tsx   ← ダーク/ライトモード切り替え
│   ├── lib/
│   │   ├── types.ts              ← 型定義（LPData / SectionKey 等）
│   │   ├── defaultContent.ts     ← デフォルトコンテンツ
│   │   ├── sectionLayouts.ts     ← 44 パターンのサムネイル定義
│   │   ├── htmlGenerator.ts      ← standalone HTML 生成
│   │   └── markdownGenerator.ts  ← Markdown 出力
│   └── styles/
│       └── lp-preview.css        ← LP プレビュー用スタイル（--color-* LP出力用）
├── DESIGN.md                     ← UIデザインシステム（ElevenLabs インスパイア）
├── CLAUDE.md                     ← Claude へのパターン追加ルールブック
└── SYSTEM-DESIGN.md              ← システム設計詳細
```

---

## ローカル開発

```bash
npm install
npm run dev           # http://localhost:3000
npm run build         # 本番ビルド
npm run test          # Vitest（ユニットテスト）
npx playwright test   # E2E テスト
```

---

## 今後の実装ロードマップ

### フロントエンド

| 優先度 | 実装内容 | 概要 | ステータス |
|---|---|---|---|
| ① | **Figma → ウィザード同期** | Figma MCP でデザインを読み取り、セクション・パーツをウィザードに自動反映する。**これが実装されると現状のハードコーディングが解消され、Figmaにデザインを追加するだけでパターンが増える状態になる。** | 未着手 |
| ② | **Claude → Figma 書き込み** | Pattern Overview / LP Preview へのフレーム自動生成 | 保留（社内許可待ち）|

### デザイナー連携

| 優先度 | 実装内容 | 概要 | ステータス |
|---|---|---|---|
| ① | **Figma `_Guide` ページ作成** | デザイナー向けのルールブックをFigma内に作成。「なぜレイヤー名が重要か」という理由を含め、ウィザードとの紐づき仕組み・命名規則早見表（S1〜S11全セクション）を記載する | 未着手 |
| ② | **マーケター向けウィザード利用ガイド** | ウィザードの使い方・各セクションの役割をスライドにまとめる | 未着手 |

### バックエンド

| 優先度 | 実装内容 | 概要 |
|---|---|---|
| ① | **Supabase 導入（DB）** | localStorage → DB に移行。`.env` の2行差し替えでアカウント変更可能な設計にする |
| ② | **認証** | ユーザーごとに LP を保存・管理できるようにする |
| ③ | **LP 保存・一覧** | 作成した LP を後から呼び出せるようにする |
| ④ | **画像アップロード** | Supabase Storage を使い実画像に対応する |
| ⑤ | **フィードバック送信** | UI は実装済み。DB への書き込みが未実装 |
| ⑥ | **Zustand 導入** | 状態管理が複雑になったタイミングで導入 |
| ⑦ | **Vercel デプロイ** | 本番公開 |

### インフラ / CI・CD

| 優先度 | 実装内容 | 概要 |
|---|---|---|
| ① | **GitHub Actions 設定** | push / PR をトリガーに `npm run build` → Vitest → Playwright を自動実行 |
| ② | **Vitest テスト整備** | `src/` 配下にユニットテストを追加（現状テストファイルがなく `npm run test` が空振り）|
| ③ | **Playwright テスト整備** | `tests/e2e/` のスペックを実際の画面仕様に合わせて充実させる |

> **Cloudflare** — インフラ検討候補として保留。Vercel デプロイ後に改めて判断する。
> **Notion 連携** — 対象外（除外済み）。

---

## 注意事項

- `references/` 内のファイルはドメイン知識層のため**変更禁止**（全案件・全エージェントに影響）
- CSS 変数 `--col-*`（アプリUI用）と `--color-*`（LP出力用）を混在させない
- `content-source.md` のテキストは AI が一言一句そのまま使うため誤字に注意
- フォームは UI 表示のみ（バックエンド連携は別途実装が必要）
- 画像は現状 placeholder.co を使用。本番では実画像 URL に差し替えること
