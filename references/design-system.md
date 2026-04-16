# デザインシステム（design-system.md）

> このファイルはLP生成時のビジュアルルールを定義します。
> Notionデザインシステムにインスパイアされたウォームミニマリズムを採用しています。
> AIはこのルールに厳密に従い、HTMLとCSSを生成してください。
> `references/design.md` に詳細なNotionデザイン仕様があります。

---

## 0. コミュニケーション・プロトコル

- **使用言語**: 日本語
- **トーン**: 信頼感・プロフェッショナル・親しみやすさ
- **専門性**: toB向け。ビジネスパーソンが読むことを前提とする

---

## 1. デザイナーとしての役割と使命

- **役割**: ブランドの視覚表現を統一し、品質を担保するルールブック
- **使命**: デザイナー不在でも一定品質のLPが生成できる状態をつくる
- **デザイン哲学**: Notionにインスパイアされたウォームミニマリズム。グレーに黄褐色のアンダートーンを持つ温かみのあるパレット。

---

## 2. カラーパレット

| トークン名 | カラーコード | 用途 |
|---|---|---|
| --color-primary | #0075de | メインCTA背景、アクセントカラー（Notion Blue） |
| --color-primary-dark | #005bab | CTAホバー時（Active Blue） |
| --color-secondary | #31302e | ヘッダー・フッター背景、テキスト見出し（Warm Dark） |
| --color-text | rgba(0,0,0,0.95) | 本文テキスト（Near-Black） |
| --color-text-light | #615d59 | 補足テキスト、サブコピー（Warm Gray 500） |
| --color-bg | #ffffff | 背景色（基本） |
| --color-bg-alt | #f6f5f4 | 背景色（交互セクション、Warm White） |
| --color-border | rgba(0,0,0,0.1) | カード罫線、区切り線（Whisper Border） |

- **指定ルール**: 上記の8色のみ使用すること
- **背景交互ルール**: S1(白) → S2(白) → S3(alt) → S4(白) → S5(alt) → S6(白) → S7(alt) → S8(白) → S9(alt) → S10(secondary背景) → S11(secondary背景)

### セマンティックカラー（バッジ専用）
- **Badge Blue Bg**: `#f2f9ff` — ピルバッジ背景
- **Badge Blue Text**: `#097fe8` — ピルバッジテキスト

---

## 3. タイポグラフィ

### フォントファミリー
```css
font-family: Inter, -apple-system, system-ui, "Segoe UI", Helvetica, "Hiragino Kaku Gothic ProN", "Noto Sans JP", Arial, sans-serif;
```

### フォントサイズ規定

| 要素 | PC | SP | font-weight | letter-spacing |
|---|---|---|---|---|
| ヒーロー メインコピー | 48px | 32px | 700 | -1.5px |
| セクション見出し | 32px | 24px | 700 | -0.75px |
| セクションラベル（英文） | 12px | 12px | 600 | 0.125px |
| カードタイトル | 20px | 17px | 700 | -0.25px |
| 本文 | 16px | 15px | 400 | normal |
| 補足テキスト | 14px | 13px | 400 | normal |
| ボタンテキスト | 15px | 14px | 600 | normal |

### 行間・字間
- 見出し（ヒーロー）: line-height: 1.1 / letter-spacing: -1.5px〜-2px
- 見出し（セクション）: line-height: 1.2 / letter-spacing: -0.75px
- 本文: line-height: 1.8 / letter-spacing: normal（日本語）
- **Notionの圧縮原則**: フォントサイズが大きくなるほど letter-spacing を負方向に強める

---

## 4. スペーシング（余白体系）

| トークン | 値 | 主な用途 |
|---|---|---|
| --space-xs | 8px | アイコンとテキストの間 |
| --space-sm | 16px | カード内パディング |
| --space-md | 24px | カード間ギャップ |
| --space-lg | 48px | セクション内上下余白 |
| --space-xl | 80px | セクション間上下余白（PC） |
| --space-xl-sp | 56px | セクション間上下余白（SP） |

---

## 5. ボタン

### メインCTA（Notion Blue Primary）
```css
background: var(--color-primary);  /* #0075de */
color: #ffffff;
padding: 8px 16px;
border-radius: 4px;
font-weight: 600;
font-size: 15px;
border: none;
cursor: pointer;
transition: background 0.2s;
```
- ホバー: `background: var(--color-primary-dark);`

### セカンダリボタン（トランスルーセント）
```css
background: rgba(0,0,0,0.05);
color: rgba(0,0,0,0.95);
padding: 8px 16px;
border: 1px solid rgba(0,0,0,0.1);
border-radius: 4px;
font-weight: 600;
font-size: 15px;
cursor: pointer;
transition: all 0.2s;
```
- ホバー: `background: rgba(0,0,0,0.1);`

### テキストリンク
```css
color: var(--color-primary);
text-decoration: underline;
font-weight: 500;
```

---

## 6. カードコンポーネント

```css
background: var(--color-bg);
border: 1px solid rgba(0,0,0,0.1);  /* Whisper Border */
border-radius: 12px;
padding: 24px;
/* Notion 4層シャドウ（最大opacity 0.04） */
box-shadow:
  rgba(0,0,0,0.04) 0px 4px 18px,
  rgba(0,0,0,0.027) 0px 2px 7.8px,
  rgba(0,0,0,0.02) 0px 0.8px 2.9px,
  rgba(0,0,0,0.01) 0px 0.175px 1px;
transition: box-shadow 0.2s;
```
- ホバー: シャドウを強める（各層のopacityを1.5〜2倍）

### バッジ（Pill Badge）
```css
/* Notionのピルバッジスタイル */
background: #f2f9ff;
color: #097fe8;
border-radius: 9999px;
padding: 3px 10px;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.125px;
```

---

## 7. コンテンツ幅とレイアウト

| 要素 | 値 |
|---|---|
| コンテンツ最大幅 | 1200px |
| コンテンツ左右パディング | 24px（PC）/ 16px（SP） |
| カードグリッド gap | 24px |

---

## 8. ヒーローセクション（Hero）の絶対ルール

- **背景色**: var(--color-bg)（白）
- **min-height**: 600px（PC）/ auto（SP）
- **レイアウト**: 左テキスト60% / 右画像40%（PC）、縦積み（SP）
- **メインCTA**: var(--color-primary)（Notion Blue）、白テキスト
- **テキスト色**: rgba(0,0,0,0.95)
- **信頼バッジ**: CTA下部にインライン表示、区切り文字「・」またはピルバッジ形式

---

## 9. ビジュアル規定

### イラストスタイル
- **基本形式**: placeholder.co によるプレースホルダー画像
- **altテキスト**: ビジュアル指示をそのまま記載
- **サイズ**: アスペクト比を維持、max-width: 100%
- **ボーダー**: 画像に `1px solid rgba(0,0,0,0.1)` を付与（Notionのウィスパーボーダー）

### アイコン
- SVGインラインまたはテキスト絵文字は使用しない
- placeholder画像で代替する（MVP）

---

## 10. アニメーション・インタラクション方針

- **対象**: CTAボタンのホバー、カードのホバー、FAQアコーディオンの開閉
- **ルール**: transition は 0.2s ease のみ。派手なアニメーションは禁止
- **スクロールアニメーション**: MVP では不要

---

## 11. ヘッダー・フッター規定

### ヘッダー（S1）
- **ロゴ**: 左配置、高さ32px
- **背景色**: var(--color-bg)（白）
- **PC**: ロゴ・メニュー・CTA横並び
- **SP**: ロゴ + ハンバーガーメニュー、ドロワーは左スライド
- **ナビリンク**: Inter 15px weight 500、near-black テキスト

### フッター（S11）
- **背景色**: var(--color-secondary)（Warm Dark #31302e）
- **文字色**: rgba(255,255,255,0.7)
- **リンクホバー色**: var(--color-primary)（Notion Blue）
- **コピーライト**: 中央揃え、font-size: 13px

---

## 12. 角丸の統一ルール（Notion Border Radius Scale）

| 要素 | border-radius |
|---|---|
| ボタン | 4px（Micro） |
| カード | 12px（Comfortable） |
| 入力フィールド | 4px（Micro） |
| 画像 | 8px（Standard） |
| バッジ（ピル） | 9999px（Full Pill） |
| アバター・丸アイコン | 50%（Circle） |

---

## 13. フォーム入力フィールド

```css
width: 100%;
padding: 6px 10px;
border: 1px solid rgba(0,0,0,0.1);
border-radius: 4px;
font-size: 16px;
background: var(--color-bg);
transition: border-color 0.2s;
```
- フォーカス時: `border-color: var(--color-primary); outline: 2px solid rgba(0,117,222,0.2);`
- ラベル: font-weight: 600、margin-bottom: 8px
- プレースホルダー: color: `#a39e98`（Warm Gray 300）

---

## 14. 深度・エレベーション（Notionシャドウシステム）

| レベル | トリートメント | 用途 |
|---|---|---|
| Flat（0） | シャドウなし、ボーダーなし | ページ背景、テキストブロック |
| Whisper（1） | `1px solid rgba(0,0,0,0.1)` | 標準ボーダー、カード輪郭、区切り線 |
| Soft Card（2） | 4層シャドウスタック（最大opacity 0.04） | コンテンツカード、フィーチャーブロック |
| Deep Card（3） | 5層シャドウスタック（最大opacity 0.05、52pxブラー） | モーダル、フィーチャーパネル |

---

## 15. 禁止事項

- **独自カラーの禁止**: パレット定義外の色は使用しない（`#0A0A1A` など独自カラー厳禁）
- **グラデーションの禁止**: 背景グラデーションは使用しない
- **視認性の確保**: テキストと背景のコントラスト比 4.5:1 以上を維持
- **過剰な装飾**: パターン背景、過剰なアイコン使用は禁止
- **未定義コンポーネント**: このファイルに定義されていないUIコンポーネントは使用しない
- **ゴールド（#FFD700）の使用禁止**: 旧パレットカラーは完全廃止
