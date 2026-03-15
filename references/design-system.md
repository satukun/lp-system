# デザインシステム（design-system.md）

> このファイルはLP生成時のビジュアルルールを定義します。
> AIはこのルールに厳密に従い、HTMLとCSSを生成してください。
> ここに定義されていないスタイルは使用しないでください。

---

## 0. コミュニケーション・プロトコル

- **使用言語**: 日本語
- **トーン**: 信頼感・プロフェッショナル・親しみやすさ
- **専門性**: toB向け。ビジネスパーソンが読むことを前提とする

---

## 1. デザイナーとしての役割と使命

- **役割**: ブランドの視覚表現を統一し、品質を担保するルールブック
- **使命**: デザイナー不在でも一定品質のLPが生成できる状態をつくる

---

## 2. カラーパレット

| トークン名 | カラーコード | 用途 |
|---|---|---|
| --color-primary | #FFD700 | メインCTA背景、アクセントカラー |
| --color-primary-dark | #E6C200 | CTAホバー時 |
| --color-secondary | #1A1A2E | ヘッダー・フッター背景、テキスト見出し |
| --color-text | #333333 | 本文テキスト |
| --color-text-light | #666666 | 補足テキスト、サブコピー |
| --color-bg | #FFFFFF | 背景色（基本） |
| --color-bg-alt | #F5F5F0 | 背景色（交互セクション） |
| --color-border | #E0E0E0 | カード罫線、区切り線 |

- **指定ルール**: 上記の8色のみ使用すること
- **背景交互ルール**: S1(白) → S2(白) → S3(alt) → S4(白) → S5(alt) → S6(白) → S7(alt) → S8(白) → S9(alt) → S10(primary-dark背景) → S11(secondary背景)

---

## 3. タイポグラフィ

### フォントファミリー
```css
font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
```

### フォントサイズ規定

| 要素 | PC | SP | font-weight |
|---|---|---|---|
| ヒーロー メインコピー | 40px | 28px | 700 |
| セクション見出し | 28px | 22px | 700 |
| セクションラベル（英文） | 12px | 12px | 600 |
| カードタイトル | 18px | 16px | 600 |
| 本文 | 16px | 15px | 400 |
| 補足テキスト | 14px | 13px | 400 |
| ボタンテキスト | 16px | 15px | 600 |

### 行間・字間
- 見出し: line-height: 1.4 / letter-spacing: 0.02em
- 本文: line-height: 1.8 / letter-spacing: 0.04em

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

### メインCTA
```css
background: var(--color-primary);
color: var(--color-secondary);
padding: 16px 32px;
border-radius: 8px;
font-weight: 600;
font-size: 16px;
border: none;
cursor: pointer;
transition: background 0.2s;
```
- ホバー: `background: var(--color-primary-dark);`

### セカンダリボタン（ゴースト型）
```css
background: transparent;
color: var(--color-secondary);
padding: 16px 32px;
border: 2px solid var(--color-secondary);
border-radius: 8px;
font-weight: 600;
font-size: 16px;
cursor: pointer;
transition: all 0.2s;
```
- ホバー: `background: var(--color-secondary); color: #FFFFFF;`

### テキストリンク
```css
color: var(--color-primary-dark);
text-decoration: underline;
font-weight: 500;
```

---

## 6. カードコンポーネント

```css
background: var(--color-bg);
border: 1px solid var(--color-border);
border-radius: 12px;
padding: 24px;
transition: box-shadow 0.2s;
```
- ホバー: `box-shadow: 0 4px 16px rgba(0,0,0,0.08);`

### カードのバリエーション
- **課題カード（S4）**: アイコン上・見出し中・説明下、中央揃え
- **特徴カード（S5）**: ポイントバッジ左上・タイトル・説明・画像指示
- **業種カード（S6）**: 画像上・カテゴリ名・補足テキスト
- **事例カード（S7）**: 画像上・企業名太字・課題と成果の要約

---

## 7. コンテンツ幅とレイアウト

| 要素 | 値 |
|---|---|
| コンテンツ最大幅 | 1080px |
| コンテンツ左右パディング | 24px（PC）/ 16px（SP） |
| カードグリッド gap | 24px |

---

## 8. ヒーローセクション（Hero）の絶対ルール

- **背景色**: var(--color-bg)（白）
- **min-height**: 600px（PC）/ auto（SP）
- **レイアウト**: 左テキスト60% / 右画像40%（PC）、縦積み（SP）
- **メインCTA**: var(--color-primary) 背景
- **テキスト色**: var(--color-secondary)
- **信頼バッジ**: CTA下部にインライン表示、区切り文字「・」

---

## 9. ビジュアル規定

### イラストスタイル
- **基本形式**: placeholder.co によるプレースホルダー画像
- **altテキスト**: ビジュアル指示をそのまま記載
- **サイズ**: アスペクト比を維持、max-width: 100%

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

### フッター（S11）
- **背景色**: var(--color-secondary)
- **文字色**: #FFFFFF
- **リンクホバー色**: var(--color-primary)
- **コピーライト**: 中央揃え、font-size: 13px

---

## 12. 角丸の統一ルール

| 要素 | border-radius |
|---|---|
| ボタン | 8px |
| カード | 12px |
| 入力フィールド | 6px |
| 画像 | 8px |
| バッジ | 4px |

---

## 13. フォーム入力フィールド

```css
width: 100%;
padding: 12px 16px;
border: 1px solid var(--color-border);
border-radius: 6px;
font-size: 16px;
background: var(--color-bg);
transition: border-color 0.2s;
```
- フォーカス時: `border-color: var(--color-primary);`
- ラベル: font-weight: 600、margin-bottom: 8px

---

## 14. 禁止事項

- **影の禁止**: box-shadow はカードホバー時のみ許可。それ以外の影は禁止
- **グラデーションの禁止**: 背景グラデーションは使用しない
- **文字色の制限**: パレット定義外の色は使用しない
- **視認性の確保**: テキストと背景のコントラスト比 4.5:1 以上を維持
- **過剰な装飾**: ボーダー装飾、パターン背景、過剰なアイコン使用は禁止
- **未定義コンポーネント**: このファイルに定義されていないUIコンポーネントは使用しない
