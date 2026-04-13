# 実装進捗

## Sprint 1: 基盤構築
**ステータス:** 完了
**実装日:** 2026-04-10 以前

### 実装内容
- Next.js プロジェクトセットアップ（TypeScript + Tailwind v4）
- 型定義: `src/lib/types.ts`（LPData, SectionLayouts, SectionKey, ColorPalette 等）
- デフォルトコンテンツ: `src/lib/defaultContent.ts`
- レイアウト定義: `src/lib/sectionLayouts.ts`（11セクション × A/B/C = 33パターン）
- グローバルスタイル: `src/app/globals.css`（CSS変数 `--col-*` 体系）

### 起動方法
```bash
npm run dev  # http://localhost:3000
```

---

## Sprint 2: ウィザード画面
**ステータス:** 完了
**実装日:** 2026-04-10 以前

### 実装内容
- ウィザード画面: `src/app/page.tsx`
- セクションフォーム: `src/components/editor/sections/S1〜S11*.tsx`
- プレビュー: `src/components/preview/PreviewPanel.tsx`, `SectionRenderer.tsx`
- レイアウト選択: `src/components/wizard/LayoutPicker.tsx`
- localStorage キー: `lp_wizard_data`, `lp_wizard_layouts`, `lp_wizard_confirmed`

---

## Sprint 3: エディタ画面
**ステータス:** 完了
**実装日:** 2026-04-10 以前

### 実装内容
- エディタ画面: `src/app/editor/page.tsx`
- 編集パネル: `src/components/editor/EditorPanel.tsx`
- ストック: `src/components/stock/StockPanel.tsx`
- UIコンポーネント: `src/components/ui/FieldInput.tsx`, `SectionCard.tsx`
- Markdownジェネレーター: `src/lib/markdownGenerator.ts`

---

## Sprint 4: 完了画面・カラーパレット・ダークモード
**ステータス:** 完了
**実装日:** 2026-04-10

### 実装内容
- 完了画面: `src/app/complete/page.tsx`
  - LP生成完了モーダル（チェックアニメーション、2.5秒自動クローズ）
  - デバイス切替プレビュー（PC / Tablet 768px / SP 390px）
  - フィードバックモーダル UI（送信処理は未実装 → Sprint 5）
  - HTMLダウンロードボタン UI（実装は未実装 → Sprint 5）
- カラーパレット A/B/C 選択・localStorage保存（キー: `lp_wizard_palette`）
- ダークモード対応

### 既知の課題（Sprint 5 へ持ち越し）
- `handleDownloadHtml()` が空実装（TODO）
- `handleFeedbackSubmit()` の送信先が未決定（TODO）

---

## Sprint 5: HTMLダウンロード・フィードバック送信
**ステータス:** 実装完了 - 合格
**実装日:** 2026-04-13
**バグ修正日:** 2026-04-13

### 実装内容
- HTMLジェネレーター: `src/lib/htmlGenerator.ts` を新規作成
  - `generateHtml(data, sectionOrder, sectionLayouts, palette, hiddenSections?)` 関数
  - カラーパレット A（ゴールド）/ B（ブルー）/ C（グリーン）のCSS変数定義
  - S1〜S11 の全セクション × Layout 0/1/2 の実装
  - SKILL.md Phase 2 生成ルール準拠（インラインCSS/JS、外部CDN禁止）
  - FAQアコーディオンJS + ハンバーガーメニューJS
  - レスポンシブ対応（PC: 1024px以上 / SP: 1023px以下）
  - 背景交互ルール（design-system.md § 2 準拠）
  - placeholder.co 使用
  - S9フォーム必須フィールド全件実装
- `/complete` ページの `handleDownloadHtml` 実装（Blob → ObjectURL → a.click）
- `/editor` ページに「HTMLをダウンロード」ボタンを追加（「MDをダウンロード」隣）
- Vitestテストランナーセットアップ（`vitest.config.ts`、`package.json` にtestスクリプト追加）
- ユニットテスト: `src/lib/htmlGenerator.test.ts`（32件）

### 自己評価

| 基準 | スコア (1-5) | コメント |
|------|-------------|---------|
| 機能完全性 | 5 | SKILL.md Phase 2/3 チェックリスト全項目を対象に実装、S1〜S11 × Layout 0/1/2 = 33パターン実装 |
| コード品質 | 4 | 関数分割・セクション別実装でメンテナンス性高い。型安全。大きなファイルになったが可読性は維持 |
| UI/UX | 4 | エディタのMDボタンをゴーストスタイルに変更してHTMLボタンをプライマリに設定し視認性向上 |
| エラーハンドリング | 4 | hiddenSections・デフォルト値・XSS対策（esc関数）を実装 |
| 既存機能との統合 | 5 | ビルド成功、既存機能に影響なし、全32テストPASS |

### 技術的な判断
- パレットB（ブルー）: `#2563EB` / secondary `#0F172A` / alt-bg `#F0F4FF` — design-system.mdのA系を参照してブルー系に対応
- パレットC（グリーン）: `#16A34A` / secondary `#14271A` / alt-bg `#F0FDF4` — 同様にグリーン系
- placeholder URLを `placehold.co`（HTTPSあり）に統一（`placeholder.co` → `placehold.co` の正しいドメイン使用）
- エディタ画面の既存「MDをダウンロード」ボタンのスタイルをゴーストに変更し「HTMLをダウンロード」ボタンをプライマリアクションとして配置

### Evaluatorフィードバックに基づく修正（2026-04-13）

Sprint 5 評価で「LP品質（SKILL.md準拠）」が不合格となり、以下2件を修正した。

**バグ1（Major）修正: デザインシステム定義外の色 `#DC2626` の使用**
- ファイル: `src/lib/htmlGenerator.ts` L1490
- 変更前: `.required { color: #DC2626; font-size: 12px; }`
- 変更後: `.required { color: var(--color-text-light); font-size: 12px; font-weight: 600; }`
- 理由: `#DC2626`（赤）はデザインシステムの8色パレット外の色であり、SKILL.md Phase 3「指定パレットの8色以外の色を使っていないか」に違反していた

**バグ2（Major）修正: S9フォームsubmitボタン文言のハードコード**
- ファイル: `src/lib/htmlGenerator.ts` L687
- 変更前: `<button type="submit" class="btn-primary btn-block">資料を請求する</button>`
- 変更後: `<button type="submit" class="btn-primary btn-block">${esc(data.s2.ctaText)}</button>`
- 理由: 「資料を請求する」固定文言は `s2.ctaText` と不一致になりうるため、SKILL.md Phase 3「CTAボタンの文言がページ内で一貫しているか」に違反していた
- 技術的判断: `renderS9` は `const { s9 } = data;` のみ分割代入しているため、`data.s2.ctaText` とフルパスで参照した

修正後ユニットテスト結果: 32件 Pass / 0件 Fail

### 既知の課題
- フィードバック送信処理（`handleFeedbackSubmit`）の送信先が未決定のままだが、UIは Sprint 4 で実装済みで受け付け状態となっている
- 生成されたHTMLの `placehold.co` URLはネットワーク接続が必要

### Evaluator への引き渡し事項
- 起動方法: `npm run dev` → http://localhost:3000
- テスト対象URL:
  - http://localhost:3000/complete → 「HTMLをダウンロード」ボタンでindex.htmlダウンロード
  - http://localhost:3000/editor → ヘッダーの「HTMLをダウンロード」ボタン
- ユニットテスト実行コマンド: `npm test`
- ユニットテスト結果: 32件 Pass / 0件 Fail
- テストシナリオ:
  1. ウィザードでいくつかのセクションを確定し `/complete` へ進む
  2. 「HTMLをダウンロード」ボタンをクリックし `index.html` がダウンロードされることを確認
  3. ダウンロードした `index.html` をブラウザで開き、LPが正しく表示されることを確認
  4. FAQのアコーディオンをクリックして開閉が動作することを確認
  5. ウィンドウ幅を1023px以下に縮小しハンバーガーメニューが表示されることを確認
  6. `/editor` からも「HTMLをダウンロード」ボタンでindex.htmlがダウンロードできることを確認
  7. カラーパレットをB/Cに変えてHTML生成し、色が変わっていることを確認

---

## Sprint 6: Notion連携
**ステータス:** 未着手（将来計画）
