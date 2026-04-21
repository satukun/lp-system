import { test, expect } from "@playwright/test";

/**
 * Sprint 4: 完成画面・カラーパレット・ダークモード
 * - /complete にアクセスできること
 * - デバイスプレビュー切り替え（PC / Tablet / SP）
 * - フィードバックボタンとモーダル
 * - ダークモードトグルが全ページで機能すること
 */

test.describe("Sprint 4: 完成画面", () => {
  test.beforeEach(async ({ page }) => {
    // localStorageに最低限のデータをセットして完成画面を表示
    await page.goto("/complete");
    await page.evaluate(() => {
      localStorage.setItem("lp_wizard_confirmed", JSON.stringify(["s1", "s2"]));
      localStorage.setItem("lp_wizard_palette", "A");
    });
    await page.reload();
  });

  test("/complete にアクセスできる", async ({ page }) => {
    await expect(page).toHaveURL(/\/complete/);
  });

  test("PCデバイスプレビューボタンが表示される", async ({ page }) => {
    await expect(page.getByTitle(/PC|デスクトップ/).or(page.getByText("PC"))).toBeVisible();
  });

  test("Tabletデバイスプレビューボタンが表示される", async ({ page }) => {
    await expect(page.getByTitle(/Tablet|タブレット/).or(page.getByText("Tablet"))).toBeVisible();
  });

  test("SPデバイスプレビューボタンが表示される", async ({ page }) => {
    await expect(page.getByTitle(/SP|スマートフォン/).or(page.getByText("SP"))).toBeVisible();
  });

  test("HTMLダウンロードボタンが表示される", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "HTMLをダウンロード" }).first()
    ).toBeVisible();
  });

  test("フィードバックボタンが表示される", async ({ page }) => {
    await expect(page.getByRole("button", { name: /フィードバック/ })).toBeVisible();
  });

  test("フィードバックボタンをクリックするとモーダルが開く", async ({ page }) => {
    await page.getByRole("button", { name: /フィードバック/ }).click();
    await expect(page.getByText("生成結果はどうでしたか")).toBeVisible();
  });

  test("フィードバックモーダルにテキストエリアがある", async ({ page }) => {
    await page.getByRole("button", { name: /フィードバック/ }).click();
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("フィードバックモーダルにキャンセルボタンがある", async ({ page }) => {
    await page.getByRole("button", { name: /フィードバック/ }).click();
    await expect(page.getByRole("button", { name: /キャンセル/ })).toBeVisible();
  });

  test("エディタに移動するボタンが表示される", async ({ page }) => {
    await expect(page.getByRole("button", { name: /エディタ/ }).first()).toBeVisible();
  });
});

test.describe("Sprint 4: ダークモード", () => {
  test("ダークモードトグルが表示される", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByTitle(/モードに切り替え/);
    await expect(toggle).toBeVisible();
  });

  test("ダークモードトグルをクリックすると data-theme が切り替わる", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    // 初期状態は data-theme なし
    const before = await html.getAttribute("data-theme");

    await page.getByTitle(/モードに切り替え/).click();

    const after = await html.getAttribute("data-theme");
    expect(after).not.toBe(before);
  });

  test("ダークモードが localStorage に保存される", async ({ page }) => {
    await page.goto("/");
    await page.getByTitle(/モードに切り替え/).click();

    const theme = await page.evaluate(() => localStorage.getItem("lp_theme"));
    expect(theme).toMatch(/dark|light/);
  });
});
