# LP生成ウィザード — Claude 取扱説明書

> このファイルはClaudeが自動で読み込む設定ファイルです。
> マーケターがClaudeにパターン追加を依頼するときのルールブックとして機能します。

---

## あなた（Claude）の役割

このプロジェクトでのClaudeの役割は **「ウィザードのセクションパターンを増やすこと」** です。

マーケターやデザイナーからの依頼を受けて、以下の2つのルートでパターンを追加します。

---

## パターン追加の2つのルート

### ルートA：マーケター → Claude → Figma → コード

マーケターが「こんなパターンが欲しい」とClaudeに伝える。

**Claudeがやること（順番通りに）：**
1. `references/design-system.md` を読んで色・スペーシングルールを確認する
2. `references/lp-structure.md` を読んで対象セクションの構造を確認する
3. Figmaに新パターンのフレームを作成する
   - fileKey: `jpGxPuHcGbWRXxCAPFotBf`（YO.Tec Professional チーム）
   - ページ: `Pattern Overview`（全パターンを1ページで管理）
   - フレーム名: `{sectionKey}/{patternLabel}` 形式（例: `s2/D`）
4. 後述の「コード変更ルール」に従って4ファイルを変更する
5. `npm run build` を実行してエラーがないか確認する

### ルートB：デザイナー → Figma → Claude → コード

デザイナーがFigmaでデザインを完成させた後、Claudeに「コード化して」と依頼する。

**Claudeがやること（順番通りに）：**
1. Figma MCP（`get_design_context`）でフレームのデザインを読み取る
2. デザインを忠実にコードに反映する
3. 後述の「コード変更ルール」に従って4ファイルを変更する
4. `npm run build` を実行してエラーがないか確認する

---

## コード変更ルール（必ず守ること）

パターンを1つ追加するたびに、以下の4ファイルを順番に変更します。

| # | ファイルパス | 変更内容 |
|---|---|---|
| 1 | `src/lib/sectionLayouts.ts` | `SECTION_LAYOUTS` の該当セクション配列に `LayoutPattern` を追加 |
| 2 | `src/components/preview/SectionRenderer.tsx` | 該当セクションに `layout === N` の JSX を追加 |
| 3 | `src/lib/htmlGenerator.ts` | 該当セクションに `layout === N` の HTML 文字列を追加 |
| 4 | `src/lib/defaultContent.ts` | **新しいフィールドが必要な場合のみ** デフォルト値を追加 |

### 変更してはいけないファイル

- `src/components/wizard/LayoutPicker.tsx` → パターン数は配列長で自動対応済み
- `src/lib/types.ts` → `LayoutIndex = 0 | 1 | 2 | 3` はすでに4パターン対応済み
- `src/app/` 以下のファイル → ウィザードUIのルーティング
- 既存のパターン（A/B/C）のコード → 既存LPへの影響が出る

> ⚠️ 現状の制限：各セクション最大4パターン（A〜D）まで。
> 5パターン目以降が必要になったときはエンジニアに `types.ts` の型拡張を依頼すること。

---

## 各ファイルの書き方

### 1. sectionLayouts.ts への追記

```ts
// 既存パターンの配列末尾に追加
{
  label: "パターン名（日本語2〜4文字）",
  description: "ウィザードに表示される説明文（20〜30文字目安）",
  blocks: [
    // [x, y, w, h, fill, borderRadius?]
    // viewBox は "0 0 100 65" 固定
    // fill の選択肢:
    //   w = white   (#FFFFFF)
    //   l = light   (#F5F5F0)
    //   d = dark    (#1A1A2E)
    //   a = accent  (#FFD700)
    //   g = gray    (#E0E0E0)
    //   m = muted   (#BBBBBB)
    [0, 0, 100, 65, "w", 3],   // 背景
    [10, 15, 80, 8, "d", 2],   // 見出し
    [20, 28, 60, 4, "m", 1],   // サブテキスト
    [35, 38, 30, 12, "a", 2],  // CTAボタン
  ],
},
```

### 2. SectionRenderer.tsx への追記

```tsx
// 既存の if (layout === N) ブロックの後に追加
if (layout === 3) {  // ← 追加するパターンのインデックス番号
  return (
    <section
      style={{
        background: "var(--color-bg)",
        padding: "80px 0",
      }}
    >
      <div className="container" style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
        {/* Figmaのデザインに忠実なJSX */}
      </div>
    </section>
  );
}
```

**使用できるCSS変数（必ずCSS変数を使うこと・直書き禁止）：**

```
var(--color-primary)       → #FFD700（アクセントカラー）
var(--color-primary-dark)  → #E6C200
var(--color-secondary)     → #1A1A2E（ダークネイビー）
var(--color-text)          → #333333（本文）
var(--color-text-light)    → #666666（補足テキスト）
var(--color-bg)            → #FFFFFF（白背景）
var(--color-bg-alt)        → #F5F5F0（薄いグレー背景）
var(--color-border)        → #E0E0E0（ボーダー）
```

### 3. htmlGenerator.ts への追記

```ts
// 既存の if (layout === N) ブロックの後に追加
if (layout === 3) {
  return `<!-- S{N}: セクション名 [Layout D] -->
<section class="s{N} s{N}-layout-d" style="background:var(--color-bg);padding:80px 0;">
  <div class="container" style="max-width:1160px;margin:0 auto;padding:0 24px;">
    <!-- Figmaのデザインに忠実なHTML -->
  </div>
</section>`;
}
```

---

## Figmaレイヤー命名ルール

Claudeが `use_figma` でフレームを作成・参照する際は以下を守ること。

**フレーム名：**
```
{sectionKey}/{patternLabel}
例：s2/D、s5/D、s8/E
```

**テキストレイヤー名（TypeScriptのフィールドパスと一致させる）：**
```
heading           → data.s2.mainCopy
subCopy           → data.s2.subCopy
ctaText           → data.s2.ctaText
sectionHeading    → data.s4.sectionHeading
card[0]/heading   → data.s4.cards[0].heading
card[0]/body      → data.s4.cards[0].description
step[0]/title     → data.s8.steps[0].title
```

**サムネイル用フレーム名（100×65固定サイズ）：**
```
{sectionKey}/{patternLabel}/thumbnail
例：s2/D/thumbnail
```

---

## やってはいけないこと

- デザインシステムの8色以外の色を使う（`#0A0A1A` など独自カラー厳禁）
- 依頼されていないセクションのコードを変更する
- アニメーション・ホバーエフェクトを勝手に追加する
- Figmaに存在しないパターンをコードに追加する
- `LayoutIndex` 型を勝手に拡張する（エンジニアの管轄）
- `npm run build` のエラーを放置したままコミットする

---

## よくある依頼と対応例

**依頼例：**
「S2のヒーローで、背景が全面ダークでテキストとCTAが中央にあるパターンが欲しい」

**正しい対応手順：**
1. `references/design-system.md` を読む → ダーク = `#1A1A2E`（`var(--color-secondary)`）で対応可と確認
2. FigmaのPattern Overview ページに `s2/D` フレームを作成
3. `sectionLayouts.ts` に blocks 配列を追記
4. `SectionRenderer.tsx` に `layout === 3` の JSX を追記
5. `htmlGenerator.ts` に `layout === 3` の HTML を追記
6. `npm run build` でエラーがないか確認
7. 「S2にパターンDを追加しました。ウィザードで確認してください」と報告

---

## プロジェクト構成（参照ファイル）

```
lp-system/
├── references/
│   ├── design-system.md          # カラー・フォント・余白のルール（必ず最初に読む）
│   ├── lp-structure.md           # S1〜S11の構造定義
│   └── content-source-template.md # コンテンツ原稿のテンプレート
├── src/lib/
│   ├── sectionLayouts.ts         # パターン追加の主戦場①
│   ├── types.ts                  # 型定義（触らない）
│   └── defaultContent.ts         # デフォルトテキスト（新フィールド時のみ）
├── src/components/
│   ├── preview/SectionRenderer.tsx  # パターン追加の主戦場②
│   └── editor/EditorPanel.tsx       # 触らない
└── src/lib/htmlGenerator.ts         # パターン追加の主戦場③
```

**Figmaファイル情報：**
- fileKey: `jpGxPuHcGbWRXxCAPFotBf`
- チーム: YO.Tec Professional
- URL: `https://www.figma.com/design/jpGxPuHcGbWRXxCAPFotBf/lp-system`
- ページ構成: `_Design System`（カラー・タイポグラフィ仕様）/ `Pattern Overview`（全44パターン一覧）

---

*最終更新: 2026-04-16*
