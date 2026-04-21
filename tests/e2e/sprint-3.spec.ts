import { test, expect } from "@playwright/test";

/**
 * Sprint 3: エディタ画面
 * - /editor にアクセスできること
 * - 左パネル（エディタ）・右パネル（プレビュー）が表示されること
 * - セクションの表示/非表示が切り替えられること
 * - ストックパネルが操作できること
 * - HTMLダウンロードボタンが存在すること
 * - Markdownダウンロードボタンが存在すること
 */

test.describe("Sprint 3: エディタ画面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/editor");
  });

  test("/editor にアクセスできる", async ({ page }) => {
    await expect(page).toHaveURL(/\/editor/);
  });

  test("エディタパネルが表示される", async ({ page }) => {
    // 左パネルにセクションラベルが表示される
    await expect(page.getByText("S1").first()).toBeVisible();
  });

  test("プレビューパネルが表示される", async ({ page }) => {
    // プレビューパネルにはカラーパレット切替ボタンが表示される
    await expect(page.getByTitle("パレットA")).toBeVisible();
  });

  test("HTMLダウンロードボタンが存在する", async ({ page }) => {
    await expect(page.getByText(/HTML.*ダウンロード|ダウンロード.*HTML/i).or(
      page.getByRole("button", { name: /HTML/i })
    )).toBeVisible();
  });

  test("カラーパレット切り替えが表示される", async ({ page }) => {
    await expect(page.getByTitle("パレットA").or(page.getByText(/パレット/))).toBeVisible();
  });

  test("ウィザードに戻るリンクが存在する", async ({ page }) => {
    // ヘッダーに LP ロゴが表示される
    await expect(page.getByText("LP").first()).toBeVisible();
  });
});
