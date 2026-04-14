import type { LPData, SectionKey, SectionLayouts, ColorPalette, LayoutIndex } from "./types";

// ────────────────────────────────────────────────────────────
// カラーパレット定義
// design-system.md § 2 に準拠。B/Cは同じトークン名でブルー・グリーン系に置換
// ────────────────────────────────────────────────────────────

function getPaletteVars(palette: ColorPalette): string {
  if (palette === "A") {
    return `
  --color-primary: #FFD700;
  --color-primary-dark: #E6C200;
  --color-secondary: #1A1A2E;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-bg: #FFFFFF;
  --color-bg-alt: #F5F5F0;
  --color-border: #E0E0E0;`;
  }
  if (palette === "B") {
    return `
  --color-primary: #2563EB;
  --color-primary-dark: #1D4ED8;
  --color-secondary: #0F172A;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-bg: #FFFFFF;
  --color-bg-alt: #F0F4FF;
  --color-border: #E0E0E0;`;
  }
  // C: グリーン
  return `
  --color-primary: #16A34A;
  --color-primary-dark: #15803D;
  --color-secondary: #14271A;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-bg: #FFFFFF;
  --color-bg-alt: #F0FDF4;
  --color-border: #E0E0E0;`;
}

// ────────────────────────────────────────────────────────────
// 背景交互ルール
// design-system.md § 2: S1(白) S2(白) S3(alt) S4(白) S5(alt)
//   S6(白) S7(alt) S8(白) S9(alt) S10(primary-dark) S11(secondary)
// ────────────────────────────────────────────────────────────

function getSectionBg(key: SectionKey): string {
  const bgMap: Record<SectionKey, string> = {
    s1:  "var(--color-bg)",
    s2:  "var(--color-bg)",
    s3:  "var(--color-bg-alt)",
    s4:  "var(--color-bg)",
    s5:  "var(--color-bg-alt)",
    s6:  "var(--color-bg)",
    s7:  "var(--color-bg-alt)",
    s8:  "var(--color-bg)",
    s9:  "var(--color-bg-alt)",
    s10: "var(--color-primary-dark)",
    s11: "var(--color-secondary)",
  };
  return bgMap[key];
}

// ────────────────────────────────────────────────────────────
// ユーティリティ
// ────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function placeholderImg(w: number, h: number, hint: string, extraClass = ""): string {
  const encodedHint = encodeURIComponent(hint.slice(0, 40));
  const classAttr = extraClass ? ` class="${extraClass}"` : "";
  return `<img src="https://placehold.co/${w}x${h}" alt="${esc(hint)}" title="${esc(hint)}" data-hint="${encodedHint}"${classAttr} loading="lazy">`;
}

function userImg(images: Record<string, string>, key: string, w: number, h: number, hint: string, extraClass = ""): string {
  const url = images[key];
  if (url) {
    const classAttr = extraClass ? ` class="${extraClass}"` : "";
    return `<img src="${url}" alt="${esc(hint)}"${classAttr} loading="lazy">`;
  }
  return placeholderImg(w, h, hint, extraClass);
}

function bgStyle(url?: string): string {
  if (!url) return "";
  return ` style="background-image: url('${url}'); background-size: cover; background-position: center;"`;
}

// ────────────────────────────────────────────────────────────
// セクション別HTML生成
// ────────────────────────────────────────────────────────────

// S1: Header
function renderS1(data: LPData, layout: LayoutIndex): string {
  const { s1 } = data;
  const menuHtml = s1.menuItems
    .map((item) => `<a href="#" class="nav-link">${esc(item)}</a>`)
    .join("");

  if (layout === 0) {
    // Layout 0: 白背景、ロゴ左・ナビ中央・CTA右、border-bottom
    return `<!-- S1: Header [Layout 0] -->
<header class="s1 s1-layout0">
  <div class="container s1-inner">
    <div class="s1-logo">
      <span class="logo-text">サービス名</span>
    </div>
    <nav class="s1-nav">${menuHtml}</nav>
    <div class="s1-cta">
      <a href="#contact" class="btn-primary">${esc(s1.ctaText)}</a>
    </div>
    <button class="hamburger" aria-label="メニューを開く" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="drawer" id="drawer">
    <nav class="drawer-nav">${menuHtml}</nav>
    <a href="#contact" class="btn-primary btn-block">${esc(s1.ctaText)}</a>
  </div>
</header>`;
  }

  if (layout === 1) {
    // Layout 1: secondary色背景、ゴールドロゴ、白ナビ（opacity: 0.8）、ゴールドCTA
    return `<!-- S1: Header [Layout 1] -->
<header class="s1 s1-layout1">
  <div class="container s1-inner">
    <div class="s1-logo">
      <span class="logo-text logo-gold">サービス名</span>
    </div>
    <nav class="s1-nav nav-white">${menuHtml}</nav>
    <div class="s1-cta">
      <a href="#contact" class="btn-primary">${esc(s1.ctaText)}</a>
    </div>
    <button class="hamburger hamburger-white" aria-label="メニューを開く" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="drawer drawer-dark" id="drawer">
    <nav class="drawer-nav">${menuHtml}</nav>
    <a href="#contact" class="btn-primary btn-block">${esc(s1.ctaText)}</a>
  </div>
</header>`;
  }

  // Layout 2: 白背景、border-bottom: 4px solid primary色、ロゴ＋小タグライン
  return `<!-- S1: Header [Layout 2] -->
<header class="s1 s1-layout2">
  <div class="container s1-inner">
    <div class="s1-logo">
      <span class="logo-text">サービス名</span>
      <span class="logo-tagline">スキマバイト募集サービス</span>
    </div>
    <nav class="s1-nav">${menuHtml}</nav>
    <div class="s1-cta">
      <a href="#contact" class="btn-primary">${esc(s1.ctaText)}</a>
    </div>
    <button class="hamburger" aria-label="メニューを開く" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="drawer" id="drawer">
    <nav class="drawer-nav">${menuHtml}</nav>
    <a href="#contact" class="btn-primary btn-block">${esc(s1.ctaText)}</a>
  </div>
</header>`;
}

// S2: Hero
function renderS2(data: LPData, layout: LayoutIndex): string {
  const { s2 } = data;
  const badges = s2.trustBadges
    .map((b) => `<span class="trust-badge">${esc(b)}</span>`)
    .join("");
  const textBlock = `
    <div class="hero-text">
      <p class="section-label">HERO</p>
      <h1 class="hero-main-copy">${esc(s2.mainCopy)}</h1>
      <p class="hero-sub-copy">${esc(s2.subCopy)}</p>
      <div class="hero-cta-row">
        <a href="#contact" class="btn-primary">${esc(s2.ctaText)}</a>
        <a href="#contact" class="btn-secondary">${esc(s2.secondaryCtaText)}</a>
      </div>
      <div class="trust-badges">${badges}</div>
    </div>`;
  const imgBlock = `<div class="hero-image">${userImg(data.images, "s2_hero", 560, 420, "ヒーロービジュアル", "img-radius")}</div>`;
  const s2Bg = bgStyle(data.images["s2_bg"]);

  if (layout === 0) {
    // Layout 0: grid 6:4、左テキスト・右画像
    return `<!-- S2: Hero [Layout 0] -->
<section class="s2 s2-layout0"${s2Bg}>
  <div class="container hero-grid hero-grid-60-40">
    ${textBlock}
    ${imgBlock}
  </div>
</section>`;
  }

  if (layout === 1) {
    // Layout 1: 中央揃え、max-width 760px、メインコピー52px、下部フルワイド画像
    return `<!-- S2: Hero [Layout 1] -->
<section class="s2 s2-layout1"${s2Bg}>
  <div class="container">
    <div class="hero-center">
      <p class="section-label">HERO</p>
      <h1 class="hero-main-copy hero-copy-52">${esc(s2.mainCopy)}</h1>
      <p class="hero-sub-copy">${esc(s2.subCopy)}</p>
      <div class="hero-cta-row hero-cta-center">
        <a href="#contact" class="btn-primary">${esc(s2.ctaText)}</a>
        <a href="#contact" class="btn-secondary">${esc(s2.secondaryCtaText)}</a>
      </div>
      <div class="trust-badges trust-badges-center">${badges}</div>
    </div>
  </div>
  <div class="hero-fullwidth-img">${userImg(data.images, "s2_hero", 1200, 400, "ヒーロービジュアル（フルワイド）", "img-fullwidth")}</div>
</section>`;
  }

  // Layout 2: grid 4:6、左画像・右テキスト
  return `<!-- S2: Hero [Layout 2] -->
<section class="s2 s2-layout2"${s2Bg}>
  <div class="container hero-grid hero-grid-40-60">
    ${imgBlock}
    ${textBlock}
  </div>
</section>`;
}

// S3: Message
function renderS3(data: LPData, layout: LayoutIndex): string {
  const { s3 } = data;
  const s3Bg = bgStyle(data.images["s3_bg"]);

  if (layout === 0) {
    // Layout 0: bg-alt背景、中央揃え、max-width 720px
    return `<!-- S3: Message [Layout 0] -->
<section class="s3 s3-layout0"${s3Bg}>
  <div class="container">
    <div class="message-center">
      <p class="section-label">OVERVIEW</p>
      <h2 class="section-heading">${esc(s3.heading)}</h2>
      <p class="body-text">${esc(s3.body)}</p>
    </div>
  </div>
</section>`;
  }

  if (layout === 1) {
    // Layout 1: 白背景、大きな引用符（primary色、120〜140px）、左揃えテキスト
    return `<!-- S3: Message [Layout 1] -->
<section class="s3 s3-layout1"${s3Bg}>
  <div class="container">
    <div class="message-quote">
      <span class="quote-mark">&ldquo;</span>
      <div class="message-quote-body">
        <p class="section-label">OVERVIEW</p>
        <h2 class="section-heading text-left">${esc(s3.heading)}</h2>
        <p class="body-text text-left">${esc(s3.body)}</p>
      </div>
    </div>
  </div>
</section>`;
  }

  // Layout 2: secondary色背景、白テキスト、ラベルはprimary色（opacity: 0.7）
  return `<!-- S3: Message [Layout 2] -->
<section class="s3 s3-layout2"${s3Bg}>
  <div class="container">
    <div class="message-center">
      <p class="section-label label-primary-op">OVERVIEW</p>
      <h2 class="section-heading text-white">${esc(s3.heading)}</h2>
      <p class="body-text text-white-light">${esc(s3.body)}</p>
    </div>
  </div>
</section>`;
}

// S4: Problems
function renderS4(data: LPData, layout: LayoutIndex): string {
  const { s4 } = data;
  const s4Bg = bgStyle(data.images["s4_bg"]);

  if (layout === 0) {
    // Layout 0: 3カラムカード、グレーアイコンボックス（48×48）、中央揃え
    const cards = s4.cards.map((card) => `
      <div class="card card-center">
        <div class="icon-box-gray">${placeholderImg(48, 48, card.iconHint)}</div>
        <h3 class="card-title">${esc(card.heading)}</h3>
        <p class="card-desc">${esc(card.description)}</p>
      </div>`).join("");
    return `<!-- S4: Problems [Layout 0] -->
<section class="s4 s4-layout0"${s4Bg}>
  <div class="container">
    <p class="section-label">PROBLEMS</p>
    <h2 class="section-heading">${esc(s4.sectionHeading)}</h2>
    <div class="cards-3col">${cards}
    </div>
  </div>
</section>`;
  }

  if (layout === 1) {
    // Layout 1: 3カラムカード、ゴールドナンバーボックス（48×48）、左揃え
    const cards = s4.cards.map((card, i) => `
      <div class="card">
        <div class="num-box-gold">${i + 1}</div>
        <h3 class="card-title">${esc(card.heading)}</h3>
        <p class="card-desc">${esc(card.description)}</p>
      </div>`).join("");
    return `<!-- S4: Problems [Layout 1] -->
<section class="s4 s4-layout1"${s4Bg}>
  <div class="container">
    <p class="section-label">PROBLEMS</p>
    <h2 class="section-heading">${esc(s4.sectionHeading)}</h2>
    <div class="cards-3col">${cards}
    </div>
  </div>
</section>`;
  }

  // Layout 2: リストスタイル（カードなし）、ゴールドナンバー＋テキスト、border-bottomで区切り
  const items = s4.cards.map((card, i) => `
      <div class="problem-list-item">
        <span class="num-gold-inline">${i + 1}</span>
        <div>
          <h3 class="card-title">${esc(card.heading)}</h3>
          <p class="card-desc">${esc(card.description)}</p>
        </div>
      </div>`).join("");
  return `<!-- S4: Problems [Layout 2] -->
<section class="s4 s4-layout2"${s4Bg}>
  <div class="container">
    <p class="section-label">PROBLEMS</p>
    <h2 class="section-heading">${esc(s4.sectionHeading)}</h2>
    <div class="problem-list">${items}
    </div>
  </div>
</section>`;
}

// S5: Features
function renderS5(data: LPData, layout: LayoutIndex): string {
  const { s5 } = data;
  const s5Bg = bgStyle(data.images["s5_bg"]);

  if (layout === 0) {
    // Layout 0: 3カラムカード、POINTバッジ→タイトル→説明→下部画像
    const cards = s5.cards.map((card, i) => `
      <div class="card">
        <span class="point-badge">${esc(card.pointLabel)}</span>
        <h3 class="card-title">${esc(card.title)}</h3>
        <p class="card-desc">${esc(card.description)}</p>
        <div class="card-image">${userImg(data.images, `s5_${i}`, 280, 160, card.imageHint, "img-radius")}</div>
      </div>`).join("");
    return `<!-- S5: Features [Layout 0] -->
<section class="s5 s5-layout0"${s5Bg}>
  <div class="container">
    <p class="section-label">FEATURES</p>
    <h2 class="section-heading">${esc(s5.sectionHeading)}</h2>
    <div class="cards-3col">${cards}
    </div>
  </div>
</section>`;
  }

  if (layout === 1) {
    // Layout 1: 3カラムカード、上部画像→POINTバッジ→タイトル→説明
    const cards = s5.cards.map((card, i) => `
      <div class="card">
        <div class="card-image-top">${userImg(data.images, `s5_${i}`, 280, 160, card.imageHint, "img-radius")}</div>
        <span class="point-badge">${esc(card.pointLabel)}</span>
        <h3 class="card-title">${esc(card.title)}</h3>
        <p class="card-desc">${esc(card.description)}</p>
      </div>`).join("");
    return `<!-- S5: Features [Layout 1] -->
<section class="s5 s5-layout1"${s5Bg}>
  <div class="container">
    <p class="section-label">FEATURES</p>
    <h2 class="section-heading">${esc(s5.sectionHeading)}</h2>
    <div class="cards-3col">${cards}
    </div>
  </div>
</section>`;
  }

  // Layout 2: 1カラム横長カード（padding 28px 32px）、ゴールド大番号（80×80）左＋テキスト中＋画像右
  const cards = s5.cards.map((card, i) => `
      <div class="feature-wide-card">
        <div class="feature-wide-num">${i + 1}</div>
        <div class="feature-wide-text">
          <span class="point-badge">${esc(card.pointLabel)}</span>
          <h3 class="card-title">${esc(card.title)}</h3>
          <p class="card-desc">${esc(card.description)}</p>
        </div>
        <div class="feature-wide-img">${userImg(data.images, `s5_${i}`, 200, 140, card.imageHint, "img-radius")}</div>
      </div>`).join("");
  return `<!-- S5: Features [Layout 2] -->
<section class="s5 s5-layout2"${s5Bg}>
  <div class="container">
    <p class="section-label">FEATURES</p>
    <h2 class="section-heading">${esc(s5.sectionHeading)}</h2>
    <div class="features-1col">${cards}
    </div>
  </div>
</section>`;
}

// S6: Categories
function renderS6(data: LPData, layout: LayoutIndex): string {
  const { s6 } = data;
  const s6Bg = bgStyle(data.images["s6_bg"]);

  if (layout === 0) {
    // Layout 0: 3×2グリッド、画像120px
    const cards = s6.cards.map((card, i) => `
      <div class="card card-center">
        <div class="cat-img">${userImg(data.images, `s6_${i}`, 120, 120, card.imageHint, "img-radius")}</div>
        <h3 class="card-title">${esc(card.name)}</h3>
        <p class="card-desc">${esc(card.subText)}</p>
      </div>`).join("");
    return `<!-- S6: Categories [Layout 0] -->
<section class="s6 s6-layout0"${s6Bg}>
  <div class="container">
    <p class="section-label">CATEGORIES</p>
    <h2 class="section-heading">${esc(s6.sectionHeading)}</h2>
    <div class="cards-3col">${cards}
    </div>
    <div class="section-cta-row">
      <a href="#contact" class="btn-primary">${esc(s6.cta1)}</a>
      <a href="#contact" class="btn-secondary">${esc(s6.cta2)}</a>
    </div>
  </div>
</section>`;
  }

  if (layout === 1) {
    // Layout 1: 2×3グリッド、画像200px
    const cards = s6.cards.map((card, i) => `
      <div class="card card-center">
        <div class="cat-img">${userImg(data.images, `s6_${i}`, 200, 200, card.imageHint, "img-radius")}</div>
        <h3 class="card-title">${esc(card.name)}</h3>
        <p class="card-desc">${esc(card.subText)}</p>
      </div>`).join("");
    return `<!-- S6: Categories [Layout 1] -->
<section class="s6 s6-layout1"${s6Bg}>
  <div class="container">
    <p class="section-label">CATEGORIES</p>
    <h2 class="section-heading">${esc(s6.sectionHeading)}</h2>
    <div class="cards-2col">${cards}
    </div>
    <div class="section-cta-row">
      <a href="#contact" class="btn-primary">${esc(s6.cta1)}</a>
      <a href="#contact" class="btn-secondary">${esc(s6.cta2)}</a>
    </div>
  </div>
</section>`;
  }

  // Layout 2: 縦リスト（flex-direction: column）、画像120×90、border-radius付き
  const items = s6.cards.map((card, i) => `
      <div class="cat-list-item">
        <div class="cat-list-img">${userImg(data.images, `s6_${i}`, 120, 90, card.imageHint, "img-radius")}</div>
        <div class="cat-list-text">
          <h3 class="card-title">${esc(card.name)}</h3>
          <p class="card-desc">${esc(card.subText)}</p>
        </div>
      </div>`).join("");
  return `<!-- S6: Categories [Layout 2] -->
<section class="s6 s6-layout2"${s6Bg}>
  <div class="container">
    <p class="section-label">CATEGORIES</p>
    <h2 class="section-heading">${esc(s6.sectionHeading)}</h2>
    <div class="cat-list">${items}
    </div>
    <div class="section-cta-row">
      <a href="#contact" class="btn-primary">${esc(s6.cta1)}</a>
      <a href="#contact" class="btn-secondary">${esc(s6.cta2)}</a>
    </div>
  </div>
</section>`;
}

// S7: Case Studies
function renderS7(data: LPData, layout: LayoutIndex): string {
  const { s7 } = data;
  const s7Bg = bgStyle(data.images["s7_bg"]);

  if (layout === 0) {
    // Layout 0: 3カラムカード、画像上160px・テキスト下
    const cards = s7.cards.map((card, i) => `
      <div class="card">
        <div class="case-img">${userImg(data.images, `s7_${i}`, 320, 160, card.imageHint, "img-radius")}</div>
        <h3 class="card-title">${esc(card.companyName)}</h3>
        <p class="card-desc">${esc(card.summary)}</p>
      </div>`).join("");
    return `<!-- S7: Case Studies [Layout 0] -->
<section class="s7 s7-layout0"${s7Bg}>
  <div class="container">
    <p class="section-label">CASE STUDIES</p>
    <h2 class="section-heading">${esc(s7.sectionHeading)}</h2>
    <div class="cards-3col">${cards}
    </div>
    <div class="section-link-row">
      <a href="#" class="text-link">${esc(s7.linkText)}</a>
    </div>
    <div class="section-cta-row">
      <a href="#contact" class="btn-primary">${esc(s7.cta1)}</a>
      <a href="#contact" class="btn-secondary">${esc(s7.cta2)}</a>
    </div>
  </div>
</section>`;
  }

  if (layout === 1) {
    // Layout 1: 3カラムカード＋ゴールドバッジ「導入事例」
    const cards = s7.cards.map((card, i) => `
      <div class="card">
        <span class="case-badge">導入事例</span>
        <div class="case-img">${userImg(data.images, `s7_${i}`, 320, 160, card.imageHint, "img-radius")}</div>
        <h3 class="card-title">${esc(card.companyName)}</h3>
        <p class="card-desc">${esc(card.summary)}</p>
      </div>`).join("");
    return `<!-- S7: Case Studies [Layout 1] -->
<section class="s7 s7-layout1"${s7Bg}>
  <div class="container">
    <p class="section-label">CASE STUDIES</p>
    <h2 class="section-heading">${esc(s7.sectionHeading)}</h2>
    <div class="cards-3col">${cards}
    </div>
    <div class="section-link-row">
      <a href="#" class="text-link">${esc(s7.linkText)}</a>
    </div>
    <div class="section-cta-row">
      <a href="#contact" class="btn-primary">${esc(s7.cta1)}</a>
      <a href="#contact" class="btn-secondary">${esc(s7.cta2)}</a>
    </div>
  </div>
</section>`;
  }

  // Layout 2: 1カラム横長（画像左240px・テキスト右）、ゴールドバッジ付き
  const cards = s7.cards.map((card, i) => `
      <div class="case-wide-card">
        <div class="case-wide-img">${userImg(data.images, `s7_${i}`, 240, 160, card.imageHint, "img-radius")}</div>
        <div class="case-wide-text">
          <span class="case-badge">導入事例</span>
          <h3 class="card-title">${esc(card.companyName)}</h3>
          <p class="card-desc">${esc(card.summary)}</p>
        </div>
      </div>`).join("");
  return `<!-- S7: Case Studies [Layout 2] -->
<section class="s7 s7-layout2"${s7Bg}>
  <div class="container">
    <p class="section-label">CASE STUDIES</p>
    <h2 class="section-heading">${esc(s7.sectionHeading)}</h2>
    <div class="cases-1col">${cards}
    </div>
    <div class="section-link-row">
      <a href="#" class="text-link">${esc(s7.linkText)}</a>
    </div>
    <div class="section-cta-row">
      <a href="#contact" class="btn-primary">${esc(s7.cta1)}</a>
      <a href="#contact" class="btn-secondary">${esc(s7.cta2)}</a>
    </div>
  </div>
</section>`;
}

// S8: Flow
function renderS8(data: LPData, layout: LayoutIndex): string {
  const { s8 } = data;
  const s8Bg = bgStyle(data.images["s8_bg"]);

  if (layout === 0) {
    // Layout 0: 横並びgrid（4列）、ゴールド円番号（48px）、→矢印
    const steps = s8.steps.map((step, i) => `
      <div class="flow-step">
        <div class="flow-num-circle">${i + 1}</div>
        <div class="flow-icon">${placeholderImg(48, 48, step.iconHint)}</div>
        <h3 class="card-title">${esc(step.title)}</h3>
        <p class="card-desc">${esc(step.description)}</p>
        ${i < s8.steps.length - 1 ? '<div class="flow-arrow">&rarr;</div>' : ""}
      </div>`).join("");
    return `<!-- S8: Flow [Layout 0] -->
<section class="s8 s8-layout0"${s8Bg}>
  <div class="container">
    <p class="section-label">FLOW</p>
    <h2 class="section-heading">${esc(s8.sectionHeading)}</h2>
    <div class="flow-grid">${steps}
    </div>
  </div>
</section>`;
  }

  if (layout === 1) {
    // Layout 1: 横並びgrid（4列）、secondary色角丸正方形番号（48px）、矢印なし
    const steps = s8.steps.map((step, i) => `
      <div class="flow-step">
        <div class="flow-num-square">${i + 1}</div>
        <div class="flow-icon">${placeholderImg(48, 48, step.iconHint)}</div>
        <h3 class="card-title">${esc(step.title)}</h3>
        <p class="card-desc">${esc(step.description)}</p>
      </div>`).join("");
    return `<!-- S8: Flow [Layout 1] -->
<section class="s8 s8-layout1"${s8Bg}>
  <div class="container">
    <p class="section-label">FLOW</p>
    <h2 class="section-heading">${esc(s8.sectionHeading)}</h2>
    <div class="flow-grid">${steps}
    </div>
  </div>
</section>`;
  }

  // Layout 2: 縦並び（flex-direction: column）、左縦ライン（2px・border色）、ゴールド円番号
  const steps = s8.steps.map((step, i) => `
      <div class="flow-vert-step">
        <div class="flow-vert-left">
          <div class="flow-num-circle">${i + 1}</div>
          ${i < s8.steps.length - 1 ? '<div class="flow-vert-line"></div>' : ""}
        </div>
        <div class="flow-vert-content">
          <h3 class="card-title">${esc(step.title)}</h3>
          <p class="card-desc">${esc(step.description)}</p>
        </div>
      </div>`).join("");
  return `<!-- S8: Flow [Layout 2] -->
<section class="s8 s8-layout2"${s8Bg}>
  <div class="container">
    <p class="section-label">FLOW</p>
    <h2 class="section-heading">${esc(s8.sectionHeading)}</h2>
    <div class="flow-vert">${steps}
    </div>
  </div>
</section>`;
}

// S9: Form & FAQ
function renderS9(data: LPData, layout: LayoutIndex): string {
  const { s9 } = data;
  const s9Bg = bgStyle(data.images["s9_bg"]);

  const makeFaqItem = (faq: typeof s9.faqs[0], index: number, style: "plain" | "gold" | "num") => {
    let qPrefix = "";
    if (style === "plain") qPrefix = "Q.";
    if (style === "gold") qPrefix = `<span class="faq-q-badge">Q</span>`;
    if (style === "num") qPrefix = `<span class="faq-num-badge">${["①", "②", "③", "④", "⑤"][index] ?? index + 1}</span>`;
    return `
          <div class="faq-item" data-faq-index="${index}">
            <button class="faq-question" aria-expanded="false">
              ${qPrefix}<span>${esc(faq.question)}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer" hidden>
              <p>${esc(faq.answer)}</p>
            </div>
          </div>`;
  };

  const formHtml = `
        <div class="contact-form-wrap" id="contact">
          <h3 class="form-heading">${esc(s9.formHeading)}</h3>
          <p class="section-label">CONTACT</p>
          <form class="contact-form" onsubmit="return false;">
            <div class="form-group">
              <label class="form-label">お名前 <span class="required">*</span></label>
              <input type="text" class="form-input" placeholder="山田 太郎" required>
            </div>
            <div class="form-group">
              <label class="form-label">会社名 <span class="required">*</span></label>
              <input type="text" class="form-input" placeholder="株式会社サンプル" required>
            </div>
            <div class="form-group">
              <label class="form-label">メールアドレス <span class="required">*</span></label>
              <input type="email" class="form-input" placeholder="example@timee.co.jp" required>
            </div>
            <div class="form-group">
              <label class="form-label">電話番号 <span class="required">*</span></label>
              <input type="tel" class="form-input" placeholder="03-1234-5678" required>
            </div>
            <div class="form-group">
              <label class="form-label">従業員数 <span class="required">*</span></label>
              <select class="form-input form-select" required>
                <option value="">選択してください</option>
                <option value="1-10">1〜10名</option>
                <option value="11-50">11〜50名</option>
                <option value="51-100">51〜100名</option>
                <option value="101-300">101〜300名</option>
                <option value="301-1000">301〜1000名</option>
                <option value="1001+">1001名以上</option>
              </select>
            </div>
            <div class="form-group form-checkbox-group">
              <label class="form-checkbox-label">
                <input type="checkbox" class="form-checkbox" required>
                <span>プライバシーポリシーに同意する</span>
              </label>
            </div>
            <button type="submit" class="btn-primary btn-block">${esc(data.s2.ctaText)}</button>
          </form>
        </div>`;

  if (layout === 0) {
    // Layout 0: 2カラムgrid（1fr 1fr）、FAQ左・フォーム右、「Q.」CSSプレフィックス
    const faqs = s9.faqs.map((faq, i) => makeFaqItem(faq, i, "plain")).join("");
    return `<!-- S9: Form & FAQ [Layout 0] -->
<section class="s9 s9-layout0"${s9Bg}>
  <div class="container">
    <div class="s9-grid">
      <div class="faq-col">
        <p class="section-label">FAQ</p>
        <h2 class="section-heading">よくある質問</h2>
        <div class="faq-list">${faqs}
        </div>
      </div>
      ${formHtml}
    </div>
  </div>
</section>`;
  }

  if (layout === 1) {
    // Layout 1: 2カラムgrid、ゴールドQバッジ
    const faqs = s9.faqs.map((faq, i) => makeFaqItem(faq, i, "gold")).join("");
    return `<!-- S9: Form & FAQ [Layout 1] -->
<section class="s9 s9-layout1"${s9Bg}>
  <div class="container">
    <div class="s9-grid">
      <div class="faq-col">
        <p class="section-label">FAQ</p>
        <h2 class="section-heading">よくある質問</h2>
        <div class="faq-list">${faqs}
        </div>
      </div>
      ${formHtml}
    </div>
  </div>
</section>`;
  }

  // Layout 2: 2カラムgrid、番号バッジ（①②③…、background: secondary色、color: primary色）
  const faqs = s9.faqs.map((faq, i) => makeFaqItem(faq, i, "num")).join("");
  return `<!-- S9: Form & FAQ [Layout 2] -->
<section class="s9 s9-layout2"${s9Bg}>
  <div class="container">
    <div class="s9-grid">
      <div class="faq-col">
        <p class="section-label">FAQ</p>
        <h2 class="section-heading">よくある質問</h2>
        <div class="faq-list">${faqs}
        </div>
      </div>
      ${formHtml}
    </div>
  </div>
</section>`;
}

// S10: Closing
function renderS10(data: LPData, layout: LayoutIndex): string {
  const { s10 } = data;
  const s10Bg = bgStyle(data.images["s10_bg"]);

  if (layout === 0) {
    // Layout 0: primary-dark色背景、中央揃え、横並びCTA
    return `<!-- S10: Closing [Layout 0] -->
<section class="s10 s10-layout0"${s10Bg}>
  <div class="container">
    <div class="closing-inner">
      <p class="closing-copy">${esc(s10.microCopy)}</p>
      <div class="closing-cta-row closing-cta-row-h">
        <a href="#contact" class="btn-primary">${esc(s10.cta1)}</a>
        <a href="#contact" class="btn-secondary btn-secondary-white">${esc(s10.cta2)}</a>
      </div>
    </div>
  </div>
</section>`;
  }

  if (layout === 1) {
    // Layout 1: primary-dark色背景、縦積みCTA
    return `<!-- S10: Closing [Layout 1] -->
<section class="s10 s10-layout1"${s10Bg}>
  <div class="container">
    <div class="closing-inner">
      <p class="closing-copy">${esc(s10.microCopy)}</p>
      <div class="closing-cta-row closing-cta-row-v">
        <a href="#contact" class="btn-primary">${esc(s10.cta1)}</a>
        <a href="#contact" class="btn-secondary btn-secondary-white">${esc(s10.cta2)}</a>
      </div>
    </div>
  </div>
</section>`;
  }

  // Layout 2: secondary色背景、白テキスト、ゴールドCTA、セカンダリはwhite/transparent
  return `<!-- S10: Closing [Layout 2] -->
<section class="s10 s10-layout2"${s10Bg}>
  <div class="container">
    <div class="closing-inner">
      <p class="closing-copy">${esc(s10.microCopy)}</p>
      <div class="closing-cta-row closing-cta-row-h">
        <a href="#contact" class="btn-primary">${esc(s10.cta1)}</a>
        <a href="#contact" class="btn-secondary btn-secondary-white">${esc(s10.cta2)}</a>
      </div>
    </div>
  </div>
</section>`;
}

// S11: Footer
function renderS11(data: LPData, layout: LayoutIndex): string {
  const { s11 } = data;
  const links = s11.links
    .map((link) => `<a href="#" class="footer-link">${esc(link)}</a>`)
    .join("");

  if (layout === 0) {
    // Layout 0: secondary色背景、ロゴ左・リンク横並び右
    return `<!-- S11: Footer [Layout 0] -->
<footer class="s11 s11-layout0">
  <div class="container footer-inner">
    <div class="footer-logo">
      <span class="logo-text logo-white">サービス名</span>
    </div>
    <nav class="footer-nav">${links}</nav>
  </div>
  <div class="footer-copy">${esc(s11.copyright)}</div>
</footer>`;
  }

  if (layout === 1) {
    // Layout 1: secondary色背景、ロゴ＋タグライン左・リンク横並び右
    return `<!-- S11: Footer [Layout 1] -->
<footer class="s11 s11-layout1">
  <div class="container footer-inner">
    <div class="footer-logo">
      <span class="logo-text logo-white">サービス名</span>
      <span class="footer-tagline">スキマバイト募集サービス</span>
    </div>
    <nav class="footer-nav">${links}</nav>
  </div>
  <div class="footer-copy">${esc(s11.copyright)}</div>
</footer>`;
  }

  // Layout 2: secondary色背景、全要素中央揃え
  return `<!-- S11: Footer [Layout 2] -->
<footer class="s11 s11-layout2">
  <div class="container footer-center">
    <div class="footer-logo">
      <span class="logo-text logo-white">サービス名</span>
    </div>
    <nav class="footer-nav footer-nav-center">${links}</nav>
    <div class="footer-copy footer-copy-center">${esc(s11.copyright)}</div>
  </div>
</footer>`;
}

// ────────────────────────────────────────────────────────────
// セクションディスパッチャ
// ────────────────────────────────────────────────────────────

function renderSectionHtml(
  key: SectionKey,
  data: LPData,
  layout: LayoutIndex
): string {
  switch (key) {
    case "s1":  return renderS1(data, layout);
    case "s2":  return renderS2(data, layout);
    case "s3":  return renderS3(data, layout);
    case "s4":  return renderS4(data, layout);
    case "s5":  return renderS5(data, layout);
    case "s6":  return renderS6(data, layout);
    case "s7":  return renderS7(data, layout);
    case "s8":  return renderS8(data, layout);
    case "s9":  return renderS9(data, layout);
    case "s10": return renderS10(data, layout);
    case "s11": return renderS11(data, layout);
    default:    return "";
  }
}

// ────────────────────────────────────────────────────────────
// CSS 生成
// ────────────────────────────────────────────────────────────

function buildCss(palette: ColorPalette): string {
  return `/* ===== Reset & Base ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  font-size: 16px;
  line-height: 1.8;
  letter-spacing: 0.04em;
  color: var(--color-text);
  background: var(--color-bg);
}
img { max-width: 100%; height: auto; display: block; }
a { text-decoration: none; color: inherit; }

/* ===== CSS Custom Properties (Palette ${palette}) ===== */
:root {${getPaletteVars(palette)}
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 48px;
  --space-xl: 80px;
  --space-xl-sp: 56px;
}

/* ===== Layout ===== */
.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}
section { padding: var(--space-xl) 0; }

/* ===== Typography ===== */
.section-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-text-light);
  text-transform: uppercase;
  margin-bottom: 12px;
}
.section-heading {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: var(--color-secondary);
  margin-bottom: var(--space-lg);
}
.body-text {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  letter-spacing: 0.04em;
  color: var(--color-text);
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: var(--color-secondary);
  margin-bottom: var(--space-xs);
}
.card-desc {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.8;
  letter-spacing: 0.04em;
  color: var(--color-text-light);
}
.text-left { text-align: left; }
.text-white { color: #FFFFFF; }
.text-white-light { color: rgba(255,255,255,0.85); }

/* ===== Buttons ===== */
.btn-primary {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-secondary);
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
}
.btn-primary:hover { background: var(--color-primary-dark); }
.btn-secondary {
  display: inline-block;
  background: transparent;
  color: var(--color-secondary);
  padding: 16px 32px;
  border: 2px solid var(--color-secondary);
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.btn-secondary:hover { background: var(--color-secondary); color: #FFFFFF; }
.btn-secondary-white {
  border-color: #FFFFFF;
  color: #FFFFFF;
}
.btn-secondary-white:hover { background: #FFFFFF; color: var(--color-secondary); }
.btn-block { display: block; width: 100%; text-align: center; }
.text-link {
  color: var(--color-primary-dark);
  text-decoration: underline;
  font-weight: 500;
  font-size: 14px;
}

/* ===== Cards ===== */
.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  transition: box-shadow 0.2s;
}
.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.card-center { text-align: center; }
.card-image { margin-top: var(--space-sm); }
.card-image-top { margin-bottom: var(--space-sm); }

/* ===== Grid Systems ===== */
.cards-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}
.cards-2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

/* ===== Badges ===== */
.point-badge {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  margin-bottom: var(--space-xs);
  letter-spacing: 0.05em;
}
.case-badge {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  margin-bottom: var(--space-xs);
}

/* ===== Images ===== */
.img-radius { border-radius: 8px; }
.img-fullwidth { width: 100%; height: auto; border-radius: 0; }

/* ===== Section CTA rows ===== */
.section-cta-row {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  margin-top: var(--space-lg);
  flex-wrap: wrap;
}
.section-link-row {
  text-align: center;
  margin-top: var(--space-md);
  margin-bottom: var(--space-sm);
}

/* ===== S1: Header ===== */
.s1 {
  position: sticky;
  top: 0;
  z-index: 100;
}
.s1-layout0 {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}
.s1-layout1 {
  background: var(--color-secondary);
}
.s1-layout2 {
  background: var(--color-bg);
  border-bottom: 4px solid var(--color-primary);
}
.s1-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: var(--space-md);
}
.s1-logo { display: flex; align-items: center; gap: var(--space-xs); flex-shrink: 0; }
.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-secondary);
  letter-spacing: 0.02em;
}
.logo-white { color: #FFFFFF; }
.logo-gold { color: var(--color-primary); }
.logo-tagline {
  font-size: 11px;
  color: var(--color-text-light);
  font-weight: 400;
  margin-left: 6px;
}
.s1-nav { display: flex; align-items: center; gap: var(--space-sm); }
.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  transition: color 0.15s;
  white-space: nowrap;
}
.nav-link:hover { color: var(--color-primary-dark); }
.nav-white .nav-link { color: rgba(255,255,255,0.8); }
.nav-white .nav-link:hover { color: #FFFFFF; }
.s1-cta { flex-shrink: 0; }
.s1-layout1 .s1-cta .btn-primary,
.s1-layout2 .s1-cta .btn-primary { font-size: 14px; padding: 10px 20px; }
.s1-layout0 .s1-cta .btn-primary { font-size: 14px; padding: 10px 20px; }

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  gap: 5px;
  flex-shrink: 0;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-secondary);
  border-radius: 2px;
  transition: all 0.2s;
}
.hamburger-white span { background: #FFFFFF; }
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Drawer */
.drawer {
  display: none;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}
.drawer.open { display: flex; }
.drawer-dark { background: var(--color-secondary); }
.drawer-nav { display: flex; flex-direction: column; gap: var(--space-xs); }
.drawer-nav .nav-link { font-size: 15px; padding: var(--space-xs) 0; }
.drawer-dark .nav-link { color: rgba(255,255,255,0.85); }

/* ===== S2: Hero ===== */
.s2 { padding: var(--space-xl) 0; background: var(--color-bg); }
.hero-grid {
  display: grid;
  align-items: center;
  gap: var(--space-md);
  min-height: 600px;
}
.hero-grid-60-40 { grid-template-columns: 6fr 4fr; }
.hero-grid-40-60 { grid-template-columns: 4fr 6fr; }
.hero-text { display: flex; flex-direction: column; gap: var(--space-sm); }
.hero-main-copy {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: var(--color-secondary);
}
.hero-copy-52 { font-size: 52px; }
.hero-sub-copy {
  font-size: 16px;
  color: var(--color-text-light);
  line-height: 1.8;
}
.hero-cta-row {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-top: var(--space-sm);
}
.hero-cta-center { justify-content: center; }
.hero-center { max-width: 760px; margin: 0 auto; text-align: center; }
.trust-badges {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-top: var(--space-sm);
}
.trust-badges-center { justify-content: center; }
.trust-badge {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-light);
}
.trust-badge + .trust-badge::before { content: "・"; color: var(--color-border); }
.hero-image img { width: 100%; border-radius: 8px; }
.hero-fullwidth-img { margin-top: var(--space-lg); }
.hero-fullwidth-img img { width: 100%; }

/* ===== S3: Message ===== */
.s3-layout0 { background: var(--color-bg-alt); }
.s3-layout1 { background: var(--color-bg); }
.s3-layout2 { background: var(--color-secondary); }
.message-center { max-width: 720px; margin: 0 auto; text-align: center; }
.message-quote {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  max-width: 900px;
  margin: 0 auto;
}
.quote-mark {
  font-size: 140px;
  line-height: 0.8;
  color: var(--color-primary);
  flex-shrink: 0;
  font-family: Georgia, serif;
}
.message-quote-body { flex: 1; }
.label-primary-op { color: rgba(255,215,0,0.7); }

/* ===== S4: Problems ===== */
.s4-layout0, .s4-layout4 { background: var(--color-bg); }
.icon-box-gray {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-sm);
  background: var(--color-bg-alt);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-box-gray img { width: 48px; height: 48px; }
.num-box-gold {
  width: 48px;
  height: 48px;
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: var(--space-sm);
}
.problem-list { display: flex; flex-direction: column; gap: 0; }
.problem-list-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border);
}
.problem-list-item:last-child { border-bottom: none; }
.num-gold-inline {
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* ===== S5: Features ===== */
.feature-wide-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 28px 32px;
  transition: box-shadow 0.2s;
}
.feature-wide-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.features-1col { display: flex; flex-direction: column; gap: var(--space-md); }
.feature-wide-num {
  width: 80px;
  height: 80px;
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}
.feature-wide-text { flex: 1; }
.feature-wide-img { flex-shrink: 0; }
.feature-wide-img img { width: 200px; height: 140px; object-fit: cover; border-radius: 8px; }

/* ===== S6: Categories ===== */
.cat-img { margin: 0 auto var(--space-sm); }
.cat-img img { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; margin: 0 auto; }
.cat-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.cat-list-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
}
.cat-list-img img { width: 120px; height: 90px; object-fit: cover; border-radius: 8px; }

/* ===== S7: Case Studies ===== */
.case-img { margin-bottom: var(--space-sm); overflow: hidden; border-radius: 8px; }
.case-img img { width: 100%; height: 160px; object-fit: cover; }
.cases-1col { display: flex; flex-direction: column; gap: var(--space-md); }
.case-wide-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  transition: box-shadow 0.2s;
}
.case-wide-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.case-wide-img img { width: 240px; height: 160px; object-fit: cover; border-radius: 8px; }
.case-wide-text { flex: 1; }

/* ===== S8: Flow ===== */
.flow-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  position: relative;
}
.flow-step { position: relative; text-align: center; }
.flow-num-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-sm);
}
.flow-num-square {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--color-secondary);
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-sm);
}
.flow-icon { margin-bottom: var(--space-sm); }
.flow-icon img { width: 48px; height: 48px; margin: 0 auto; }
.flow-arrow {
  position: absolute;
  top: 20px;
  right: -16px;
  font-size: 20px;
  color: var(--color-primary);
  font-weight: 700;
}
.flow-vert { display: flex; flex-direction: column; max-width: 640px; margin: 0 auto; }
.flow-vert-step { display: flex; gap: var(--space-md); align-items: flex-start; }
.flow-vert-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.flow-vert-line {
  width: 2px;
  flex: 1;
  min-height: 32px;
  background: var(--color-border);
  margin: var(--space-xs) 0;
}
.flow-vert-content { padding-bottom: var(--space-md); }

/* ===== S9: Form & FAQ ===== */
.s9-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: flex-start;
}
.faq-col {}
.faq-list { display: flex; flex-direction: column; gap: 0; }
.faq-item { border-bottom: 1px solid var(--color-border); }
.faq-item:first-child { border-top: 1px solid var(--color-border); }
.faq-question {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-secondary);
  text-align: left;
  line-height: 1.6;
  font-family: inherit;
}
.faq-question:hover { color: var(--color-primary-dark); }
.faq-icon {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 400;
  color: var(--color-primary);
  transition: transform 0.2s;
}
.faq-question[aria-expanded="true"] .faq-icon { transform: rotate(45deg); }
.faq-answer {
  padding: 0 0 var(--space-sm) var(--space-lg);
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.8;
}
.faq-q-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 13px;
  font-weight: 700;
  border-radius: 4px;
  flex-shrink: 0;
}
.faq-num-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: var(--color-secondary);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 700;
  border-radius: 4px;
  flex-shrink: 0;
}

/* Contact Form */
.contact-form-wrap {
  background: var(--color-bg);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: var(--space-lg) var(--space-md);
}
.form-heading {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: var(--space-xs);
  line-height: 1.4;
}
.contact-form { display: flex; flex-direction: column; gap: var(--space-sm); margin-top: var(--space-md); }
.form-group { display: flex; flex-direction: column; gap: var(--space-xs); }
.form-label { font-size: 14px; font-weight: 600; color: var(--color-text); }
.required { color: var(--color-text-light); font-size: 12px; font-weight: 600; }
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 16px;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: inherit;
  transition: border-color 0.2s;
  outline: none;
}
.form-input:focus { border-color: var(--color-primary); }
.form-select { appearance: none; cursor: pointer; }
.form-checkbox-group { flex-direction: row; align-items: center; }
.form-checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 14px;
  color: var(--color-text);
  cursor: pointer;
}
.form-checkbox { width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer; }

/* ===== S10: Closing ===== */
.s10-layout0, .s10-layout1 { background: var(--color-primary-dark); }
.s10-layout2 { background: var(--color-secondary); }
.closing-inner { text-align: center; }
.closing-copy {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: var(--space-lg);
  line-height: 1.5;
}
.closing-cta-row { display: flex; gap: var(--space-sm); justify-content: center; flex-wrap: wrap; }
.closing-cta-row-v { flex-direction: column; align-items: center; max-width: 400px; margin: 0 auto; }
.closing-cta-row-v .btn-primary,
.closing-cta-row-v .btn-secondary { width: 100%; }

/* ===== S11: Footer ===== */
.s11 {
  background: var(--color-secondary);
  color: #FFFFFF;
  padding: var(--space-lg) 0;
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
}
.footer-logo { display: flex; align-items: center; gap: var(--space-xs); }
.footer-tagline { font-size: 11px; color: rgba(255,255,255,0.6); }
.footer-nav { display: flex; flex-wrap: wrap; gap: var(--space-sm); }
.footer-link {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  transition: color 0.15s;
}
.footer-link:hover { color: var(--color-primary); }
.footer-copy {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  padding-top: var(--space-sm);
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: center;
}
.footer-center { text-align: center; }
.footer-nav-center { justify-content: center; }
.footer-copy-center { text-align: center; }
.s11-layout2 .footer-inner { flex-direction: column; align-items: center; }

/* ===== Responsive ===== */
@media (max-width: 1023px) {
  .container { padding: 0 16px; }
  section { padding: var(--space-xl-sp) 0; }
  .section-heading { font-size: 22px; }

  /* S1 */
  .s1-nav, .s1-cta { display: none; }
  .hamburger { display: flex; }
  .s1-inner { height: 56px; }

  /* S2 */
  .hero-grid { grid-template-columns: 1fr; min-height: auto; }
  .hero-grid-40-60 .hero-image { order: -1; }
  .hero-main-copy { font-size: 28px; }
  .hero-copy-52 { font-size: 28px; }

  /* S4 / S5 / S6 / S7 */
  .cards-3col { grid-template-columns: 1fr; }
  .cards-2col { grid-template-columns: 1fr; }

  /* S5 layout2 */
  .feature-wide-card { flex-direction: column; }
  .feature-wide-img img { width: 100%; height: auto; }

  /* S7 layout2 */
  .case-wide-card { flex-direction: column; }
  .case-wide-img img { width: 100%; height: auto; }

  /* S8 */
  .flow-grid { grid-template-columns: 1fr; }
  .flow-arrow { display: none; }

  /* S9 */
  .s9-grid { grid-template-columns: 1fr; }

  /* S10 */
  .closing-copy { font-size: 20px; }

  /* S11 */
  .footer-inner { flex-direction: column; text-align: center; }
  .footer-nav { justify-content: center; }

  /* Quote */
  .message-quote { flex-direction: column; }
  .quote-mark { font-size: 80px; }
}`;
}

// ────────────────────────────────────────────────────────────
// JS 生成（FAQアコーディオン + ハンバーガーメニュー）
// ────────────────────────────────────────────────────────────

function buildJs(): string {
  return `
// Hamburger menu
(function() {
  var hamburgers = document.querySelectorAll('.hamburger');
  var drawer = document.getElementById('drawer');
  hamburgers.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var isOpen = btn.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (drawer) drawer.classList.toggle('open', isOpen);
    });
  });

  // Close drawer when nav link clicked
  if (drawer) {
    var drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(function(a) {
      a.addEventListener('click', function() {
        drawer.classList.remove('open');
        hamburgers.forEach(function(btn) {
          btn.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    });
  }
})();

// FAQ accordion
(function() {
  var items = document.querySelectorAll('.faq-item');
  items.forEach(function(item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', function() {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      items.forEach(function(other) {
        var otherBtn = other.querySelector('.faq-question');
        var otherAns = other.querySelector('.faq-answer');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAns) otherAns.hidden = true;
      });
      // Toggle clicked
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
})();
`;
}

// ────────────────────────────────────────────────────────────
// メイン関数
// ────────────────────────────────────────────────────────────

export function generateHtml(
  data: LPData,
  sectionOrder: SectionKey[],
  sectionLayouts: SectionLayouts,
  palette: ColorPalette,
  hiddenSections: SectionKey[] = []
): string {
  const css = buildCss(palette);
  const js = buildJs();

  const sectionsHtml = sectionOrder
    .filter((key) => !hiddenSections.includes(key))
    .map((key) => {
      const layout = (sectionLayouts[key] ?? 0) as LayoutIndex;
      return renderSectionHtml(key, data, layout);
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LP</title>
  <style>
${css}
  </style>
</head>
<body>
${sectionsHtml}
  <script>
${js}
  </script>
</body>
</html>`;
}
