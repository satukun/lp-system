"use client";

import React from "react";
import type { LPData, SectionKey, LayoutIndex } from "@/lib/types";
import "@/styles/lp-preview.css";

const PH = (w: number, h: number, text: string) =>
  `https://placehold.co/${w}x${h}/E0E0E0/666666?text=${encodeURIComponent(text)}`;

// ── S1 Header ──
// A (layout 0): スタンダード — clean white, standard layout
// B (layout 1): ゴールドライン — white + border-bottom: 3px solid #FFD700
// C (layout 2): ロゴアクセント — white + gold left border on logo
function S1({ d, layout }: { d: LPData["s1"]; layout: LayoutIndex }) {
  const headerStyle: React.CSSProperties = {
    background: "#fff",
    borderBottom: layout === 1 ? "3px solid #FFD700" : "1px solid #E0E0E0",
    padding: "16px 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };
  const logoStyle: React.CSSProperties =
    layout === 2
      ? { borderLeft: "4px solid #FFD700", paddingLeft: 12 }
      : {};

  return (
    <header style={headerStyle}>
      <div className="lp-container">
        <div className="lp-header-inner">
          <div className="lp-logo" style={logoStyle}>🏢 SERVICE</div>
          <nav>
            <ul className="lp-nav">
              {d.menuItems.map((item, i) => <li key={i}><a href="#">{item}</a></li>)}
            </ul>
          </nav>
          <a href="#" className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>{d.ctaText}</a>
        </div>
      </div>
    </header>
  );
}

// ── S2 Hero ──
// ALWAYS: white bg, left-copy 60% / right-image 40%, min-height 600px, ALWAYS has image
// A (layout 0): スタンダード — trust badges as inline dot-separated text
// B (layout 1): バッジ強調 — trust badges as bordered pill style
// C (layout 2): スタット型 — trust badges as 3 horizontal stat boxes with gold top border
function S2({ d, layout }: { d: LPData["s2"]; layout: LayoutIndex }) {
  const renderTrustBadges = () => {
    if (layout === 1) {
      return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
          {d.trustBadges.map((b, i) => (
            <span key={i} style={{
              background: "#F5F5F0",
              border: "1px solid #E0E0E0",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: "clamp(12px,1.3cqw,14px)",
              fontWeight: 600,
              color: "#1A1A2E",
            }}>{b}</span>
          ))}
        </div>
      );
    }
    if (layout === 2) {
      return (
        <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
          {d.trustBadges.map((b, i) => (
            <div key={i} style={{
              borderTop: "2px solid #FFD700",
              background: "#F5F5F0",
              padding: "12px 20px",
              marginRight: 2,
              fontSize: "clamp(12px,1.3cqw,14px)",
              fontWeight: 700,
              color: "#1A1A2E",
            }}>{b}</div>
          ))}
        </div>
      );
    }
    // layout 0: inline dot-separated
    return (
      <div className="lp-trust-badges">
        {d.trustBadges.map((b, i) => <span key={i}>{b}</span>)}
      </div>
    );
  };

  return (
    <section className="lp-hero">
      <div className="lp-container">
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <h1>{d.mainCopy}</h1>
            <p>{d.subCopy}</p>
            <div className="lp-hero-actions">
              <a href="#" className="btn-primary">{d.ctaText}</a>
              <a href="#" className="btn-secondary">{d.secondaryCtaText}</a>
            </div>
            {renderTrustBadges()}
          </div>
          <div className="lp-hero-visual">
            <img src={PH(480, 360, "Hero Visual")} alt="ヒーロービジュアル" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── S3 Message ──
// ALWAYS: alt #F5F5F0 bg, centered column, max-width 720px
// A (layout 0): センター — standard label + h2 + body, centered
// B (layout 1): ゴールドライン — h2 with gold bottom border
// C (layout 2): カードスタイル — content wrapped in white card with gold left border
function S3({ d, layout }: { d: LPData["s3"]; layout: LayoutIndex }) {
  const innerContent = (
    <>
      <p className="lp-label">OVERVIEW</p>
      <h2 style={layout === 1 ? { display: "inline-block", borderBottom: "2px solid #FFD700", paddingBottom: 8 } : {}}>
        {d.heading}
      </h2>
      <p>{d.body}</p>
    </>
  );

  if (layout === 2) {
    return (
      <section className="lp-message">
        <div className="lp-message-inner">
          <div className="lp-message-card">
            {innerContent}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lp-message">
      <div className="lp-message-inner">
        {innerContent}
      </div>
    </section>
  );
}

// ── S4 Problems ──
// ALWAYS: white bg, 3-col cards
// A (layout 0): アイコンカード — gray icon box centered + heading + desc, text centered
// B (layout 1): ナンバーカード — gold number box (48x48) left-aligned + heading + desc
// C (layout 2): トップボーダー — cards with border-top: 4px solid #FFD700 + icon box centered + heading + desc
function S4({ d, layout }: { d: LPData["s4"]; layout: LayoutIndex }) {
  return (
    <section className="lp-section lp-problems">
      <div className="lp-container">
        <p className="lp-label" style={{ textAlign: "center" }}>PROBLEMS</p>
        <h2 className="lp-heading" style={{ textAlign: "center" }}>{d.sectionHeading}</h2>
        <div className="lp-cards-3">
          {d.cards.map((card, i) => {
            const cardStyle: React.CSSProperties =
              layout === 2
                ? { borderTop: "4px solid #FFD700", textAlign: "center" }
                : layout === 1
                  ? { textAlign: "left" }
                  : { textAlign: "center" };
            return (
              <div key={i} className="lp-card" style={cardStyle}>
                {layout === 1 ? (
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: "#FFD700",
                    color: "#1A1A2E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 800,
                    marginBottom: 16,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                ) : (
                  <div className="lp-card-icon" />
                )}
                <h3 className="lp-card-title">{card.heading}</h3>
                <p className="lp-card-desc">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── S5 Features ──
// ALWAYS: alt #F5F5F0 bg, 3-col cards, white card bg
// A (layout 0): イメージカード — POINT badge + title + desc + image at bottom
// B (layout 1): イメージトップ — image at TOP of card, then POINT badge + title + desc
// C (layout 2): ナンバーカード — large number box + title + desc (no image)
function S5({ d, layout }: { d: LPData["s5"]; layout: LayoutIndex }) {
  return (
    <section className="lp-section-alt">
      <div className="lp-container">
        <p className="lp-label" style={{ textAlign: "center" }}>FEATURES</p>
        <h2 className="lp-heading" style={{ textAlign: "center" }}>{d.sectionHeading}</h2>
        <div className="lp-cards-3">
          {d.cards.map((card, i) => (
            <div key={i} className="lp-card">
              {layout === 1 && (
                <img
                  src={PH(280, 160, `Feature ${i + 1}`)}
                  alt={card.imageHint}
                  style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
                />
              )}
              {layout === 2 ? (
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  background: "#F5F5F0",
                  color: "#1A1A2E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(28px,3.5cqw,40px)",
                  fontWeight: 800,
                  marginBottom: 16,
                }}>
                  {i + 1}
                </div>
              ) : (
                <span className="lp-card-point">{card.pointLabel}</span>
              )}
              <h3 className="lp-card-title" style={layout === 2 ? { marginTop: 0 } : {}}>{card.title}</h3>
              <p className="lp-card-desc">{card.description}</p>
              {layout === 0 && (
                <img
                  src={PH(280, 160, `Feature ${i + 1}`)}
                  alt={card.imageHint}
                  style={{ width: "100%", borderRadius: 8, marginTop: 16 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── S6 Categories ──
// ALWAYS: white bg, 3x2 grid, gap 16px
// A (layout 0): スタンダード — image 120px + card body with name + subtext
// B (layout 1): ラージイメージ — same but image 160px high
// C (layout 2): アクセントボーダー — same as A but border-top: 4px solid #FFD700 on each card
function S6({ d, layout }: { d: LPData["s6"]; layout: LayoutIndex }) {
  const imgHeight = layout === 1 ? 160 : 120;
  return (
    <section className="lp-section">
      <div className="lp-container">
        <p className="lp-label" style={{ textAlign: "center" }}>CATEGORIES</p>
        <h2 className="lp-heading" style={{ textAlign: "center" }}>{d.sectionHeading}</h2>
        <div className="lp-cards-6">
          {d.cards.map((card, i) => (
            <div
              key={i}
              className="lp-category-card"
              style={layout === 2 ? { borderTop: "4px solid #FFD700" } : {}}
            >
              <img
                src={PH(320, imgHeight, card.name)}
                alt={card.imageHint}
                style={{ width: "100%", height: imgHeight, objectFit: "cover", display: "block" }}
              />
              <div className="lp-category-card-body">
                <p className="lp-category-card-name">{card.name}</p>
                <p className="lp-category-card-sub">{card.subText}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="lp-cta-area">
          <a href="#" className="btn-primary">{d.cta1}</a>
          <a href="#" className="btn-secondary">{d.cta2}</a>
        </div>
      </div>
    </section>
  );
}

// ── S7 Case Studies ──
// ALWAYS: alt #F5F5F0 bg, 3-col cards
// A (layout 0): スタンダード — image + company name + summary
// B (layout 1): タグバッジ — same + "導入事例" tag badge above company name
// C (layout 2): トップボーダー — same as A but border-top: 4px solid #FFD700 on each card
function S7({ d, layout }: { d: LPData["s7"]; layout: LayoutIndex }) {
  return (
    <section className="lp-section-alt">
      <div className="lp-container">
        <p className="lp-label" style={{ textAlign: "center" }}>CASE STUDIES</p>
        <h2 className="lp-heading" style={{ textAlign: "center" }}>{d.sectionHeading}</h2>
        <div className="lp-cards-3">
          {d.cards.map((card, i) => (
            <div key={i} className="lp-card lp-case-card" style={{
              padding: 0,
              ...(layout === 2 ? { borderTop: "4px solid #FFD700" } : {}),
            }}>
              <img src={PH(360, 180, card.companyName)} alt={card.imageHint} />
              <div className="lp-case-card-body">
                {layout === 1 && (
                  <span style={{
                    background: "#FFD700",
                    color: "#1A1A2E",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 4,
                    display: "inline-block",
                    marginBottom: 8,
                  }}>導入事例</span>
                )}
                <h3 className="lp-card-title">{card.companyName}</h3>
                <p className="lp-card-desc">{card.summary}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="lp-link">{d.linkText} →</a>
        <div className="lp-cta-area">
          <a href="#" className="btn-primary">{d.cta1}</a>
          <a href="#" className="btn-secondary">{d.cta2}</a>
        </div>
      </div>
    </section>
  );
}

// ── S8 Flow ──
// ALWAYS: white bg, horizontal steps PC → 2-col tablet → 1-col SP
// A (layout 0): ゴールドサークル — gold circle numbers + → arrow between steps
// B (layout 1): ダークスクエア — dark square numbers with gold text, NO arrows (lp-flow-steps--square)
// C (layout 2): カードステップ — each step in white bordered card, gold circle numbers, NO arrows (lp-flow-steps--card)
function S8({ d, layout }: { d: LPData["s8"]; layout: LayoutIndex }) {
  const stepsClass =
    layout === 1 ? "lp-flow-steps lp-flow-steps--square"
    : layout === 2 ? "lp-flow-steps lp-flow-steps--card"
    : "lp-flow-steps";

  return (
    <section className="lp-section">
      <div className="lp-container">
        <p className="lp-label" style={{ textAlign: "center" }}>FLOW</p>
        <h2 className="lp-heading" style={{ textAlign: "center" }}>{d.sectionHeading}</h2>
        <div className={stepsClass}>
          {d.steps.map((step, i) => (
            <div key={i} className="lp-flow-step">
              <div className="lp-flow-step-num">{i + 1}</div>
              <h3 className="lp-flow-step-title">{step.title}</h3>
              <p className="lp-flow-step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── S9 FAQ + Form ──
// ALWAYS: alt #F5F5F0 bg, FAQ LEFT / Form RIGHT — NEVER SWAP
// A (layout 0): スタンダード — FAQ with "Q." CSS prefix, standard dividers
// B (layout 1): ゴールドプレフィックス — Q. styled as gold pill badge
// C (layout 2): ナンバープレフィックス — numbered ①②③④⑤ styled as dark pill badge with gold text
const FORM_FIELDS = [
  { label: "お名前", type: "text", placeholder: "山田 太郎" },
  { label: "会社名", type: "text", placeholder: "株式会社サンプル" },
  { label: "メールアドレス", type: "email", placeholder: "example@company.co.jp" },
  { label: "電話番号", type: "tel", placeholder: "03-1234-5678" },
];

function S9({ d, layout }: { d: LPData["s9"]; layout: LayoutIndex }) {
  const NUMBER_PREFIXES = ["①", "②", "③", "④", "⑤"];

  const renderFaqQ = (i: number) => {
    if (layout === 1) {
      return (
        <span style={{
          background: "#FFD700",
          color: "#1A1A2E",
          fontSize: 11,
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: 4,
          marginRight: 8,
        }}>Q</span>
      );
    }
    if (layout === 2) {
      return (
        <span style={{
          background: "#1A1A2E",
          color: "#FFD700",
          fontSize: 11,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 4,
          marginRight: 8,
        }}>{NUMBER_PREFIXES[i]}</span>
      );
    }
    return null; // layout 0 uses CSS ::before "Q."
  };

  return (
    <section className="lp-section-alt">
      <div className="lp-container">
        <p className="lp-label" style={{ textAlign: "center" }}>CONTACT</p>
        <div className="lp-contact-grid">
          {/* FAQ — always LEFT */}
          <div>
            <h2 className="lp-heading" style={{ fontSize: 22, marginBottom: 24 }}>よくある質問</h2>
            {d.faqs.map((faq, i) => (
              <div key={i} className="lp-faq-item">
                <p
                  className={layout === 0 ? "lp-faq-q" : ""}
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#1A1A2E",
                    margin: "0 0 8px 0",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 0,
                  }}
                >
                  {layout === 0
                    ? faq.question  // CSS ::before handles "Q."
                    : <><span>{renderFaqQ(i)}</span>{faq.question}</>
                  }
                </p>
                <p className="lp-faq-a">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Form — always RIGHT */}
          <div className="lp-form">
            <h3>{d.formHeading}</h3>
            {FORM_FIELDS.map((f, i) => (
              <div key={i} className="lp-form-field">
                <label className="lp-form-label">{f.label} <span style={{ color: "#E6C200" }}>*</span></label>
                <input className="lp-form-input" type={f.type} placeholder={f.placeholder} readOnly />
              </div>
            ))}
            <div className="lp-form-field">
              <label className="lp-form-label">従業員数 <span style={{ color: "#E6C200" }}>*</span></label>
              <select className="lp-form-input">
                <option>選択してください</option>
                <option>1〜10名</option>
                <option>11〜50名</option>
                <option>51〜300名</option>
                <option>301名以上</option>
              </select>
            </div>
            <div className="lp-form-field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" id="privacy" readOnly />
              <label htmlFor="privacy" style={{ fontSize: 13, color: "#666" }}>プライバシーポリシーに同意する</label>
            </div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 8 }}>資料を請求する</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── S10 Closing ──
// ALWAYS: #E6C200 bg, centered
// A (layout 0): スタンダード — heading + CTA1 + CTA2 horizontal
// B (layout 1): スタックCTA — heading + CTA1 full-width + CTA2 below (lp-closing-actions--stacked)
// C (layout 2): デコレーションライン — same horizontal CTAs but heading has thin border-top/bottom
function S10({ d, layout }: { d: LPData["s10"]; layout: LayoutIndex }) {
  const headingStyle: React.CSSProperties =
    layout === 2
      ? {
          borderTop: "1px solid rgba(26,26,46,0.25)",
          borderBottom: "1px solid rgba(26,26,46,0.25)",
          padding: "24px 0",
          marginBottom: 32,
        }
      : {};

  return (
    <section className="lp-closing">
      <div className="lp-container">
        <h2 style={headingStyle}>{d.microCopy}</h2>
        {layout === 1 ? (
          <div className="lp-closing-actions lp-closing-actions--stacked">
            <a href="#" className="btn-primary">{d.cta1}</a>
            <a href="#" className="btn-secondary" style={{ borderColor: "#1A1A2E", color: "#1A1A2E" }}>{d.cta2}</a>
          </div>
        ) : (
          <div className="lp-closing-actions">
            <a href="#" className="btn-primary">{d.cta1}</a>
            <a href="#" className="btn-secondary" style={{ borderColor: "#1A1A2E", color: "#1A1A2E" }}>{d.cta2}</a>
          </div>
        )}
      </div>
    </section>
  );
}

// ── S11 Footer ──
// ALWAYS: #1A1A2E bg, logo left, links right
// A (layout 0): スタンダード — logo left / links right single row
// B (layout 1): タグライン — logo left + tagline text below logo / links right
// C (layout 2): グループリンク — logo left / links right but separated into 2 visual groups
function S11({ d, layout }: { d: LPData["s11"]; layout: LayoutIndex }) {
  const half = Math.ceil(d.links.length / 2);

  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-inner">
          <div>
            <div className="lp-footer-logo">🏢 SERVICE</div>
            {layout === 1 && (
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6, lineHeight: 1.6 }}>
                一言でサービスの価値を伝えるタグライン
              </p>
            )}
          </div>
          <nav>
            {layout === 2 ? (
              <div style={{ display: "flex", gap: 40 }}>
                <ul className="lp-footer-links" style={{ flexDirection: "column", gap: 10 }}>
                  {d.links.slice(0, half).map((link, i) => <li key={i}><a href="#">{link}</a></li>)}
                </ul>
                <ul className="lp-footer-links" style={{ flexDirection: "column", gap: 10 }}>
                  {d.links.slice(half).map((link, i) => <li key={i}><a href="#">{link}</a></li>)}
                </ul>
              </div>
            ) : (
              <ul className="lp-footer-links">
                {d.links.map((link, i) => <li key={i}><a href="#">{link}</a></li>)}
              </ul>
            )}
          </nav>
        </div>
        <p className="lp-footer-copy">{d.copyright}</p>
      </div>
    </footer>
  );
}

// ── Public API ──
export function renderSection(key: SectionKey, data: LPData, layout: LayoutIndex): React.ReactElement {
  switch (key) {
    case "s1":  return <S1  key="s1"  d={data.s1}  layout={layout} />;
    case "s2":  return <S2  key="s2"  d={data.s2}  layout={layout} />;
    case "s3":  return <S3  key="s3"  d={data.s3}  layout={layout} />;
    case "s4":  return <S4  key="s4"  d={data.s4}  layout={layout} />;
    case "s5":  return <S5  key="s5"  d={data.s5}  layout={layout} />;
    case "s6":  return <S6  key="s6"  d={data.s6}  layout={layout} />;
    case "s7":  return <S7  key="s7"  d={data.s7}  layout={layout} />;
    case "s8":  return <S8  key="s8"  d={data.s8}  layout={layout} />;
    case "s9":  return <S9  key="s9"  d={data.s9}  layout={layout} />;
    case "s10": return <S10 key="s10" d={data.s10} layout={layout} />;
    case "s11": return <S11 key="s11" d={data.s11} layout={layout} />;
  }
}

export function SectionPreview({
  sectionKey,
  data,
  layout,
}: {
  sectionKey: SectionKey;
  data: LPData;
  layout: LayoutIndex;
}) {
  return (
    <div className="lp-preview-root">
      {renderSection(sectionKey, data, layout)}
    </div>
  );
}
