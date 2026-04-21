import { describe, it, expect } from "vitest";
import { generateHtml } from "./htmlGenerator";
import { defaultContent } from "./defaultContent";
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_LAYOUTS } from "./types";
import type { SectionKey, ColorPalette } from "./types";

// ────────────────────────────────────────────────────────────
// ヘルパー
// ────────────────────────────────────────────────────────────
function generate(
  overrides: {
    sectionOrder?: SectionKey[];
    palette?: ColorPalette;
    hiddenSections?: SectionKey[];
  } = {}
) {
  return generateHtml(
    defaultContent,
    overrides.sectionOrder ?? DEFAULT_SECTION_ORDER,
    DEFAULT_SECTION_LAYOUTS,
    overrides.palette ?? "A",
    overrides.hiddenSections ?? []
  );
}

// ────────────────────────────────────────────────────────────
// 基本構造テスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: 基本構造", () => {
  it("単一の完結したHTMLファイルを返す", () => {
    const html = generate();
    expect(html).toMatch(/^<!DOCTYPE html>/);
    expect(html).toMatch(/<\/html>$/);
  });

  it("<head>に<style>タグが含まれる", () => {
    const html = generate();
    expect(html).toContain("<style>");
    expect(html).toContain("</style>");
  });

  it("外部CDN参照が含まれない（http://cdn, https://cdn等）", () => {
    const html = generate();
    // placehold.co（画像プレースホルダー）は許可、それ以外の外部スクリプト/スタイル不可
    const externalLinks = html.match(/<link[^>]+href="https?:\/\/(?!placehold\.co)/g);
    const externalScripts = html.match(/<script[^>]+src="https?:\/\//g);
    expect(externalLinks).toBeNull();
    expect(externalScripts).toBeNull();
  });

  it("<script>タグが含まれる（FAQアコーディオン・ハンバーガー用）", () => {
    const html = generate();
    expect(html).toContain("<script>");
    expect(html).toContain("faq-question");
    expect(html).toContain("hamburger");
  });

  it("lang=\"ja\"が設定されている", () => {
    const html = generate();
    expect(html).toContain('lang="ja"');
  });

  it("UTF-8のcharsetが設定されている", () => {
    const html = generate();
    expect(html).toContain('charset="UTF-8"');
  });
});

// ────────────────────────────────────────────────────────────
// セクションコメントテスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: セクションコメント", () => {
  it("各セクションに <!-- SN: Name [Layout N] --> コメントが含まれる", () => {
    const html = generate();
    expect(html).toContain("<!-- S1: Header [Layout 0] -->");
    expect(html).toContain("<!-- S2: Hero [Layout A] -->");
    expect(html).toContain("<!-- S3: Message [Layout 0] -->");
    expect(html).toContain("<!-- S4: Problems [Layout A] -->");
    expect(html).toContain("<!-- S5: Features [Layout A] -->");
    expect(html).toContain("<!-- S6: Categories [Layout A] -->");
    expect(html).toContain("<!-- S7: Case Studies [Layout A] -->");
    expect(html).toContain("<!-- S8: Flow [Layout A] -->");
    expect(html).toContain("<!-- S9: Form & FAQ [Layout A] -->");
    expect(html).toContain("<!-- S10: Closing [Layout A] -->");
    expect(html).toContain("<!-- S11: Footer [Layout A] -->");
  });
});

// ────────────────────────────────────────────────────────────
// カラーパレットテスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: カラーパレット", () => {
  it("パレットA: --color-primary が #0075de になる", () => {
    const html = generate({ palette: "A" });
    expect(html).toContain("--color-primary: #0075de;");
    expect(html).toContain("--color-secondary: #31302e;");
  });

  it("パレットB: --color-primary がネイビー系になる", () => {
    const html = generate({ palette: "B" });
    expect(html).toContain("--color-primary: #213183;");
    expect(html).toContain("--color-secondary: #31302e;");
  });

  it("パレットC: --color-primary がティール系になる", () => {
    const html = generate({ palette: "C" });
    expect(html).toContain("--color-primary: #2a9d99;");
    expect(html).toContain("--color-secondary: #31302e;");
  });

  it("各パレットで --color-text が rgba(0,0,0,0.95) になる", () => {
    for (const p of ["A", "B", "C"] as ColorPalette[]) {
      const html = generate({ palette: p });
      expect(html).toContain("--color-text: rgba(0,0,0,0.95);");
    }
  });
});

// ────────────────────────────────────────────────────────────
// フォント・タイポグラフィテスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: フォント", () => {
  it("Hiragino Kaku Gothic ProNが指定されている", () => {
    const html = generate();
    expect(html).toContain("Hiragino Kaku Gothic ProN");
  });

  it("Noto Sans JPが指定されている", () => {
    const html = generate();
    expect(html).toContain("Noto Sans JP");
  });
});

// ────────────────────────────────────────────────────────────
// hiddenSectionsテスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: hiddenSections", () => {
  it("hiddenSectionsに含まれるセクションはHTML出力から除外される", () => {
    const html = generate({ hiddenSections: ["s3", "s6"] });
    expect(html).not.toContain("<!-- S3: Message");
    expect(html).not.toContain("<!-- S6: Categories");
    // 他のセクションは含まれる
    expect(html).toContain("<!-- S1: Header");
    expect(html).toContain("<!-- S2: Hero");
  });

  it("全セクションを非表示にすると本体コンテンツが空になる", () => {
    const html = generate({ hiddenSections: DEFAULT_SECTION_ORDER });
    expect(html).not.toContain("<!-- S1:");
    expect(html).not.toContain("<!-- S11:");
  });
});

// ────────────────────────────────────────────────────────────
// S9フォーム必須フィールドテスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: S9フォーム必須フィールド", () => {
  it("お名前フィールドが含まれる", () => {
    const html = generate();
    expect(html).toContain("山田 太郎");
  });

  it("会社名フィールドが含まれる", () => {
    const html = generate();
    expect(html).toContain("株式会社サンプル");
  });

  it("メールアドレスフィールドが含まれる", () => {
    const html = generate();
    expect(html).toContain('type="email"');
  });

  it("電話番号フィールドが含まれる", () => {
    const html = generate();
    expect(html).toContain('type="tel"');
  });

  it("従業員数セレクトが含まれる", () => {
    const html = generate();
    expect(html).toContain("<select");
    expect(html).toContain("選択してください");
  });

  it("プライバシーポリシー同意チェックボックスが含まれる", () => {
    const html = generate();
    expect(html).toContain("プライバシーポリシーに同意する");
    expect(html).toContain('type="checkbox"');
  });
});

// ────────────────────────────────────────────────────────────
// コンテンツテスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: コンテンツ", () => {
  it("S2のmainCopyがHTML出力に含まれる", () => {
    const html = generate();
    expect(html).toContain(defaultContent.s2.mainCopy);
  });

  it("S3のheadingがHTML出力に含まれる", () => {
    const html = generate();
    expect(html).toContain(defaultContent.s3.heading);
  });

  it("S4の課題カード見出しがすべて含まれる", () => {
    const html = generate();
    defaultContent.s4.cards.forEach((card) => {
      expect(html).toContain(card.heading);
    });
  });

  it("S7の事例企業名がすべて含まれる", () => {
    const html = generate();
    defaultContent.s7.cards.forEach((card) => {
      expect(html).toContain(card.companyName);
    });
  });

  it("S11のcopyright文字が含まれる", () => {
    const html = generate();
    expect(html).toContain(defaultContent.s11.copyright);
  });
});

// ────────────────────────────────────────────────────────────
// レスポンシブCSSテスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: レスポンシブ", () => {
  it("PCブレイクポイント（max-width: 1023px）が定義されている", () => {
    const html = generate();
    expect(html).toContain("max-width: 1023px");
  });
});

// ────────────────────────────────────────────────────────────
// レイアウトバリアントテスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: レイアウトバリアント", () => {
  it("S1 Layout 1 では secondary背景クラスが使われる", () => {
    const html = generateHtml(
      defaultContent,
      ["s1"],
      { ...DEFAULT_SECTION_LAYOUTS, s1: 1 },
      "A"
    );
    expect(html).toContain("<!-- S1: Header [Layout 1] -->");
    expect(html).toContain("s1-layout1");
  });

  it("S2 Layout 2 では左画像・右テキストグリッドが使われる", () => {
    const html = generateHtml(
      defaultContent,
      ["s2"],
      { ...DEFAULT_SECTION_LAYOUTS, s2: 2 },
      "A"
    );
    expect(html).toContain("<!-- S2: Hero [Layout 2] -->");
    expect(html).toContain("hero-grid-40-60");
  });

  it("S5 Layout 2 では横長カードが使われる", () => {
    const html = generateHtml(
      defaultContent,
      ["s5"],
      { ...DEFAULT_SECTION_LAYOUTS, s5: 2 },
      "A"
    );
    expect(html).toContain("<!-- S5: Features [Layout 2] -->");
    expect(html).toContain("feature-wide-card");
  });

  it("S10 Layout 2 では secondary背景が使われる", () => {
    const html = generateHtml(
      defaultContent,
      ["s10"],
      { ...DEFAULT_SECTION_LAYOUTS, s10: 2 },
      "A"
    );
    expect(html).toContain("<!-- S10: Closing [Layout 2] -->");
    expect(html).toContain("s10-layout2");
  });
});

// ────────────────────────────────────────────────────────────
// プレースホルダー画像テスト
// ────────────────────────────────────────────────────────────
describe("generateHtml: 画像", () => {
  it("placeholder.coが使用されている", () => {
    const html = generate();
    expect(html).toContain("placehold.co");
  });
});
