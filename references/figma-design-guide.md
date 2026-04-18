# Figma デザイン設計ガイド

> このガイドはFigmaでLPセクションのフルデザインを作成するための設計仕様書です。
> デザイナー・Claude・マーケターの全員が参照する共通ルールブックです。

---

## 1. Figmaファイル構成

### ファイル情報
- **fileKey**: `jpGxPuHcGbWRXxCAPFotBf`
- **チーム**: YO.Tec Professional
- **URL**: `https://www.figma.com/design/jpGxPuHcGbWRXxCAPFotBf/lp-system`

### ページ構成

| ページ名 | 役割 | 編集者 |
|----------|------|--------|
| `_Design System` | カラー・タイポグラフィ・コンポーネント仕様書 | デザイナー |
| `Pattern Overview` | 全パターンのサムネイル（100×65）一覧。ウィザードのLayoutPickerに使用 | Claude自動生成 |
| `S1 Header` | S1セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S2 Hero` | S2セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S3 Message` | S3セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S4 Problem` | S4セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S5 Features` | S5セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S6 Categories` | S6セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S7 Case Studies` | S7セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S8 Flow` | S8セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S9 FAQ & Form` | S9セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S10 Closing CTA` | S10セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |
| `S11 Footer` | S11セクションのパターンA/B/C/Dフルデザイン | デザイナー・Claude |

---

## 2. フレーム命名規則

各セクションページ内のフレーム名は以下の形式を厳守する。

```
{sectionKey}/{patternLabel}

例:
  s1/A   → S1 Header パターンA
  s2/B   → S2 Hero パターンB
  s9/D   → S9 FAQ & Form パターンD
```

### フレームサイズ（PC デスクトップ基準）

| セクション | 幅 | 高さ目安 |
|---|---|---|
| S1 Header | 1440px | 80px |
| S2 Hero | 1440px | 600px |
| S3 Message | 1440px | 320px |
| S4 Problem | 1440px | 480px |
| S5 Features | 1440px | 480px |
| S6 Categories | 1440px | 560px |
| S7 Case Studies | 1440px | 560px |
| S8 Flow | 1440px | 400px |
| S9 FAQ & Form | 1440px | 640px |
| S10 Closing CTA | 1440px | 320px |
| S11 Footer | 1440px | 200px |

> コンテンツ量によって高さは可変。幅は1440px固定。

---

## 3. レイヤー命名規則（ウィザードフォームとの連携）

テキストレイヤーの名前がウィザードの入力フォームと1対1で対応する。
この命名規則を守ることで `sync-from-figma` スクリプトが自動的にフォーム項目を抽出できる。

### 命名フォーマット

```
{fieldName}/{index}

例:
  mainCopy/0       → ウィザード「メインコピー」フォーム
  subCopy/0        → ウィザード「サブコピー」フォーム
  ctaText/0        → ウィザード「CTAテキスト」フォーム
  cards/0/title    → ウィザード「カード1タイトル」フォーム
  steps/2/body     → ウィザード「ステップ3本文」フォーム
```

### セクション別レイヤー名一覧

#### S1 Header
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `logoText/0` | ロゴ表示テキスト | ロゴテキスト |
| `navItems/0` | ナビ項目1 | メニュー1 |
| `navItems/1` | ナビ項目2 | メニュー2 |
| `navItems/2` | ナビ項目3 | メニュー3 |
| `navItems/3` | ナビ項目4 | メニュー4 |
| `ctaText/0` | ヘッダーCTAボタン | CTAテキスト |

#### S2 Hero
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `badge/0` | ピルバッジ | バッジテキスト |
| `mainCopy/0` | メインコピー | メインコピー |
| `subCopy/0` | サブコピー | サブコピー |
| `ctaText/0` | プライマリCTA | CTAテキスト |
| `trustBadges/0` | 信頼指標1 | 信頼バッジ1 |
| `trustBadges/1` | 信頼指標2 | 信頼バッジ2 |
| `trustBadges/2` | 信頼指標3 | 信頼バッジ3 |

#### S3 Message
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `sectionLabel/0` | セクションラベル（英文） | セクションラベル |
| `heading/0` | セクション見出し | 見出し |
| `body/0` | 本文 | 本文 |

#### S4 Problem Identification
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `sectionLabel/0` | セクションラベル | セクションラベル |
| `heading/0` | セクション見出し | 見出し |
| `cards/0/title` | カード1タイトル | 課題カード1タイトル |
| `cards/0/body` | カード1本文 | 課題カード1本文 |
| `cards/1/title` | カード2タイトル | 課題カード2タイトル |
| `cards/1/body` | カード2本文 | 課題カード2本文 |
| `cards/2/title` | カード3タイトル | 課題カード3タイトル |
| `cards/2/body` | カード3本文 | 課題カード3本文 |

#### S5 Features & Benefits
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `sectionLabel/0` | セクションラベル | セクションラベル |
| `heading/0` | セクション見出し | 見出し |
| `cards/0/point` | カード1ポイント番号 | ポイント1ラベル |
| `cards/0/title` | カード1タイトル | 特徴1タイトル |
| `cards/0/body` | カード1本文 | 特徴1本文 |
| `cards/1/point` | カード2ポイント番号 | ポイント2ラベル |
| `cards/1/title` | カード2タイトル | 特徴2タイトル |
| `cards/1/body` | カード2本文 | 特徴2本文 |
| `cards/2/point` | カード3ポイント番号 | ポイント3ラベル |
| `cards/2/title` | カード3タイトル | 特徴3タイトル |
| `cards/2/body` | カード3本文 | 特徴3本文 |

#### S6 Categories
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `sectionLabel/0` | セクションラベル | セクションラベル |
| `heading/0` | セクション見出し | 見出し |
| `cards/0/title` | カテゴリ1名 | カテゴリ1名 |
| `cards/0/body` | カテゴリ1補足 | カテゴリ1補足 |
| `cards/1/title` | カテゴリ2名 | カテゴリ2名 |
| `cards/1/body` | カテゴリ2補足 | カテゴリ2補足 |
| `cards/2/title` | カテゴリ3名 | カテゴリ3名 |
| `cards/2/body` | カテゴリ3補足 | カテゴリ3補足 |
| `cards/3/title` | カテゴリ4名 | カテゴリ4名 |
| `cards/3/body` | カテゴリ4補足 | カテゴリ4補足 |
| `cards/4/title` | カテゴリ5名 | カテゴリ5名 |
| `cards/4/body` | カテゴリ5補足 | カテゴリ5補足 |
| `cards/5/title` | カテゴリ6名 | カテゴリ6名 |
| `cards/5/body` | カテゴリ6補足 | カテゴリ6補足 |
| `ctaText/0` | プライマリCTA | CTAテキスト |
| `ctaText/1` | セカンダリCTA | セカンダリCTAテキスト |

#### S7 Case Studies
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `sectionLabel/0` | セクションラベル | セクションラベル |
| `heading/0` | セクション見出し | 見出し |
| `cards/0/company` | 企業名1 | 事例1企業名 |
| `cards/0/body` | 事例1概要 | 事例1本文 |
| `cards/1/company` | 企業名2 | 事例2企業名 |
| `cards/1/body` | 事例2概要 | 事例2本文 |
| `cards/2/company` | 企業名3 | 事例3企業名 |
| `cards/2/body` | 事例3概要 | 事例3本文 |
| `moreLink/0` | 「他の事例を見る」リンク | もっと見るリンク |
| `ctaText/0` | プライマリCTA | CTAテキスト |

#### S8 Implementation Flow
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `sectionLabel/0` | セクションラベル | セクションラベル |
| `heading/0` | セクション見出し | 見出し |
| `steps/0/title` | ステップ1タイトル | ステップ1タイトル |
| `steps/0/body` | ステップ1説明 | ステップ1説明 |
| `steps/1/title` | ステップ2タイトル | ステップ2タイトル |
| `steps/1/body` | ステップ2説明 | ステップ2説明 |
| `steps/2/title` | ステップ3タイトル | ステップ3タイトル |
| `steps/2/body` | ステップ3説明 | ステップ3説明 |
| `steps/3/title` | ステップ4タイトル | ステップ4タイトル |
| `steps/3/body` | ステップ4説明 | ステップ4説明 |

#### S9 FAQ & Lead Form
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `sectionLabel/0` | セクションラベル | セクションラベル |
| `heading/0` | セクション見出し | 見出し |
| `faqs/0/question` | FAQ質問1 | FAQ1質問 |
| `faqs/0/answer` | FAQ回答1 | FAQ1回答 |
| `faqs/1/question` | FAQ質問2 | FAQ2質問 |
| `faqs/1/answer` | FAQ回答2 | FAQ2回答 |
| `faqs/2/question` | FAQ質問3 | FAQ3質問 |
| `faqs/2/answer` | FAQ回答3 | FAQ3回答 |
| `faqs/3/question` | FAQ質問4 | FAQ4質問 |
| `faqs/3/answer` | FAQ回答4 | FAQ4回答 |
| `faqs/4/question` | FAQ質問5 | FAQ5質問 |
| `faqs/4/answer` | FAQ回答5 | FAQ5回答 |
| `formHeading/0` | フォーム見出し | フォーム見出し |
| `ctaText/0` | 送信ボタン | 送信ボタンテキスト |

#### S10 Closing CTA
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `heading/0` | クロージング見出し | 見出し |
| `subCopy/0` | サブコピー | サブコピー |
| `ctaText/0` | プライマリCTA | CTAテキスト |
| `ctaText/1` | セカンダリCTA | セカンダリCTAテキスト |

#### S11 Footer
| レイヤー名 | 内容 | フォーム項目 |
|---|---|---|
| `logoText/0` | フッターロゴ | ロゴテキスト |
| `links/0` | リンク1テキスト | リンク1 |
| `links/1` | リンク2テキスト | リンク2 |
| `links/2` | リンク3テキスト | リンク3 |
| `links/3` | リンク4テキスト | リンク4 |
| `links/4` | リンク5テキスト | リンク5 |
| `copyright/0` | コピーライト | コピーライト |

---

## 4. デザイン仕様早見表（design-system.md 参照）

### カラーパレット

| トークン | カラーコード | 用途 |
|---|---|---|
| Primary | `#0075de` | CTAボタン・アクセント（Notion Blue） |
| Primary Dark | `#005bab` | CTAホバー |
| Secondary | `#31302e` | ヘッダー・フッター背景（Warm Dark） |
| Text | `rgba(0,0,0,0.95)` | 本文 |
| Text Light | `#615d59` | サブコピー・補足（Warm Gray 500） |
| BG | `#ffffff` | 白背景 |
| BG Alt | `#f6f5f4` | 薄グレー背景（Warm White） |
| Border | `rgba(0,0,0,0.1)` | 罫線 |

### タイポグラフィ

| 要素 | サイズ | 太さ | letter-spacing |
|---|---|---|---|
| ヒーローコピー | 48px | 700 | -1.5px |
| セクション見出し | 32px | 700 | -0.75px |
| セクションラベル | 12px | 600 | +0.125px |
| カードタイトル | 20px | 700 | -0.25px |
| 本文 | 16px | 400 | normal |
| 補足テキスト | 14px | 400 | normal |
| ボタン | 15px | 600 | normal |

### CTAボタン

- **プライマリ**: bg `#0075de` / text `#ffffff` / padding `8px 16px` / radius `4px`
- **セカンダリ**: bg `rgba(0,0,0,0.05)` / border `1px solid rgba(0,0,0,0.1)` / radius `4px`

### カード

- bg `#ffffff` / border `1px solid rgba(0,0,0,0.1)` / radius `12px` / padding `24px`
- shadow: `rgba(0,0,0,0.04) 0px 4px 18px` + 3層の軽いシャドウ

### バッジ（ピル）

- bg `#f2f9ff` / text `#097fe8` / radius `9999px` / padding `3px 10px` / 12px 600

### スペーシング

| トークン | 値 |
|---|---|
| XS | 8px |
| SM | 16px |
| MD | 24px |
| LG | 48px |
| XL | 80px（セクション上下） |

---

## 5. 背景交互ルール

| セクション | 背景色 |
|---|---|
| S1 Header | `#ffffff` |
| S2 Hero | `#ffffff` |
| S3 Message | `#f6f5f4` |
| S4 Problem | `#ffffff` |
| S5 Features | `#f6f5f4` |
| S6 Categories | `#ffffff` |
| S7 Case Studies | `#f6f5f4` |
| S8 Flow | `#ffffff` |
| S9 FAQ & Form | `#f6f5f4` |
| S10 Closing CTA | `#005bab`（Primary Dark） |
| S11 Footer | `#31302e`（Secondary） |

---

## 6. デザイン作成フロー

### デザイナーが新パターンを追加するとき

```
1. 対象セクションのFigmaページを開く（例: S2 Hero）
2. 既存パターン（A）を参考に新しいフレームを作成
3. フレーム名を {sectionKey}/{patternLabel} にする（例: s2/E）
4. テキストレイヤーに 3節の命名規則を付ける
5. design-system.md のカラー・タイポグラフィに準拠する
6. Claudeに「s2/Eをコードに反映して」と依頼
```

### ClaudeがFigmaからコードに反映するとき（ルートB）

```
1. get_design_context でフレームのデザインを読み取る
2. レイヤー名からフォーム項目マッピングを確認
3. SectionRenderer.tsx に layout === N の JSX を追加
4. htmlGenerator.ts に layout === N の HTML を追加
5. sectionLayouts.ts の blocks 配列を更新（サムネイル用）
6. npm run build でエラーチェック
7. npm run sync-from-figma で同期確認
```

---

## 7. sync-from-figma の仕組み

`Pattern Overview` ページのフレーム名（`s2/A` 形式）と `sectionLayouts.ts` の定義を比較し、差分をレポートする。

- **Figmaにあってコードにない** → コードに追加が必要（Claude経由）
- **コードにあってFigmaにない** → Figmaにフレームを追加が必要（デザイナー経由）
- **両方に存在** → 同期済み ✅

> 現在はフレームの「存在確認」のみ。将来的にはデザイン内容の差分チェックも追加予定。

---

*最終更新: 2026-04-16*
