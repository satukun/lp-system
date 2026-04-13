/**
 * Sprint 5 E2E テスト
 * 受け入れ基準:
 * - ダウンロードした index.html をブラウザで開いてLPが正しく表示されること
 * - SKILL.md の Phase 3 チェックリスト全11項目をパスすること
 * - 指定カラーパレット以外の色が使われていないこと
 * - PC・SPのレスポンシブが正しく動作すること
 * - /complete の「HTMLをダウンロード」ボタン実装
 * - /editor の「HTMLをダウンロード」ボタン実装
 * - フィードバック送信処理（UIが動作すること）
 */

import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import os from "os";

// ────────────────────────────────────────────
// ヘルパー: localStorage にウィザードデータをセット
// ────────────────────────────────────────────
async function seedWizardData(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(() => {
    const data = {
      s1: { ctaText: "無料で資料請求", menuItems: ["特徴", "料金", "事例", "FAQ"] },
      s2: { mainCopy: "スキマバイト採用をもっとスマートに", subCopy: "業界最安値でリアルタイムマッチング", ctaText: "無料で資料請求", secondaryCtaText: "デモを見る", trustBadges: ["導入1000社以上", "No.1", "満足度98%"] },
      s3: { heading: "採用課題を一気に解決", body: "スキマバイトのマッチングを完全自動化するSaaSです。" },
      s4: { sectionHeading: "こんなお悩みありませんか？", cards: [
        { heading: "採用コストが高い", description: "従来の採用は費用がかかりすぎる", iconHint: "コストアイコン" },
        { heading: "採用に時間がかかる", description: "応募から採用まで時間ロス", iconHint: "時計アイコン" },
        { heading: "定着率が低い", description: "採用してもすぐ辞めてしまう", iconHint: "離職アイコン" },
      ]},
      s5: { sectionHeading: "選ばれる3つの理由", cards: [
        { pointLabel: "POINT1", title: "コスト削減", description: "採用コストを50%カット", imageHint: "コスト削減イメージ" },
        { pointLabel: "POINT2", title: "スピード採用", description: "最短1日でマッチング", imageHint: "スピードイメージ" },
        { pointLabel: "POINT3", title: "高定着率", description: "定着率90%以上", imageHint: "定着率イメージ" },
      ]},
      s6: { sectionHeading: "対応業種", cta1: "無料で資料請求", cta2: "デモを見る", cards: [
        { name: "飲食", subText: "レストラン・カフェ", imageHint: "飲食イメージ" },
        { name: "小売", subText: "コンビニ・スーパー", imageHint: "小売イメージ" },
        { name: "物流", subText: "倉庫・配送", imageHint: "物流イメージ" },
        { name: "介護", subText: "デイサービス・施設", imageHint: "介護イメージ" },
        { name: "IT", subText: "システム開発", imageHint: "ITイメージ" },
        { name: "製造", subText: "工場・ライン", imageHint: "製造イメージ" },
      ]},
      s7: { sectionHeading: "導入事例", linkText: "他の導入事例を見る", cta1: "無料で資料請求", cta2: "デモを見る", cards: [
        { companyName: "A社", summary: "採用コスト半減", imageHint: "A社イメージ" },
        { companyName: "B社", summary: "応募数3倍", imageHint: "B社イメージ" },
        { companyName: "C社", summary: "定着率向上", imageHint: "C社イメージ" },
      ]},
      s8: { sectionHeading: "お申込みの流れ", steps: [
        { title: "お問い合わせ", description: "フォームから送信", iconHint: "フォームアイコン" },
        { title: "ヒアリング", description: "担当者が連絡", iconHint: "電話アイコン" },
        { title: "契約", description: "プランを選択", iconHint: "契約アイコン" },
        { title: "運用開始", description: "最短翌日から利用可能", iconHint: "ロケットアイコン" },
      ]},
      s9: { formHeading: "まずは無料で資料請求", faqs: [
        { question: "費用はいくらですか？", answer: "月額3万円から利用できます。" },
        { question: "すぐに使えますか？", answer: "最短翌営業日から利用できます。" },
        { question: "サポートはありますか？", answer: "専任担当者がサポートします。" },
        { question: "契約期間は？", answer: "最低1ヶ月から契約可能です。" },
        { question: "無料トライアルは？", answer: "14日間の無料トライアルがあります。" },
      ]},
      s10: { microCopy: "まずは資料請求してみませんか？", cta1: "無料で資料請求", cta2: "デモを見る" },
      s11: { links: ["アプリについて", "サポート", "プライバシーポリシー", "利用規約", "電子公告"], copyright: "© 2024 LP Systems. All rights reserved." },
    };
    const layouts = { s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, s6: 0, s7: 0, s8: 0, s9: 0, s10: 0, s11: 0 };
    const confirmed = ["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","s11"];
    localStorage.setItem("lp_wizard_data", JSON.stringify(data));
    localStorage.setItem("lp_wizard_layouts", JSON.stringify(layouts));
    localStorage.setItem("lp_wizard_confirmed", JSON.stringify(confirmed));
    localStorage.setItem("lp_wizard_palette", "A");
  });
}

// ────────────────────────────────────────────
// 1. /complete ページに「HTMLをダウンロード」ボタンが存在する
// ────────────────────────────────────────────
test("complete page has HTML download button", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");
  const buttons = page.getByRole("button", { name: /HTMLをダウンロード/ });
  await expect(buttons.first()).toBeVisible();
});

// ────────────────────────────────────────────
// 2. /complete の「HTMLをダウンロード」ボタンで index.html がダウンロードされる
// ────────────────────────────────────────────
test("complete page - HTML download produces index.html", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  expect(download.suggestedFilename()).toBe("index.html");

  // ダウンロード内容を検証
  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-complete.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  // DOCTYPE と html タグ
  expect(content).toContain("<!DOCTYPE html>");
  expect(content).toContain('<html lang="ja">');
  expect(content).toContain("</html>");
});

// ────────────────────────────────────────────
// 3. /editor ページに「HTMLをダウンロード」ボタンが存在する
// ────────────────────────────────────────────
test("editor page has HTML download button", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/editor");
  const btn = page.getByRole("button", { name: /HTMLをダウンロード/ });
  await expect(btn).toBeVisible();
});

// ────────────────────────────────────────────
// 4. /editor の「HTMLをダウンロード」ボタンで index.html がダウンロードされる
// ────────────────────────────────────────────
test("editor page - HTML download produces index.html", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/editor");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).click(),
  ]);

  expect(download.suggestedFilename()).toBe("index.html");

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-editor.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");
  expect(content).toContain("<!DOCTYPE html>");
});

// ────────────────────────────────────────────
// 5. 生成HTMLにセクションコメント(S1〜S11)が含まれる
// ────────────────────────────────────────────
test("generated HTML contains section comments S1 to S11", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-sections.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  // 各セクションのコメントが含まれること
  expect(content).toContain("<!-- S1: Header");
  expect(content).toContain("<!-- S2: Hero");
  expect(content).toContain("<!-- S3: Message");
  expect(content).toContain("<!-- S4: Problems");
  expect(content).toContain("<!-- S5: Features");
  expect(content).toContain("<!-- S6: Categories");
  expect(content).toContain("<!-- S7: Case Studies");
  expect(content).toContain("<!-- S8: Flow");
  expect(content).toContain("<!-- S9: Form");
  expect(content).toContain("<!-- S10: Closing");
  expect(content).toContain("<!-- S11: Footer");
});

// ────────────────────────────────────────────
// 6. 生成HTMLがSKILL.md準拠: パレットA のCSS変数が定義されている
// ────────────────────────────────────────────
test("generated HTML contains palette A CSS variables", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-palette.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  // パレットA の8色CSS変数が定義されていること
  expect(content).toContain("--color-primary: #FFD700");
  expect(content).toContain("--color-primary-dark: #E6C200");
  expect(content).toContain("--color-secondary: #1A1A2E");
  expect(content).toContain("--color-text: #333333");
  expect(content).toContain("--color-text-light: #666666");
  expect(content).toContain("--color-bg: #FFFFFF");
  expect(content).toContain("--color-bg-alt: #F5F5F0");
  expect(content).toContain("--color-border: #E0E0E0");

  // 外部CDNが含まれていないこと
  expect(content).not.toContain("cdn.jsdelivr.net");
  expect(content).not.toContain("cdnjs.cloudflare.com");
  expect(content).not.toContain("unpkg.com");
});

// ────────────────────────────────────────────
// 7. 生成HTML: S9フォームの必須フィールド6種が存在する
// ────────────────────────────────────────────
test("generated HTML contains S9 form required fields", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-form.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  // 必須フィールド6種: お名前、会社名、メールアドレス、電話番号、従業員数、プライバシーポリシー同意
  expect(content).toContain("お名前");
  expect(content).toContain("会社名");
  expect(content).toContain("メールアドレス");
  expect(content).toContain("電話番号");
  expect(content).toContain("従業員数");
  expect(content).toContain("プライバシーポリシー");
  // required属性が設定されていること
  const requiredCount = (content.match(/required/g) || []).length;
  expect(requiredCount).toBeGreaterThanOrEqual(5);
});

// ────────────────────────────────────────────
// 8. 生成HTML: FAQアコーディオンJSが実装されている
// ────────────────────────────────────────────
test("generated HTML contains FAQ accordion JS", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-js.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  // FAQアコーディオンJS
  expect(content).toContain("faq-question");
  expect(content).toContain("faq-answer");
  expect(content).toContain("aria-expanded");
  // ハンバーガーメニューJS
  expect(content).toContain("hamburger");
  expect(content).toContain("drawer");
});

// ────────────────────────────────────────────
// 9. 生成HTML: headerのstickyが実装されている
// ────────────────────────────────────────────
test("generated HTML header has sticky positioning", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-sticky.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  expect(content).toContain("position: sticky");
});

// ────────────────────────────────────────────
// 10. 生成HTML: レスポンシブメディアクエリが含まれる
// ────────────────────────────────────────────
test("generated HTML contains responsive media query", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-responsive.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  // PC/SP ブレイクポイント
  expect(content).toContain("@media");
  expect(content).toContain("1023px");
});

// ────────────────────────────────────────────
// 11. 生成HTML: フッターにリンクが含まれる
// ────────────────────────────────────────────
test("generated HTML footer contains links", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-footer.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  // フッターリンク
  expect(content).toContain("アプリについて");
  expect(content).toContain("プライバシーポリシー");
  expect(content).toContain("利用規約");
  // コピーライト
  expect(content).toContain("©");
});

// ────────────────────────────────────────────
// 12. 生成HTML: alt テキストが画像に設定されている
// ────────────────────────────────────────────
test("generated HTML images have alt text", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-alt.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  // imgタグにalt属性が含まれている
  const imgTags = content.match(/<img[^>]+>/g) || [];
  expect(imgTags.length).toBeGreaterThan(0);
  for (const tag of imgTags) {
    expect(tag).toContain('alt="');
  }
});

// ────────────────────────────────────────────
// 13. 生成HTML: パレットBで色変換される
// ────────────────────────────────────────────
test("generated HTML with palette B uses blue color variables", async ({ page }) => {
  await seedWizardData(page);
  // パレットBに変更
  await page.evaluate(() => {
    localStorage.setItem("lp_wizard_palette", "B");
  });
  await page.goto("/complete");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /HTMLをダウンロード/ }).first().click(),
  ]);

  const tmpPath = path.join(os.tmpdir(), "lp-sprint5-paletteB.html");
  await download.saveAs(tmpPath);
  const content = fs.readFileSync(tmpPath, "utf-8");

  // パレットBの主色がブルーであること
  expect(content).toContain("--color-primary: #2563EB");
  // パレットAのゴールドが含まれていないこと
  expect(content).not.toContain("--color-primary: #FFD700");
});

// ────────────────────────────────────────────
// 14. /complete: フィードバックUIが動作する
// ────────────────────────────────────────────
test("complete page feedback modal opens and accepts text", async ({ page }) => {
  await seedWizardData(page);
  await page.goto("/complete");

  // フィードバックボタンをクリック
  await page.getByRole("button", { name: /フィードバック/ }).click();

  // モーダルが表示される
  const textarea = page.getByPlaceholder(/例:/);
  await expect(textarea).toBeVisible();

  // テキストを入力
  await textarea.fill("テストフィードバックです");

  // 送信ボタンが有効になる
  const submitBtn = page.getByRole("button", { name: /送信する/ });
  await expect(submitBtn).toBeEnabled();
});

// ────────────────────────────────────────────
// 15. /complete: コンソールエラーなし
// ────────────────────────────────────────────
test("complete page has no console errors", async ({ page }) => {
  await seedWizardData(page);
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/complete");
  await page.waitForTimeout(1000);

  expect(errors.filter((e) => !e.includes("placehold.co"))).toHaveLength(0);
});

// ────────────────────────────────────────────
// 16. /editor: コンソールエラーなし
// ────────────────────────────────────────────
test("editor page has no console errors", async ({ page }) => {
  await seedWizardData(page);
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/editor");
  await page.waitForTimeout(1000);

  expect(errors.filter((e) => !e.includes("placehold.co"))).toHaveLength(0);
});
