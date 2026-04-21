import { test, expect } from "@playwright/test";

/**
 * Sprint 1: 基盤構築
 * - アプリが正常に起動すること
 * - タイトルが設定されていること
 * - CSS変数（--col-*）が定義されていること
 */

test.describe("Sprint 1: 基盤構築", () => {
  test("ウェルカム画面が表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/LP/);
  });

  test("LP生成ウィザードの見出しが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("LP生成ウィザード")).toBeVisible();
  });

  test("はじめるボタンが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "はじめる" })).toBeVisible();
  });

  test("エディタへのスキップリンクが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /エディタ/ })).toBeVisible();
  });

  test("ダークモードトグルボタンが表示される", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByTitle(/モードに切り替え/);
    await expect(toggle).toBeVisible();
  });

  test("CSS変数 --col-bg が body に適用されている", async ({ page }) => {
    await page.goto("/");
    const bg = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue("--col-bg").trim()
    );
    expect(bg).not.toBe("");
  });
});
