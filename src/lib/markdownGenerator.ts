import type { LPData, SectionKey } from "./types";

export function generateMarkdown(data: LPData, confirmedSections: SectionKey[] = []): string {
  const { s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11 } = data;
  const has = (key: SectionKey) => confirmedSections.includes(key);

  const val = (v: string, active: boolean) => active ? v : "";
  const list = (items: string[], active: boolean) =>
    active ? items.map((b) => `- ${b}`).join("\n") : "";

  const s1Block = `
- **メニュー項目**: ${val(s1.menuItems.join(" / "), has("s1"))}
- **CTA**: ${val(s1.ctaText, has("s1"))}
`;

  const s2Block = `
### コピー
- **メイン**: ${val(s2.mainCopy, has("s2"))}
- **サブ**: ${val(s2.subCopy, has("s2"))}
- **CTA**: ${val(s2.ctaText, has("s2"))}
- **セカンダリCTA**: ${val(s2.secondaryCtaText, has("s2"))}

### Trust Badges
${list(s2.trustBadges, has("s2"))}
`;

  const s3Block = `
- **見出し**: ${val(s3.heading, has("s3"))}
- **本文**: ${val(s3.body, has("s3"))}
`;

  const s4Block = `
- **セクション見出し**: ${val(s4.sectionHeading, has("s4"))}
- **セクションラベル**: PROBLEMS

### 課題カード

${has("s4") ? s4.cards
  .map(
    (card, i) => `**カード${i + 1}**
- アイコン指示: ${card.iconHint}
- 見出し: ${card.heading}
- 説明: ${card.description}`
  )
  .join("\n\n") : `**カード1**
- アイコン指示:
- 見出し:
- 説明: `}
`;

  const s5Block = `
- **セクション見出し**: ${val(s5.sectionHeading, has("s5"))}
- **セクションラベル**: FEATURES

### 特徴カード

${has("s5") ? s5.cards
  .map(
    (card, i) => `**カード${i + 1}**
- ポイント番号: ${card.pointLabel}
- タイトル: ${card.title}
- 説明: ${card.description}
- 画像指示: ${card.imageHint}`
  )
  .join("\n\n") : `**カード1**
- ポイント番号:
- タイトル:
- 説明:
- 画像指示: `}
`;

  const s6Block = `
- **セクション見出し**: ${val(s6.sectionHeading, has("s6"))}
- **セクションラベル**: CATEGORIES

### カテゴリカード

| カテゴリ名 | 補足テキスト | 画像指示 |
|---|---|---|
${has("s6") ? s6.cards.map((c) => `| ${c.name} | ${c.subText} | ${c.imageHint} |`).join("\n") : "|  |  |  |"}

- **CTA1**: ${val(s6.cta1, has("s6"))}
- **CTA2**: ${val(s6.cta2, has("s6"))}
`;

  const s7Block = `
- **セクション見出し**: ${val(s7.sectionHeading, has("s7"))}
- **セクションラベル**: CASE STUDIES

### 事例カード

${has("s7") ? s7.cards
  .map(
    (card, i) => `**事例${i + 1}**
- 企業名: ${card.companyName}
- 画像指示: ${card.imageHint}
- 要約: ${card.summary}`
  )
  .join("\n\n") : `**事例1**
- 企業名:
- 画像指示:
- 要約: `}

- **導線リンク**: ${val(s7.linkText, has("s7"))}
- **CTA1**: ${val(s7.cta1, has("s7"))}
- **CTA2**: ${val(s7.cta2, has("s7"))}
`;

  const s8Block = `
- **セクション見出し**: ${val(s8.sectionHeading, has("s8"))}
- **セクションラベル**: FLOW

### ステップ

${has("s8") ? s8.steps
  .map(
    (step) => `**${step.stepLabel}: ${step.title}**
- アイコン指示: ${step.iconHint}
- 説明: ${step.description}`
  )
  .join("\n\n") : `**STEP 1: **
- アイコン指示:
- 説明: `}
`;

  const s9Block = `
### FAQ

${has("s9") ? s9.faqs.map((faq, i) => `**Q${i + 1}**: ${faq.question}\n**A${i + 1}**: ${faq.answer}`).join("\n\n") : `**Q1**: \n**A1**: `}

### フォーム [固定]
- **見出し**: ${val(s9.formHeading, has("s9"))}
- **セクションラベル**: CONTACT
- **フィールド**:
  - お名前 *（テキスト入力 / placeholder: 山田 太郎）
  - 会社名 *（テキスト入力 / placeholder: 株式会社サンプル）
  - メールアドレス *（email入力 / placeholder: example@timee.co.jp）
  - 電話番号 *（tel入力 / placeholder: 03-1234-5678）
  - 従業員数 *（セレクト / 選択してください）
  - プライバシーポリシーに同意する（チェックボックス）
- **送信ボタン**: 資料を請求する
`;

  const s10Block = `
- **マイクロコピー**: ${val(s10.microCopy, has("s10"))}
- **CTA1**: ${val(s10.cta1, has("s10"))}
- **CTA2**: ${val(s10.cta2, has("s10"))}
`;

  const s11Block = `
- **リンク**: ${val(s11.links.join(" / "), has("s11"))}
- **コピーライト**: ${val(s11.copyright, has("s11"))}
`;

  return `# コンテンツ原稿（content-source.md）

> このファイルはLP生成エディタから出力されたコンテンツ原稿です。

---

## S1: Header [固定]
${s1Block}
---

## S2: Hero & Trust Badges [可変]
${s2Block}
---

## S3: Message [可変]
${s3Block}
---

## S4: Problem Identification [可変]
${s4Block}
---

## S5: Features & Benefits [可変]
${s5Block}
---

## S6: Categories [可変]
${s6Block}
---

## S7: Case Studies [可変]
${s7Block}
---

## S8: Implementation Flow [可変]
${s8Block}
---

## S9: Lead Form & FAQ [可変]
${s9Block}
---

## S10: Closing Message [可変]
${s10Block}
---

## S11: Footer [固定]
${s11Block}`;
}
