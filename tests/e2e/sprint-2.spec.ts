import { test, expect } from "@playwright/test";

/**
 * Sprint 2: ウィザード画面
 * - ウェルカム → ビルダー画面の遷移
 * - 全11セクションのチップが表示されること
 * - レイアウトピッカーが表示されること
 * - セクションの確定・取り消しができること
 * - 未確定時は「LPを生成」が無効であること
 * - 確定後はプレビューにセクションが追加されること
 * - カラーパレット切り替えボタンが表示されること
 */

test.describe("Sprint 2: ウィザード画面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "はじめる" }).click();
  });

  test("ビルダー画面に遷移する", async ({ page }) => {
    // セクションチップが表示されていればビルダー画面
    await expect(page.locator("[data-key='s1']")).toBeVisible();
  });

  test("全11セクションのチップが表示される", async ({ page }) => {
    const sectionIds = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11"];
    for (const id of sectionIds) {
      await expect(page.locator(`[data-key='s${id.slice(1).toLowerCase()}']`)).toBeVisible();
    }
  });

  test("レイアウトピッカーが表示される", async ({ page }) => {
    await expect(page.getByText(/Layout/)).toBeVisible();
  });

  test("コンテンツ入力エリアが表示される", async ({ page }) => {
    await expect(page.getByText("コンテンツ入力")).toBeVisible();
  });

  test("初期状態で「LPを生成」ボタンが無効になっている", async ({ page }) => {
    const generateBtn = page.getByRole("button", { name: "LPを生成" });
    await expect(generateBtn).toBeDisabled();
  });

  test("カウンターが 0 / 11 から始まる", async ({ page }) => {
    await expect(page.getByText("0 / 11")).toBeVisible();
  });

  test("「追加」ボタンでセクションが確定できる", async ({ page }) => {
    await page.getByRole("button", { name: "追加" }).click();
    await expect(page.getByText("確定済み")).toBeVisible();
  });

  test("確定後に「LPを生成」ボタンが有効になる", async ({ page }) => {
    await page.getByRole("button", { name: "追加" }).click();
    const generateBtn = page.getByRole("button", { name: "LPを生成" });
    await expect(generateBtn).toBeEnabled();
  });

  test("確定後にカウンターが 1 / 11 になる", async ({ page }) => {
    await page.getByRole("button", { name: "追加" }).click();
    await expect(page.getByText("1 / 11")).toBeVisible();
  });

  test("「× 取り消す」で確定を解除できる", async ({ page }) => {
    await page.getByRole("button", { name: "追加" }).click();
    await page.getByRole("button", { name: /取り消す/ }).click();
    await expect(page.getByText("確定済み")).not.toBeVisible();
  });

  test("カラーパレット切り替えボタンが3つ表示される", async ({ page }) => {
    await expect(page.getByTitle("パレットA")).toBeVisible();
    await expect(page.getByTitle("パレットB")).toBeVisible();
    await expect(page.getByTitle("パレットC")).toBeVisible();
  });

  test("S3セクションに切り替えてフォームが表示される", async ({ page }) => {
    await page.locator("[data-key='s3']").click();
    await expect(page.getByRole("heading", { name: "メッセージ" })).toBeVisible();
  });

  test("S4セクションに切り替えてフォームが表示される", async ({ page }) => {
    await page.locator("[data-key='s4']").click();
    await expect(page.getByRole("heading", { name: "課題定義" })).toBeVisible();
  });

  test("S6セクションに切り替えてフォームが表示される", async ({ page }) => {
    await page.locator("[data-key='s6']").click();
    await expect(page.getByRole("heading", { name: "カテゴリ" })).toBeVisible();
  });

  test("S7セクションに切り替えてフォームが表示される", async ({ page }) => {
    await page.locator("[data-key='s7']").click();
    await expect(page.getByRole("heading", { name: "導入事例" }).first()).toBeVisible();
  });

  test("S9セクションに切り替えてフォームが表示される", async ({ page }) => {
    await page.locator("[data-key='s9']").click();
    await expect(page.getByRole("heading", { name: "フォーム・FAQ" })).toBeVisible();
  });

  test("プレビューエリアが表示される", async ({ page }) => {
    await expect(page.getByText("プレビュー")).toBeVisible();
  });

  test("スキップボタンでエディタに遷移できる", async ({ page }) => {
    await page.getByRole("button", { name: "スキップ" }).click();
    await expect(page).toHaveURL(/\/editor/);
  });
});
