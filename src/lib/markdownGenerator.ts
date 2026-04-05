import type { LPData } from "./types";

export function generateMarkdown(data: LPData): string {
  const { s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11 } = data;

  return `# コンテンツ原稿（content-source.md）

> このファイルはLP生成エディタから出力されたコンテンツ原稿です。

---

## S1: Header [固定]

- **メニュー項目**: ${s1.menuItems.join(" / ")}
- **CTA**: ${s1.ctaText}

---

## S2: Hero & Trust Badges [可変]

### コピー
- **メイン**: ${s2.mainCopy}
- **サブ**: ${s2.subCopy}
- **CTA**: ${s2.ctaText}
- **セカンダリCTA**: ${s2.secondaryCtaText}

### Trust Badges
${s2.trustBadges.map((b) => `- ${b}`).join("\n")}

---

## S3: Message [可変]

- **見出し**: ${s3.heading}
- **本文**: ${s3.body}

---

## S4: Problem Identification [可変]

- **セクション見出し**: ${s4.sectionHeading}
- **セクションラベル**: PROBLEMS

### 課題カード

${s4.cards
  .map(
    (card, i) => `**カード${i + 1}**
- アイコン指示: ${card.iconHint}
- 見出し: ${card.heading}
- 説明: ${card.description}`
  )
  .join("\n\n")}

---

## S5: Features & Benefits [可変]

- **セクション見出し**: ${s5.sectionHeading}
- **セクションラベル**: FEATURES

### 特徴カード

${s5.cards
  .map(
    (card, i) => `**カード${i + 1}**
- ポイント番号: ${card.pointLabel}
- タイトル: ${card.title}
- 説明: ${card.description}
- 画像指示: ${card.imageHint}`
  )
  .join("\n\n")}

---

## S6: Categories [可変]

- **セクション見出し**: ${s6.sectionHeading}
- **セクションラベル**: CATEGORIES

### カテゴリカード

| カテゴリ名 | 補足テキスト | 画像指示 |
|---|---|---|
${s6.cards.map((c) => `| ${c.name} | ${c.subText} | ${c.imageHint} |`).join("\n")}

- **CTA1**: ${s6.cta1}
- **CTA2**: ${s6.cta2}

---

## S7: Case Studies [可変]

- **セクション見出し**: ${s7.sectionHeading}
- **セクションラベル**: CASE STUDIES

### 事例カード

${s7.cards
  .map(
    (card, i) => `**事例${i + 1}**
- 企業名: ${card.companyName}
- 画像指示: ${card.imageHint}
- 要約: ${card.summary}`
  )
  .join("\n\n")}

- **導線リンク**: ${s7.linkText}
- **CTA1**: ${s7.cta1}
- **CTA2**: ${s7.cta2}

---

## S8: Implementation Flow [可変]

- **セクション見出し**: ${s8.sectionHeading}
- **セクションラベル**: FLOW

### ステップ

${s8.steps
  .map(
    (step) => `**${step.stepLabel}: ${step.title}**
- アイコン指示: ${step.iconHint}
- 説明: ${step.description}`
  )
  .join("\n\n")}

---

## S9: Lead Form & FAQ [可変]

### FAQ

${s9.faqs.map((faq, i) => `**Q${i + 1}**: ${faq.question}\n**A${i + 1}**: ${faq.answer}`).join("\n\n")}

### フォーム [固定]
- **見出し**: ${s9.formHeading}
- **セクションラベル**: CONTACT
- **フィールド**:
  - お名前 *（テキスト入力 / placeholder: 山田 太郎）
  - 会社名 *（テキスト入力 / placeholder: 株式会社サンプル）
  - メールアドレス *（email入力 / placeholder: example@timee.co.jp）
  - 電話番号 *（tel入力 / placeholder: 03-1234-5678）
  - 従業員数 *（セレクト / 選択してください）
  - プライバシーポリシーに同意する（チェックボックス）
- **送信ボタン**: 資料を請求する

---

## S10: Closing Message [可変]

- **マイクロコピー**: ${s10.microCopy}
- **CTA1**: ${s10.cta1}
- **CTA2**: ${s10.cta2}

---

## S11: Footer [固定]

- **リンク**: ${s11.links.join(" / ")}
- **コピーライト**: ${s11.copyright}
`;
}
