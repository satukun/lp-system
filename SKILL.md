# SKILL.md — toB LP生成スキル

> このスキルは、3つのmdファイルを読み込み、toB向けLPのHTMLを生成します。
> 必ずこのファイルの指示に従って作業を進めてください。

---

## 読み込み順序（厳守）

1. **design-system.md** を読み込み、カラーパレット・ビジュアルルールを把握する
2. **lp-structure.md** を読み込み、セクション構成とレイアウトパターン仕様を把握する
3. **content-source.md** を読み込み、実際のコンテンツとレイアウト指定を把握する

---

## ワークフロー

### Phase 1: 理解
- 3ファイルを順番に読み込む
- content-source.md の以下を確認する：
  - `## カラーパレット` — A/B/C のどれが指定されているか
  - 各セクションの `[レイアウト: N]` — Layout 0/1/2 のどれか
  - `[可変]` 部分にすべてテキストが入っているか
- 不足や矛盾がある場合はユーザーに確認を取る

### Phase 2: 生成
- **単一の index.html ファイル** として出力する
- CSS はすべて `<style>` タグ内にインラインで記述する
- JS は最小限とし、FAQ アコーディオンとハンバーガーメニューのみ
- セクション順序は lp-structure.md の S1〜S11 を厳守する
- 各セクションのレイアウトは lp-structure.md の「レイアウトパターン」表を参照する
- 画像は placeholder.co を使用し、content-source.md のビジュアル指示を alt に含める
- カラーパレットは design-system.md § 2 の該当パレットを CSS カスタムプロパティとして定義する

### Phase 3: 品質チェック
生成後、以下の項目をセルフチェックすること：

- [ ] セクションが S1〜S11 の順序で配置されているか
- [ ] 指定パレット（A/B/C）の8色以外の色を使っていないか
- [ ] 各セクションが指定された Layout 0/1/2 で実装されているか
- [ ] フォントサイズが design-system.md の規定に従っているか
- [ ] レスポンシブ対応（PC/SP）が各セクションで実装されているか
- [ ] CTAボタンの文言がページ内で一貫しているか
- [ ] placeholder 画像に適切な alt テキストが入っているか
- [ ] フォームの必須フィールドがすべて含まれているか
- [ ] FAQのアコーディオンが動作するか
- [ ] ヘッダーの sticky 動作が実装されているか
- [ ] フッターのリンクがすべて含まれているか

---

## カラーパレット適用方法

```css
:root {
  /* パレットA（ゴールド）の例 */
  --color-primary: #FFD700;
  --color-primary-dark: #E6C200;
  --color-secondary: #1A1A2E;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-bg: #FFFFFF;
  --color-bg-alt: #F5F5F0;
  --color-border: #E0E0E0;
}
```

パレットB（ブルー）やパレットC（グリーン）の場合は、上記の値を design-system.md § 2 の該当パレット値に置き換える。

---

## レイアウトパターン実装ガイド

### S1 ヘッダー
- **Layout 0**: 白背景、ロゴ左・ナビ中央・CTA右、border-bottom: 1px solid border色
- **Layout 1**: secondary色背景、ゴールドロゴ、白ナビ（opacity: 0.8）、ゴールドCTA
- **Layout 2**: 白背景、border-bottom: 4px solid primary色、ロゴ＋小タグライン

### S2 ヒーロー
- **Layout 0**: grid 6:4、左テキスト・右画像、min-height 600px
- **Layout 1**: 中央揃え、max-width 760px、メインコピー52px、下部フルワイド画像
- **Layout 2**: grid 4:6、左画像・右テキスト、min-height 600px

### S3 メッセージ
- **Layout 0**: bg-alt背景、中央揃え、max-width 720px
- **Layout 1**: 白背景、大きな引用符（primary色、120〜140px）、左揃えテキスト
- **Layout 2**: secondary色背景、白テキスト、ラベルはprimary色（opacity: 0.7）

### S4 課題
- **Layout 0**: 3カラムカード、グレーアイコンボックス（48×48）、中央揃え
- **Layout 1**: 3カラムカード、ゴールドナンバーボックス（48×48）、左揃え
- **Layout 2**: リストスタイル（カードなし）、ゴールドナンバー＋テキスト、border-bottomで区切り

### S5 特徴
- **Layout 0**: 3カラムカード、POINTバッジ→タイトル→説明→下部画像
- **Layout 1**: 3カラムカード、上部画像→POINTバッジ→タイトル→説明
- **Layout 2**: 1カラム横長カード（padding 28px 32px）、ゴールド大番号（80×80）左＋テキスト中＋画像右

### S6 カテゴリ
- **Layout 0**: 3×2グリッド（grid-template-columns: repeat(3,1fr)）、画像120px
- **Layout 1**: 2×3グリッド（grid-template-columns: repeat(2,1fr)）、画像200px
- **Layout 2**: 縦リスト（flex-direction: column）、画像120×90、border-radius付き

### S7 事例
- **Layout 0**: 3カラムカード、画像上160px・テキスト下
- **Layout 1**: 3カラムカード＋ゴールドバッジ「導入事例」
- **Layout 2**: 1カラム横長（画像左240px・テキスト右）、ゴールドバッジ付き

### S8 フロー
- **Layout 0**: 横並びgrid（4列）、ゴールド円番号（48px）、→矢印
- **Layout 1**: 横並びgrid（4列）、secondary色角丸正方形番号（48px）、矢印なし
- **Layout 2**: 縦並び（flex-direction: column）、左縦ライン（2px・border色）、ゴールド円番号

### S9 フォーム・FAQ
- **Layout 0**: 2カラムgrid（1fr 1fr）、FAQ左・フォーム右、「Q.」CSSプレフィックス
- **Layout 1**: 2カラムgrid、ゴールドQバッジ（background: primary色）
- **Layout 2**: 2カラムgrid、番号バッジ（①②③…、background: secondary色、color: primary色）

### S10 クロージング
- **Layout 0**: primary-dark色背景、中央揃え、横並びCTA（flex-direction: row）
- **Layout 1**: primary-dark色背景、縦積みCTA（flex-direction: column、max-width 400px）
- **Layout 2**: secondary色背景、白テキスト、ゴールドCTA、セカンダリはwhite/transparent

### S11 フッター
- **Layout 0**: secondary色背景、ロゴ左・リンク横並び右
- **Layout 1**: secondary色背景、ロゴ＋タグライン左・リンク横並び右
- **Layout 2**: secondary色背景、全要素中央揃え（text-align: center）

---

## 出力ルール

- ファイル名: `index.html`
- 文字コード: UTF-8
- 外部CDNの使用: 禁止（すべてインライン）
- コメント: 各セクションの開始位置に `<!-- S1: Header [Layout N] -->` 等のコメントを入れる
- コードフォーマット: インデントはスペース2つ

---

## 修正対応

ユーザーから修正指示を受けた場合：

1. 修正対象のセクションを特定する
2. 変更種別を判断する：
   - **コンテンツ変更**: content-source.md の該当部分を修正後、HTMLを再生成
   - **レイアウト変更**: lp-structure.md の該当パターンを確認し、HTMLを再生成
   - **デザイン変更**: design-system.md を更新後、HTMLを再生成
   - **カラー変更**: パレットA/B/Cを切り替えて、CSS変数を更新

---

## ファイル構成

```
lp-system/
├── SKILL.md                          ← このファイル（指揮者）
└── references/
    ├── design-system.md              ← Layer 1: デザインシステム（カラー3種・レイアウト定義）
    ├── lp-structure.md               ← Layer 2: toB LP構造（各セクション3パターン仕様）
    └── content-source-template.md    ← Layer 3: コンテンツ原稿（レイアウト・パレット指定含む）
```
