"use client";

import React from "react";
import type { LPData, SectionKey, LayoutIndex } from "@/lib/types";
import "@/styles/lp-preview.css";
import { SectionHeader, CtaRow } from "./SectionParts";

const PH = (w: number, h: number, text: string) =>
  `https://placehold.co/${w}x${h}/E0E0E0/666666?text=${encodeURIComponent(text)}`;

export type OnImageChange = (key: string, url: string) => void;

// ── UploadableImage ──
// onImageChange があればクリックでファイル選択オーバーレイを表示
function UploadableImage({
  src, alt, imageKey, onImageChange, imgStyle, wrapperStyle,
}: {
  src: string;
  alt: string;
  imageKey: string;
  onImageChange?: OnImageChange;
  imgStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isCustom = src.startsWith("data:");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onImageChange?.(imageKey, ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // wrapperStyle は onImageChange の有無に関わらず常に適用してレイアウトを保持する
  return (
    <div
      className={onImageChange ? "img-upload-wrap" : undefined}
      style={{ position: "relative", ...wrapperStyle }}
      onClick={onImageChange ? () => inputRef.current?.click() : undefined}
    >
      <img src={src} alt={alt} style={imgStyle} />
      {onImageChange && (
        <>
          <div className="img-upload-overlay"><span>画像を変更</span></div>
          <input
            ref={inputRef} type="file" accept="image/*"
            style={{ display: "none" }} onChange={handleChange}
          />
          {isCustom && (
            <button
              onClick={(e) => { e.stopPropagation(); onImageChange(imageKey, ""); }}
              title="画像をクリア"
              style={{
                position: "absolute", top: 4, right: 4, zIndex: 30,
                width: 20, height: 20, borderRadius: "50%",
                background: "rgba(0,0,0,0.6)", color: "#fff",
                border: "none", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 12, lineHeight: 1, backdropFilter: "blur(4px)",
              }}
            >×</button>
          )}
        </>
      )}
    </div>
  );
}

// ── 背景画像スタイル生成 ──
function bgImgStyle(url?: string): React.CSSProperties {
  if (!url) return {};
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

// ── BgUploadButton — 編集時のみ表示される背景画像変更ボタン ──
function BgUploadButton({ imageKey, onImageChange, currentUrl }: {
  imageKey: string; onImageChange?: OnImageChange; currentUrl?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  if (!onImageChange) return null;
  const hasImage = !!currentUrl;
  return (
    <div style={{ position: "absolute", top: 8, right: 8, zIndex: 20, display: "flex", gap: 4 }}>
      {hasImage && (
        <button
          onClick={(e) => { e.stopPropagation(); onImageChange(imageKey, ""); }}
          title="背景画像をクリア"
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "5px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500,
            background: "rgba(180,0,0,0.55)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.25)",
            cursor: "pointer", backdropFilter: "blur(6px)", whiteSpace: "nowrap",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(180,0,0,0.8)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(180,0,0,0.55)"; }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          クリア
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
          background: "rgba(0,0,0,0.5)", color: "#fff",
          border: "1px solid rgba(255,255,255,0.25)",
          cursor: "pointer", backdropFilter: "blur(6px)", whiteSpace: "nowrap",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.72)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.5)"; }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        {hasImage ? "変更" : "背景画像"}
      </button>
      <input
        ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = ev => onImageChange(imageKey, ev.target?.result as string);
          reader.readAsDataURL(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ── S1 Header ──
// A (layout 0): スタンダード — white bg, logo左・nav中央・CTA右
// B (layout 1): ダーク — dark navy bg, gold logo, white nav, gold CTA
// C (layout 2): ゴールドバー — white bg, thick gold bottom bar, compact
// D (layout 3): ミニマル — white bg, ロゴ中央・CTAのみ・ナビなし
function S1({ d, layout }: { d: LPData["s1"]; layout: LayoutIndex }) {
  if (layout === 3) {
    return (
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--color-border)",
        padding: "16px 0", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div className="lp-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", height: 40 }}>
            <div className="lp-logo" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              🏢 SERVICE
            </div>
            <a href="#" className="btn-primary" style={{ padding: "10px 20px", fontSize: 14, marginLeft: "auto" }}>
              {d.ctaText}
            </a>
          </div>
        </div>
      </header>
    );
  }

  if (layout === 1) {
    return (
      <header style={{
        background: "var(--color-secondary)", padding: "16px 0",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div className="lp-container">
          <div className="lp-header-inner">
            <div className="lp-logo" style={{ color: "#ffffff" }}>🏢 SERVICE</div>
            <nav>
              <ul className="lp-nav">
                {d.menuItems.map((item, i) => (
                  <li key={i}><a href="#" style={{ color: "rgba(255,255,255,0.8)" }}>{item}</a></li>
                ))}
              </ul>
            </nav>
            <a href="#" className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>{d.ctaText}</a>
          </div>
        </div>
      </header>
    );
  }

  if (layout === 2) {
    return (
      <header style={{
        background: "#fff", borderBottom: "4px solid var(--color-primary)",
        padding: "14px 0", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div className="lp-container">
          <div className="lp-header-inner">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div className="lp-logo" style={{ fontSize: "clamp(14px,1.6cqw,18px)" }}>🏢 SERVICE</div>
              <span style={{ fontSize: 10, color: "#999", letterSpacing: "0.1em" }}>YOUR TAGLINE HERE</span>
            </div>
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

  // Pattern A (layout 0): スタンダード — white bg, logo左・nav中央・CTA右
  return (
    <header style={{
      background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.1)",
      padding: "0 0", height: 80, position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center",
    }}>
      <div className="lp-container" style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#31302e", letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>
            サービスロゴ
          </span>
          <nav style={{ display: "flex", flexDirection: "row", gap: 32 }}>
            {d.menuItems.map((item, i) => (
              <a key={i} href="#" style={{ fontSize: 15, fontWeight: 500, color: "rgba(0,0,0,0.85)", textDecoration: "none" }}>{item}</a>
            ))}
          </nav>
          <a href="#" className="btn-primary" style={{ padding: "8px 16px", fontSize: 15 }}>{d.ctaText}</a>
        </div>
      </div>
    </header>
  );
}

// ── S2 Hero ──
// A (layout 0): スタンダード — 左テキスト60% / 右画像40%
// B (layout 1): センタード — 中央揃え、フルワイド画像下部
// C (layout 2): リバース — 左画像40% / 右テキスト60%
function S2({ d, layout, images, onImageChange }: {
  d: LPData["s2"]; layout: LayoutIndex;
  images: LPData["images"]; onImageChange?: OnImageChange;
}) {
  if (layout === 1) {
    return (
      <section className="lp-hero" style={{ textAlign: "center", position: "relative", ...bgImgStyle(images["s2_bg"]) }}>
        <BgUploadButton imageKey="s2_bg" onImageChange={onImageChange} currentUrl={images["s2_bg"]} />
        <div className="lp-container">
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p className="lp-label" style={{ marginBottom: 16 }}>HERO</p>
            <h1 style={{
              fontSize: "clamp(32px,4.5cqw,52px)", fontWeight: 700,
              color: "var(--color-secondary)", lineHeight: 1.3, letterSpacing: "0.02em", margin: "0 0 24px 0",
            }}>{d.mainCopy}</h1>
            <p style={{ fontSize: "clamp(15px,1.6cqw,18px)", color: "var(--color-text-light)", margin: "0 0 40px 0", lineHeight: 1.8 }}>{d.subCopy}</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
              <a href="#" className="btn-primary">{d.ctaText}</a>
              <a href="#" className="btn-secondary">{d.secondaryCtaText}</a>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
              {d.trustBadges.map((b, i) => (
                <span key={i} style={{
                  background: "#f2f9ff", border: "1px solid rgba(0,117,222,0.2)",
                  borderRadius: 9999, padding: "3px 12px",
                  fontSize: 12, fontWeight: 600, color: "#097fe8",
                  letterSpacing: "0.125px",
                }}>{b}</span>
              ))}
            </div>
            <UploadableImage
              src={images["s2_hero"] || PH(960, 400, "Hero Visual")}
              alt="ヒーロービジュアル" imageKey="s2_hero" onImageChange={onImageChange}
              imgStyle={{ width: "100%", borderRadius: 12, display: "block" }}
              wrapperStyle={{ borderRadius: 12 }}
            />
          </div>
        </div>
      </section>
    );
  }

  if (layout === 3) {
    // D: ダーク — secondary色背景、中央揃え、画像なし（コンバージョン特化）
    return (
      <section style={{ background: "var(--color-secondary)", padding: "var(--space-xl) 0", textAlign: "center", position: "relative", ...bgImgStyle(images["s2_bg"]) }}>
        <BgUploadButton imageKey="s2_bg" onImageChange={onImageChange} currentUrl={images["s2_bg"]} />
        <div className="lp-container">
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p className="lp-label" style={{ color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.1)" }}>HERO</p>
            <h1 style={{
              fontSize: "clamp(30px,4cqw,48px)", fontWeight: 700, color: "#ffffff",
              lineHeight: 1.1, letterSpacing: "-1.5px", margin: "0 0 24px 0",
            }}>{d.mainCopy}</h1>
            <p style={{ fontSize: "clamp(15px,1.6cqw,18px)", color: "rgba(255,255,255,0.75)", margin: "0 0 40px 0", lineHeight: 1.8 }}>{d.subCopy}</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
              <a href="#" className="btn-primary">{d.ctaText}</a>
              <a href="#" style={{
                background: "transparent", color: "#ffffff", padding: "8px 16px",
                border: "1px solid rgba(255,255,255,0.4)", borderRadius: 4,
                fontWeight: 600, fontSize: 15, cursor: "pointer", textDecoration: "none",
              }}>{d.secondaryCtaText}</a>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {d.trustBadges.map((b, i) => (
                <span key={i} style={{
                  background: "rgba(255,255,255,0.15)", borderRadius: 9999, padding: "3px 12px",
                  fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.125px",
                }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 2) {
    return (
      <section className="lp-hero" style={{ position: "relative", ...bgImgStyle(images["s2_bg"]) }}>
        <BgUploadButton imageKey="s2_bg" onImageChange={onImageChange} currentUrl={images["s2_bg"]} />
        <div className="lp-container">
          <div className="lp-hero-inner" style={{ gridTemplateColumns: "4fr 6fr" }}>
            <UploadableImage
              src={images["s2_hero"] || PH(480, 360, "Hero Visual")}
              alt="ヒーロービジュアル" imageKey="s2_hero" onImageChange={onImageChange}
              imgStyle={{ width: "100%", borderRadius: 8, display: "block" }}
              wrapperStyle={{ borderRadius: 8 }}
            />
            <div className="lp-hero-copy">
              <h1>{d.mainCopy}</h1>
              <p>{d.subCopy}</p>
              <div className="lp-hero-actions">
                <a href="#" className="btn-primary">{d.ctaText}</a>
                <a href="#" className="btn-secondary">{d.secondaryCtaText}</a>
              </div>
              <div className="lp-trust-badges">
                {d.trustBadges.map((b, i) => <span key={i}>{b}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Pattern A (layout 0): スタンダード — 左テキスト60% / 右画像40%
  return (
    <section style={{ background: "#ffffff", padding: "80px 0", minHeight: 600, position: "relative", ...bgImgStyle(images["s2_bg"]) }}>
      <BgUploadButton imageKey="s2_bg" onImageChange={onImageChange} currentUrl={images["s2_bg"]} />
      <div className="lp-container">
        <div style={{ display: "grid", gridTemplateColumns: "6fr 4fr", gap: 48, alignItems: "center" }}>
          <div>
            <span style={{
              background: "#f2f9ff", color: "#097fe8", borderRadius: 9999,
              padding: "3px 10px", fontSize: 12, fontWeight: 600, letterSpacing: 0.125,
              display: "inline-block", marginBottom: 16,
            }}>SOLUTION</span>
            <h1 style={{
              fontSize: "clamp(32px,4cqw,48px)", fontWeight: 700, color: "#31302e",
              letterSpacing: "-1.5px", lineHeight: 1.1, margin: "0 0 24px 0",
            }}>{d.mainCopy}</h1>
            <p style={{ fontSize: 16, color: "#615d59", lineHeight: 1.8, margin: "0 0 32px 0" }}>{d.subCopy}</p>
            <a href="#" className="btn-primary" style={{ padding: "10px 24px", fontSize: 15 }}>{d.ctaText}</a>
            <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
              {d.trustBadges.map((b, i) => (
                <span key={i} style={{ fontSize: 13, color: "#615d59" }}>{i > 0 ? "・ " : ""}{b}</span>
              ))}
            </div>
          </div>
          <UploadableImage
            src={images["s2_hero"] || PH(480, 400, "Hero Visual")}
            alt="ヒーロービジュアル" imageKey="s2_hero" onImageChange={onImageChange}
            imgStyle={{ width: "100%", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", display: "block" }}
            wrapperStyle={{ borderRadius: 8 }}
          />
        </div>
      </div>
    </section>
  );
}

// ── S3 Message ──
function S3({ d, layout, images, onImageChange }: {
  d: LPData["s3"]; layout: LayoutIndex;
  images: LPData["images"]; onImageChange?: OnImageChange;
}) {
  if (layout === 1) {
    return (
      <section className="lp-message" style={{ background: "var(--color-bg)", position: "relative", ...bgImgStyle(images["s3_bg"]) }}>
        <BgUploadButton imageKey="s3_bg" onImageChange={onImageChange} currentUrl={images["s3_bg"]} />
        <div className="lp-message-inner" style={{ textAlign: "left", position: "relative" }}>
          <div style={{
            fontSize: "clamp(80px,12cqw,140px)", lineHeight: 1, color: "var(--color-primary)",
            fontFamily: "Georgia, serif", position: "absolute", top: -20, left: -10, opacity: 0.6,
          }}>"</div>
          <div style={{ paddingLeft: "clamp(32px,5cqw,60px)" }}>
            <p className="lp-label">OVERVIEW</p>
            <h2 style={{
              fontSize: "clamp(22px,2.5cqw,28px)", fontWeight: 700, color: "var(--color-secondary)",
              margin: "0 0 24px 0", lineHeight: 1.5,
            }}>{d.heading}</h2>
            <p style={{ fontSize: "clamp(14px,1.5cqw,16px)", color: "var(--color-text)", lineHeight: 1.8 }}>{d.body}</p>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 2) {
    return (
      <section style={{ background: "var(--color-secondary)", padding: "var(--space-xl) 0", textAlign: "center", position: "relative", ...bgImgStyle(images["s3_bg"]) }}>
        <BgUploadButton imageKey="s3_bg" onImageChange={onImageChange} currentUrl={images["s3_bg"]} />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
          <p className="lp-label" style={{ color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.1)" }}>OVERVIEW</p>
          <h2 style={{
            fontSize: "clamp(22px,2.5cqw,28px)", fontWeight: 700, color: "#fff",
            margin: "0 0 24px 0", lineHeight: 1.6,
          }}>{d.heading}</h2>
          <p style={{ fontSize: "clamp(14px,1.5cqw,16px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>{d.body}</p>
        </div>
      </section>
    );
  }

  if (layout === 3) {
    // D: ツーカラム — 左見出し+ラベル / 右本文の2カラム
    return (
      <section className="lp-message" style={{ background: "var(--color-bg)", position: "relative", ...bgImgStyle(images["s3_bg"]) }}>
        <BgUploadButton imageKey="s3_bg" onImageChange={onImageChange} currentUrl={images["s3_bg"]} />
        <div className="lp-container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5cqw,64px)", alignItems: "start" }}>
            <div>
              <p className="lp-label">OVERVIEW</p>
              <h2 style={{
                fontSize: "clamp(22px,2.5cqw,30px)", fontWeight: 700, color: "var(--color-secondary)",
                margin: "0 0 20px 0", lineHeight: 1.3, letterSpacing: "-0.75px",
              }}>{d.heading}</h2>
            </div>
            <p style={{ fontSize: "clamp(14px,1.5cqw,16px)", color: "var(--color-text)", lineHeight: 1.8, paddingTop: "clamp(0px,3cqw,40px)" }}>{d.body}</p>
          </div>
        </div>
      </section>
    );
  }

  // Pattern A (layout 0): スタンダード — 中央揃え、薄いグレー背景
  return (
    <section style={{ background: "#f6f5f4", padding: "80px 0", position: "relative", ...bgImgStyle(images["s3_bg"]) }}>
      <BgUploadButton imageKey="s3_bg" onImageChange={onImageChange} currentUrl={images["s3_bg"]} />
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", padding: "0 24px" }}>
        <SectionHeader label="ABOUT" heading={d.heading} />
        <p style={{ fontSize: 16, color: "#615d59", lineHeight: 1.8, margin: 0 }}>{d.body}</p>
      </div>
    </section>
  );
}

// ── S4 Problems ──
function S4({ d, layout, images, onImageChange }: {
  d: LPData["s4"]; layout: LayoutIndex;
  images: LPData["images"]; onImageChange?: OnImageChange;
}) {
  if (layout === 3) {
    // D: ワイドカード — 横長カード2枚（番号+テキスト+画像）
    return (
      <section className="lp-section lp-problems" style={{ position: "relative", ...bgImgStyle(images["s4_bg"]) }}>
        <BgUploadButton imageKey="s4_bg" onImageChange={onImageChange} currentUrl={images["s4_bg"]} />
        <div className="lp-container">
          <SectionHeader label="PROBLEMS" heading={d.sectionHeading} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {d.cards.map((card, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24,
                alignItems: "center", background: "var(--color-bg-alt)",
                border: "1px solid var(--color-border)", borderRadius: 12, padding: "24px 32px",
              }}>
                <div style={{
                  width: 56, height: 56, flexShrink: 0, borderRadius: 8, background: "var(--color-primary)",
                  color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 800,
                }}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3 style={{ fontSize: "clamp(15px,1.7cqw,17px)", fontWeight: 700, color: "var(--color-secondary)", margin: "0 0 8px 0" }}>{card.heading}</h3>
                  <p style={{ fontSize: "clamp(13px,1.3cqw,14px)", color: "var(--color-text-light)", margin: 0, lineHeight: 1.7 }}>{card.description}</p>
                </div>
                <div style={{ width: 120, height: 80, flexShrink: 0, borderRadius: 8, overflow: "hidden" }}>
                  <img src={PH(120, 80, card.iconHint)} alt={card.iconHint} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 2) {
    return (
      <section className="lp-section lp-problems" style={{ position: "relative", ...bgImgStyle(images["s4_bg"]) }}>
        <BgUploadButton imageKey="s4_bg" onImageChange={onImageChange} currentUrl={images["s4_bg"]} />
        <div className="lp-container">
          <SectionHeader label="PROBLEMS" heading={d.sectionHeading} />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {d.cards.map((card, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 24, padding: "24px 0",
                borderBottom: i < d.cards.length - 1 ? "1px solid var(--color-border)" : "none",
              }}>
                <div style={{
                  flexShrink: 0, width: 56, height: 56, background: "var(--color-primary)",
                  borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 800, color: "var(--color-secondary)",
                }}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3 style={{ fontSize: "clamp(15px,1.7cqw,17px)", fontWeight: 600, color: "var(--color-secondary)", margin: "0 0 8px 0" }}>{card.heading}</h3>
                  <p style={{ fontSize: "clamp(13px,1.3cqw,14px)", color: "var(--color-text-light)", margin: 0, lineHeight: 1.7 }}>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Pattern A (layout 0): スタンダード — 3列カード、白背景
  return (
    <section className="lp-section" style={{ background: "#ffffff", padding: "80px 0", position: "relative", ...bgImgStyle(images["s4_bg"]) }}>
      <BgUploadButton imageKey="s4_bg" onImageChange={onImageChange} currentUrl={images["s4_bg"]} />
      <div className="lp-container">
        <SectionHeader label="PROBLEM" heading={d.sectionHeading} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {d.cards.map((card, i) => (
            <div key={i} className="lp-card">
              <div style={{
                width: 40, height: 40, borderRadius: 8, background: "#f2f9ff", marginBottom: 16,
              }} />
              <h3 className="lp-card-title">{card.heading}</h3>
              <p className="lp-card-desc">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── S5 Features ──
function S5({ d, layout, images, onImageChange }: {
  d: LPData["s5"]; layout: LayoutIndex;
  images: LPData["images"]; onImageChange?: OnImageChange;
}) {
  if (layout === 2) {
    return (
      <section className="lp-section-alt" style={{ position: "relative", ...bgImgStyle(images["s5_bg"]) }}>
        <BgUploadButton imageKey="s5_bg" onImageChange={onImageChange} currentUrl={images["s5_bg"]} />
        <div className="lp-container">
          <SectionHeader label="FEATURES" heading={d.sectionHeading} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {d.cards.map((card, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 32,
                background: "var(--color-bg)", border: "1px solid var(--color-border)",
                borderRadius: 12, padding: "28px 32px", transition: "box-shadow 0.2s",
              }}>
                <div style={{
                  flexShrink: 0, width: 80, height: 80, borderRadius: 12,
                  background: "var(--color-primary)", color: "var(--color-secondary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "clamp(32px,4cqw,44px)", fontWeight: 800,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <span className="lp-card-point">{card.pointLabel}</span>
                  <h3 className="lp-card-title" style={{ marginTop: 8 }}>{card.title}</h3>
                  <p className="lp-card-desc">{card.description}</p>
                </div>
                <UploadableImage
                  src={images[`s5_${i}`] || PH(160, 120, `Feature ${i + 1}`)}
                  alt={card.imageHint} imageKey={`s5_${i}`} onImageChange={onImageChange}
                  imgStyle={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, display: "block" }}
                  wrapperStyle={{ width: 160, height: 120, flexShrink: 0, borderRadius: 8 }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 3) {
    // D: グリッド2 — 2カラムの大きめカード
    return (
      <section className="lp-section-alt" style={{ position: "relative", ...bgImgStyle(images["s5_bg"]) }}>
        <BgUploadButton imageKey="s5_bg" onImageChange={onImageChange} currentUrl={images["s5_bg"]} />
        <div className="lp-container">
          <SectionHeader label="FEATURES" heading={d.sectionHeading} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {d.cards.map((card, i) => (
              <div key={i} className="lp-card" style={{ padding: 0, overflow: "hidden" }}>
                <UploadableImage
                  src={images[`s5_${i}`] || PH(560, 200, `Feature ${i + 1}`)}
                  alt={card.imageHint} imageKey={`s5_${i}`} onImageChange={onImageChange}
                  imgStyle={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                  wrapperStyle={{}}
                />
                <div style={{ padding: "20px 24px 24px" }}>
                  <span className="lp-card-point">{card.pointLabel}</span>
                  <h3 className="lp-card-title" style={{ marginTop: 8 }}>{card.title}</h3>
                  <p className="lp-card-desc">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 1) {
    return (
      <section className="lp-section-alt" style={{ position: "relative", ...bgImgStyle(images["s5_bg"]) }}>
        <BgUploadButton imageKey="s5_bg" onImageChange={onImageChange} currentUrl={images["s5_bg"]} />
        <div className="lp-container">
          <SectionHeader label="FEATURES" heading={d.sectionHeading} />
          <div className="lp-cards-3">
            {d.cards.map((card, i) => (
              <div key={i} className="lp-card">
                <UploadableImage
                  src={images[`s5_${i}`] || PH(280, 160, `Feature ${i + 1}`)}
                  alt={card.imageHint} imageKey={`s5_${i}`} onImageChange={onImageChange}
                  imgStyle={{ width: "100%", borderRadius: 8, display: "block" }}
                  wrapperStyle={{ borderRadius: 8, marginBottom: 16 }}
                />
                <span className="lp-card-point">{card.pointLabel}</span>
                <h3 className="lp-card-title" style={{ marginTop: 8 }}>{card.title}</h3>
                <p className="lp-card-desc">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Pattern A (layout 0): スタンダード — 3列カード、グレー背景
  return (
    <section style={{ background: "#f6f5f4", padding: "80px 0", position: "relative", ...bgImgStyle(images["s5_bg"]) }}>
      <BgUploadButton imageKey="s5_bg" onImageChange={onImageChange} currentUrl={images["s5_bg"]} />
      <div className="lp-container">
        <SectionHeader label="FEATURES" heading={d.sectionHeading} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {d.cards.map((card, i) => (
            <div key={i} className="lp-card">
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0075de", letterSpacing: 0.125 }}>{card.pointLabel}</span>
              <UploadableImage
                src={images[`s5_${i}`] || PH(344, 80, "Feature")}
                alt={card.imageHint} imageKey={`s5_${i}`} onImageChange={onImageChange}
                imgStyle={{ width: "100%", borderRadius: 4, display: "block", margin: "8px 0 12px" }}
                wrapperStyle={{ borderRadius: 4 }}
              />
              <h3 className="lp-card-title">{card.title}</h3>
              <p className="lp-card-desc">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── S6 Categories ──
function S6({ d, layout, images, onImageChange }: {
  d: LPData["s6"]; layout: LayoutIndex;
  images: LPData["images"]; onImageChange?: OnImageChange;
}) {
  if (layout === 1) {
    return (
      <section className="lp-section" style={{ position: "relative", ...bgImgStyle(images["s6_bg"]) }}>
        <BgUploadButton imageKey="s6_bg" onImageChange={onImageChange} currentUrl={images["s6_bg"]} />
        <div className="lp-container">
          <SectionHeader label="CATEGORIES" heading={d.sectionHeading} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {d.cards.map((card, i) => (
              <div key={i} className="lp-category-card">
                <UploadableImage
                  src={images[`s6_${i}`] || PH(480, 200, card.name)}
                  alt={card.imageHint} imageKey={`s6_${i}`} onImageChange={onImageChange}
                  imgStyle={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                  wrapperStyle={{}}
                />
                <div className="lp-category-card-body" style={{ padding: "20px" }}>
                  <p className="lp-category-card-name" style={{ fontSize: 18 }}>{card.name}</p>
                  <p className="lp-category-card-sub">{card.subText}</p>
                </div>
              </div>
            ))}
          </div>
          <CtaRow primary={d.cta1} secondary={d.cta2} />
        </div>
      </section>
    );
  }

  if (layout === 2) {
    return (
      <section className="lp-section" style={{ position: "relative", ...bgImgStyle(images["s6_bg"]) }}>
        <BgUploadButton imageKey="s6_bg" onImageChange={onImageChange} currentUrl={images["s6_bg"]} />
        <div className="lp-container">
          <SectionHeader label="CATEGORIES" heading={d.sectionHeading} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {d.cards.map((card, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 20,
                background: "var(--color-bg)", border: "1px solid var(--color-border)",
                borderRadius: 10, overflow: "hidden", transition: "box-shadow 0.2s",
              }}>
                <UploadableImage
                  src={images[`s6_${i}`] || PH(120, 90, card.name)}
                  alt={card.imageHint} imageKey={`s6_${i}`} onImageChange={onImageChange}
                  imgStyle={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  wrapperStyle={{ width: 120, height: 90, flexShrink: 0 }}
                />
                <div>
                  <p className="lp-category-card-name">{card.name}</p>
                  <p className="lp-category-card-sub">{card.subText}</p>
                </div>
              </div>
            ))}
          </div>
          <CtaRow primary={d.cta1} secondary={d.cta2} />
        </div>
      </section>
    );
  }

  if (layout === 3) {
    // D: 4カラム — 4列グリッドで最大8件表示
    return (
      <section className="lp-section" style={{ position: "relative", ...bgImgStyle(images["s6_bg"]) }}>
        <BgUploadButton imageKey="s6_bg" onImageChange={onImageChange} currentUrl={images["s6_bg"]} />
        <div className="lp-container">
          <SectionHeader label="CATEGORIES" heading={d.sectionHeading} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {d.cards.map((card, i) => (
              <div key={i} className="lp-card" style={{ padding: 0, overflow: "hidden", textAlign: "center" }}>
                <UploadableImage
                  src={images[`s6_${i}`] || PH(240, 140, card.name)}
                  alt={card.imageHint} imageKey={`s6_${i}`} onImageChange={onImageChange}
                  imgStyle={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
                  wrapperStyle={{}}
                />
                <div style={{ padding: "12px 16px 16px" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-secondary)", margin: "0 0 4px 0" }}>{card.name}</p>
                  <p style={{ fontSize: 12, color: "var(--color-text-light)", margin: 0, lineHeight: 1.5 }}>{card.subText}</p>
                </div>
              </div>
            ))}
          </div>
          <CtaRow primary={d.cta1} secondary={d.cta2} />
        </div>
      </section>
    );
  }

  // Pattern A (layout 0): スタンダード — 3列グリッド
  return (
    <section style={{ background: "#ffffff", padding: "80px 0", position: "relative", ...bgImgStyle(images["s6_bg"]) }}>
      <BgUploadButton imageKey="s6_bg" onImageChange={onImageChange} currentUrl={images["s6_bg"]} />
      <div className="lp-container">
        <SectionHeader label="CATEGORIES" heading={d.sectionHeading} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {d.cards.map((card, i) => (
            <div key={i} style={{
              background: "#f6f5f4", border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 12, overflow: "hidden",
            }}>
              <UploadableImage
                src={images[`s6_${i}`] || PH(272, 80, card.name)}
                alt={card.imageHint} imageKey={`s6_${i}`} onImageChange={onImageChange}
                imgStyle={{ width: "100%", display: "block" }}
                wrapperStyle={{}}
              />
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#31302e", margin: "0 0 4px 0" }}>{card.name}</p>
                <p style={{ fontSize: 12, color: "#615d59", margin: 0 }}>{card.subText}</p>
              </div>
            </div>
          ))}
        </div>
        <CtaRow primary={d.cta1} secondary={d.cta2} />
      </div>
    </section>
  );
}

// ── S7 Case Studies ──
function S7({ d, layout, images, onImageChange }: {
  d: LPData["s7"]; layout: LayoutIndex;
  images: LPData["images"]; onImageChange?: OnImageChange;
}) {
  if (layout === 2) {
    return (
      <section className="lp-section-alt" style={{ position: "relative", ...bgImgStyle(images["s7_bg"]) }}>
        <BgUploadButton imageKey="s7_bg" onImageChange={onImageChange} currentUrl={images["s7_bg"]} />
        <div className="lp-container">
          <SectionHeader label="CASE STUDIES" heading={d.sectionHeading} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {d.cards.map((card, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "stretch",
                background: "var(--color-bg)", border: "1px solid var(--color-border)",
                borderRadius: 12, overflow: "hidden", transition: "box-shadow 0.2s",
              }}>
                <UploadableImage
                  src={images[`s7_${i}`] || PH(240, 180, card.companyName)}
                  alt={card.imageHint} imageKey={`s7_${i}`} onImageChange={onImageChange}
                  imgStyle={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  wrapperStyle={{ width: 240, minHeight: 160, flexShrink: 0 }}
                />
                <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{
                    background: "var(--color-primary)", color: "var(--color-secondary)",
                    fontSize: 11, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 4, display: "inline-block", marginBottom: 12, alignSelf: "flex-start",
                  }}>導入事例</span>
                  <h3 className="lp-card-title">{card.companyName}</h3>
                  <p className="lp-card-desc">{card.summary}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="lp-link">{d.linkText} →</a>
          <CtaRow primary={d.cta1} secondary={d.cta2} />
        </div>
      </section>
    );
  }

  if (layout === 3) {
    // D: 2カラム — 画像付き大型カード2列
    return (
      <section className="lp-section-alt" style={{ position: "relative", ...bgImgStyle(images["s7_bg"]) }}>
        <BgUploadButton imageKey="s7_bg" onImageChange={onImageChange} currentUrl={images["s7_bg"]} />
        <div className="lp-container">
          <SectionHeader label="CASE STUDIES" heading={d.sectionHeading} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {d.cards.map((card, i) => (
              <div key={i} className="lp-card" style={{ padding: 0, overflow: "hidden" }}>
                <UploadableImage
                  src={images[`s7_${i}`] || PH(560, 220, card.companyName)}
                  alt={card.imageHint} imageKey={`s7_${i}`} onImageChange={onImageChange}
                  imgStyle={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                  wrapperStyle={{}}
                />
                <div style={{ padding: "20px 24px 24px" }}>
                  <span style={{
                    background: "#f2f9ff", color: "#097fe8", borderRadius: 9999,
                    padding: "3px 10px", fontSize: 11, fontWeight: 600, display: "inline-block", marginBottom: 10,
                  }}>導入事例</span>
                  <h3 className="lp-card-title">{card.companyName}</h3>
                  <p className="lp-card-desc">{card.summary}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="lp-link">{d.linkText} →</a>
          <CtaRow primary={d.cta1} secondary={d.cta2} />
        </div>
      </section>
    );
  }

  if (layout === 1) {
    return (
      <section className="lp-section-alt" style={{ position: "relative", ...bgImgStyle(images["s7_bg"]) }}>
        <BgUploadButton imageKey="s7_bg" onImageChange={onImageChange} currentUrl={images["s7_bg"]} />
        <div className="lp-container">
          <SectionHeader label="CASE STUDIES" heading={d.sectionHeading} />
          <div className="lp-cards-3">
            {d.cards.map((card, i) => (
              <div key={i} className="lp-card lp-case-card" style={{ padding: 0 }}>
                <UploadableImage
                  src={images[`s7_${i}`] || PH(360, 180, card.companyName)}
                  alt={card.imageHint} imageKey={`s7_${i}`} onImageChange={onImageChange}
                  imgStyle={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "8px 8px 0 0", display: "block" }}
                  wrapperStyle={{ borderRadius: "8px 8px 0 0" }}
                />
                <div className="lp-case-card-body">
                  <span style={{
                    background: "var(--color-primary)", color: "var(--color-secondary)",
                    fontSize: 11, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 4, display: "inline-block", marginBottom: 8,
                  }}>導入事例</span>
                  <h3 className="lp-card-title">{card.companyName}</h3>
                  <p className="lp-card-desc">{card.summary}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="lp-link">{d.linkText} →</a>
          <CtaRow primary={d.cta1} secondary={d.cta2} />
        </div>
      </section>
    );
  }

  // Pattern A (layout 0): スタンダード — 3列グリッドカード、グレー背景
  return (
    <section style={{ background: "#f6f5f4", padding: "80px 0", position: "relative", ...bgImgStyle(images["s7_bg"]) }}>
      <BgUploadButton imageKey="s7_bg" onImageChange={onImageChange} currentUrl={images["s7_bg"]} />
      <div className="lp-container">
        <SectionHeader label="CASE STUDY" heading={d.sectionHeading} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {d.cards.map((card, i) => (
            <div key={i} style={{
              background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12,
              boxShadow: "0px 4px 18px 0px rgba(0,0,0,0.04)", overflow: "hidden",
            }}>
              <UploadableImage
                src={images[`s7_${i}`] || PH(392, 120, card.companyName)}
                alt={card.imageHint} imageKey={`s7_${i}`} onImageChange={onImageChange}
                imgStyle={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                wrapperStyle={{}}
              />
              <div style={{ padding: 24 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#31302e", margin: "0 0 8px 0" }}>{card.companyName}</p>
                <p style={{ fontSize: 13, color: "#615d59", lineHeight: 1.8, margin: 0 }}>{card.summary}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="#" style={{ display: "block", textAlign: "center", marginTop: 24, fontSize: 14, fontWeight: 500, color: "#0075de", textDecoration: "none" }}>{d.linkText} →</a>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="#" className="btn-primary">{d.cta1}</a>
        </div>
      </div>
    </section>
  );
}

// ── S8 Flow ──
function S8({ d, layout, images, onImageChange }: {
  d: LPData["s8"]; layout: LayoutIndex;
  images: LPData["images"]; onImageChange?: OnImageChange;
}) {
  if (layout === 2) {
    return (
      <section className="lp-section" style={{ position: "relative", ...bgImgStyle(images["s8_bg"]) }}>
        <BgUploadButton imageKey="s8_bg" onImageChange={onImageChange} currentUrl={images["s8_bg"]} />
        <div className="lp-container">
          <SectionHeader label="FLOW" heading={d.sectionHeading} />
          <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
            <div style={{ position: "absolute", left: 23, top: 0, bottom: 0, width: 2, background: "var(--color-border)" }} />
            {d.steps.map((step, i) => (
              <div key={i} style={{
                display: "flex", gap: 24, alignItems: "flex-start",
                paddingBottom: i < d.steps.length - 1 ? 36 : 0, position: "relative",
              }}>
                <div style={{
                  flexShrink: 0, width: 48, height: 48,
                  background: "var(--color-primary)", color: "var(--color-secondary)", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, zIndex: 1,
                }}>{i + 1}</div>
                <div style={{ paddingTop: 8, flex: 1 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-light)", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>{step.stepLabel}</p>
                  <h3 className="lp-flow-step-title" style={{ textAlign: "left", marginBottom: 6 }}>{step.title}</h3>
                  <p className="lp-flow-step-desc" style={{ textAlign: "left" }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 3) {
    // D: ジグザグ — 画像と説明が左右交互に並ぶステップ
    return (
      <section className="lp-section" style={{ position: "relative", ...bgImgStyle(images["s8_bg"]) }}>
        <BgUploadButton imageKey="s8_bg" onImageChange={onImageChange} currentUrl={images["s8_bg"]} />
        <div className="lp-container">
          <SectionHeader label="FLOW" heading={d.sectionHeading} />
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {d.steps.map((step, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
                gap: "clamp(24px,4cqw,48px)", alignItems: "center",
              }}>
                {i % 2 === 0 ? (
                  <>
                    <UploadableImage
                      src={images[`s8_${i}`] || PH(480, 280, step.iconHint)}
                      alt={step.iconHint} imageKey={`s8_${i}`} onImageChange={onImageChange}
                      imgStyle={{ width: "100%", borderRadius: 12, display: "block" }}
                      wrapperStyle={{ borderRadius: 12 }}
                    />
                    <div>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%", background: "var(--color-primary)",
                        color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 16, marginBottom: 16,
                      }}>{i + 1}</div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-light)", letterSpacing: "0.1em", margin: "0 0 6px 0" }}>{step.stepLabel}</p>
                      <h3 className="lp-card-title">{step.title}</h3>
                      <p className="lp-card-desc">{step.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%", background: "var(--color-primary)",
                        color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 16, marginBottom: 16,
                      }}>{i + 1}</div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-light)", letterSpacing: "0.1em", margin: "0 0 6px 0" }}>{step.stepLabel}</p>
                      <h3 className="lp-card-title">{step.title}</h3>
                      <p className="lp-card-desc">{step.description}</p>
                    </div>
                    <UploadableImage
                      src={images[`s8_${i}`] || PH(480, 280, step.iconHint)}
                      alt={step.iconHint} imageKey={`s8_${i}`} onImageChange={onImageChange}
                      imgStyle={{ width: "100%", borderRadius: 12, display: "block" }}
                      wrapperStyle={{ borderRadius: 12 }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 1) {
    return (
      <section className="lp-section" style={{ position: "relative", ...bgImgStyle(images["s8_bg"]) }}>
        <BgUploadButton imageKey="s8_bg" onImageChange={onImageChange} currentUrl={images["s8_bg"]} />
        <div className="lp-container">
          <SectionHeader label="FLOW" heading={d.sectionHeading} />
          <div className="lp-flow-steps lp-flow-steps--square">
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

  // Pattern A (layout 0): スタンダード — 横並びステップ、白背景
  return (
    <section style={{ background: "#ffffff", padding: "80px 0", position: "relative", ...bgImgStyle(images["s8_bg"]) }}>
      <BgUploadButton imageKey="s8_bg" onImageChange={onImageChange} currentUrl={images["s8_bg"]} />
      <div className="lp-container">
        <SectionHeader label="FLOW" heading={d.sectionHeading} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 0, marginTop: 48 }}>
          {d.steps.flatMap((step, i) => {
            const stepEl = (
              <div key={i} style={{ width: 200, textAlign: "center" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", background: "#0075de", color: "#ffffff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, margin: "0 auto 16px",
                }}>{i + 1}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#31302e", textAlign: "center", margin: "0 0 8px 0" }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#615d59", lineHeight: 1.8, textAlign: "center", margin: 0 }}>{step.description}</p>
              </div>
            );
            if (i < d.steps.length - 1) {
              return [stepEl, <div key={`a${i}`} style={{ fontSize: 20, color: "#ababab", alignSelf: "flex-start", paddingTop: 14, flexShrink: 0 }}>→</div>];
            }
            return [stepEl];
          })}
        </div>
      </div>
    </section>
  );
}

// ── S9 FAQ + Form ──
const FORM_FIELDS = [
  { label: "お名前", type: "text", placeholder: "山田 太郎" },
  { label: "会社名", type: "text", placeholder: "株式会社サンプル" },
  { label: "メールアドレス", type: "email", placeholder: "example@company.co.jp" },
  { label: "電話番号", type: "tel", placeholder: "03-1234-5678" },
];

function S9({ d, layout, images, onImageChange }: {
  d: LPData["s9"]; layout: LayoutIndex;
  images: LPData["images"]; onImageChange?: OnImageChange;
}) {
  const NUMBER_PREFIXES = ["①", "②", "③", "④", "⑤"];

  const renderFaqQ = (i: number) => {
    if (layout === 1) return (
      <span style={{ background: "var(--color-primary)", color: "var(--color-secondary)", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, marginRight: 8 }}>Q</span>
    );
    if (layout === 2) return (
      <span style={{ background: "var(--color-secondary)", color: "var(--color-primary)", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, marginRight: 8 }}>{NUMBER_PREFIXES[i]}</span>
    );
    return null;
  };

  if (layout === 3) {
    // D: シンプルFAQ — FAQのみ全幅表示（フォームなし）
    return (
      <section className="lp-section-alt" style={{ position: "relative", ...bgImgStyle(images["s9_bg"]) }}>
        <BgUploadButton imageKey="s9_bg" onImageChange={onImageChange} currentUrl={images["s9_bg"]} />
        <div className="lp-container">
          <SectionHeader label="FAQ" heading="よくある質問" />
          <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
            {d.faqs.map((faq, i) => (
              <div key={i} style={{
                background: "var(--color-bg)", border: "1px solid var(--color-border)",
                borderRadius: 8, padding: "16px 20px",
              }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--color-secondary)", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    background: "#f2f9ff", color: "#097fe8", borderRadius: 9999,
                    padding: "2px 8px", fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>Q</span>
                  {faq.question}
                </p>
                <p style={{ fontSize: 14, color: "var(--color-text-light)", margin: 0, lineHeight: 1.7 }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 1 || layout === 2) {
    return (
      <section className="lp-section-alt" style={{ position: "relative", ...bgImgStyle(images["s9_bg"]) }}>
        <BgUploadButton imageKey="s9_bg" onImageChange={onImageChange} currentUrl={images["s9_bg"]} />
        <div className="lp-container">
          <p className="lp-label" style={{ textAlign: "center" }}>CONTACT</p>
          <div className="lp-contact-grid">
            <div>
              <h2 className="lp-heading" style={{ fontSize: 22, marginBottom: 24 }}>よくある質問</h2>
              {d.faqs.map((faq, i) => (
                <div key={i} className="lp-faq-item">
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--color-secondary)", margin: "0 0 8px 0", display: "flex", alignItems: "baseline" }}>
                    <span>{renderFaqQ(i)}</span>{faq.question}
                  </p>
                  <p className="lp-faq-a">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="lp-form">
              <h3>{d.formHeading}</h3>
              {FORM_FIELDS.map((f, i) => (
                <div key={i} className="lp-form-field">
                  <label className="lp-form-label">{f.label} <span style={{ color: "var(--color-primary-dark)" }}>*</span></label>
                  <input className="lp-form-input" type={f.type} placeholder={f.placeholder} readOnly />
                </div>
              ))}
              <div className="lp-form-field">
                <label className="lp-form-label">従業員数 <span style={{ color: "var(--color-primary-dark)" }}>*</span></label>
                <select className="lp-form-input">
                  <option>選択してください</option>
                  <option>1〜10名</option><option>11〜50名</option>
                  <option>51〜300名</option><option>301名以上</option>
                </select>
              </div>
              <div className="lp-form-field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" id="privacy" readOnly />
                <label htmlFor="privacy" style={{ fontSize: 13, color: "var(--color-text-light)" }}>プライバシーポリシーに同意する</label>
              </div>
              <button className="btn-primary" style={{ width: "100%", marginTop: 8 }}>資料を請求する</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Pattern A (layout 0): スタンダード — FAQ左列 + フォーム右列、グレー背景
  return (
    <section style={{ background: "#f6f5f4", padding: "80px 0", position: "relative", ...bgImgStyle(images["s9_bg"]) }}>
      <BgUploadButton imageKey="s9_bg" onImageChange={onImageChange} currentUrl={images["s9_bg"]} />
      <div className="lp-container">
        <p className="lp-label" style={{ textAlign: "center" }}>FAQ & CONTACT</p>
        <h2 style={{
          fontSize: "clamp(24px,3cqw,32px)", fontWeight: 700, color: "#31302e",
          letterSpacing: "-0.75px", lineHeight: 1.2, textAlign: "center", margin: "0 0 48px 0",
        }}>よくある質問・お問い合わせ</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 48 }}>
          <div>
            {d.faqs.map((faq, i) => (
              <div key={i} style={{ marginBottom: 0 }}>
                <div style={{
                  background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 4,
                  padding: "0 16px", height: 48, display: "flex", alignItems: "center",
                }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#31302e", margin: 0 }}>{"Q. " + faq.question}</p>
                </div>
                <p style={{ fontSize: 13, color: "#615d59", lineHeight: 1.8, padding: "8px 16px 16px", margin: 0 }}>{"A. " + faq.answer}</p>
              </div>
            ))}
          </div>
          <div style={{
            background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12,
            padding: 32, boxShadow: "0px 4px 18px 0px rgba(0,0,0,0.04)",
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#31302e", margin: "0 0 24px 0" }}>{d.formHeading}</h3>
            {FORM_FIELDS.map((f, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#31302e", marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type} placeholder={f.placeholder} readOnly
                  style={{
                    background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 4,
                    height: 36, width: "100%", padding: "0 10px", fontSize: 14, boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <button style={{
              background: "#0075de", color: "#ffffff", borderRadius: 4, padding: "12px 0",
              fontSize: 15, fontWeight: 600, width: "100%", border: "none", cursor: "pointer", marginTop: 8,
            }}>無料で資料を受け取る</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── S10 Closing ──
function S10({ d, layout, images, onImageChange }: {
  d: LPData["s10"]; layout: LayoutIndex;
  images: LPData["images"]; onImageChange?: OnImageChange;
}) {
  if (layout === 2) {
    return (
      <section style={{ background: "var(--color-secondary)", padding: "var(--space-xl) 0", textAlign: "center", position: "relative", ...bgImgStyle(images["s10_bg"]) }}>
        <BgUploadButton imageKey="s10_bg" onImageChange={onImageChange} currentUrl={images["s10_bg"]} />
        <div className="lp-container">
          <h2 style={{ fontSize: "clamp(20px,2.8cqw,28px)", fontWeight: 700, color: "#fff", margin: "0 0 32px 0" }}>{d.microCopy}</h2>
          <div className="lp-closing-actions">
            <a href="#" className="btn-primary">{d.cta1}</a>
            <a href="#" style={{
              display: "inline-block", background: "transparent", color: "#fff",
              padding: "14px 30px", border: "2px solid rgba(255,255,255,0.5)",
              borderRadius: 8, fontWeight: 600, fontSize: "clamp(15px,1.4cqw,16px)",
              cursor: "pointer", textDecoration: "none", transition: "all 0.2s",
            }}>{d.cta2}</a>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 3) {
    // D: スプリット — 左ライトBG+見出し / 右ダークBG+CTA の左右分割
    return (
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 320 }}>
        <div style={{
          background: "var(--color-bg-alt)", padding: "var(--space-xl) clamp(24px,4cqw,64px)",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <h2 style={{
            fontSize: "clamp(22px,2.8cqw,30px)", fontWeight: 700, color: "var(--color-secondary)",
            margin: "0 0 20px 0", lineHeight: 1.3, letterSpacing: "-0.75px",
          }}>{d.microCopy}</h2>
          <a href="#" className="btn-primary" style={{ alignSelf: "flex-start" }}>{d.cta1}</a>
        </div>
        <div style={{
          background: "var(--color-secondary)", padding: "var(--space-xl) clamp(24px,4cqw,64px)",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <p style={{ fontSize: "clamp(14px,1.5cqw,16px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, margin: "0 0 24px 0" }}>
            まずはお気軽にお問い合わせください。専任担当者が丁寧にご対応いたします。
          </p>
          <a href="#" style={{
            alignSelf: "flex-start", background: "transparent", color: "#ffffff",
            padding: "8px 20px", border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: 4, fontWeight: 600, fontSize: 15, textDecoration: "none",
          }}>{d.cta2}</a>
        </div>
      </section>
    );
  }

  if (layout === 1) {
    return (
      <section className="lp-closing" style={{ position: "relative", ...bgImgStyle(images["s10_bg"]) }}>
        <BgUploadButton imageKey="s10_bg" onImageChange={onImageChange} currentUrl={images["s10_bg"]} />
        <div className="lp-container">
          <h2>{d.microCopy}</h2>
          <div className="lp-closing-actions lp-closing-actions--stacked">
            <a href="#" className="btn-primary">{d.cta1}</a>
            <a href="#" className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#ffffff", background: "transparent" }}>{d.cta2}</a>
          </div>
        </div>
      </section>
    );
  }

  // Pattern A (layout 0): スタンダード — ブルー背景、中央揃え
  return (
    <section style={{ background: "#005bab", padding: "80px 0", textAlign: "center", position: "relative", ...bgImgStyle(images["s10_bg"]) }}>
      <BgUploadButton imageKey="s10_bg" onImageChange={onImageChange} currentUrl={images["s10_bg"]} />
      <div className="lp-container">
        <h2 style={{
          fontSize: "clamp(24px,3cqw,36px)", fontWeight: 700, color: "#ffffff",
          letterSpacing: "-0.75px", margin: "0 0 16px 0",
        }}>{d.microCopy}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 32 }}>
          <a href="#" style={{
            background: "#ffffff", color: "#0075de", padding: "12px 24px",
            borderRadius: 4, fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-block",
          }}>{d.cta1}</a>
          <a href="#" style={{
            background: "rgba(255,255,255,0.1)", color: "#ffffff", padding: "12px 24px",
            borderRadius: 4, fontWeight: 600, fontSize: 15, border: "1px solid rgba(255,255,255,0.4)",
            textDecoration: "none", display: "inline-block",
          }}>{d.cta2}</a>
        </div>
      </div>
    </section>
  );
}

// ── S11 Footer ──
function S11({ d, layout }: { d: LPData["s11"]; layout: LayoutIndex }) {
  if (layout === 2) {
    return (
      <footer className="lp-footer" style={{ textAlign: "center" }}>
        <div className="lp-container">
          <div style={{ marginBottom: 24 }}>
            <div className="lp-footer-logo" style={{ marginBottom: 16 }}>🏢 SERVICE</div>
            <nav>
              <ul className="lp-footer-links" style={{ justifyContent: "center", flexWrap: "wrap", gap: 24 }}>
                {d.links.map((link, i) => <li key={i}><a href="#">{link}</a></li>)}
              </ul>
            </nav>
          </div>
          <p className="lp-footer-copy">{d.copyright}</p>
        </div>
      </footer>
    );
  }

  if (layout === 3) {
    // D: 4カラム — ロゴ+タグライン列 + 3列リンクカラム
    const cols = [
      d.links.slice(0, Math.ceil(d.links.length / 3)),
      d.links.slice(Math.ceil(d.links.length / 3), Math.ceil(d.links.length * 2 / 3)),
      d.links.slice(Math.ceil(d.links.length * 2 / 3)),
    ];
    return (
      <footer className="lp-footer">
        <div className="lp-container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            <div>
              <div className="lp-footer-logo">🏢 SERVICE</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 10, lineHeight: 1.6 }}>
                一言でサービスの価値を伝えるタグライン
              </p>
            </div>
            {cols.map((col, ci) => (
              <div key={ci}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", margin: "0 0 12px 0", textTransform: "uppercase" }}>
                  {["サービス", "会社情報", "サポート"][ci]}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.map((link, li) => (
                    <li key={li}><a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="lp-footer-copy">{d.copyright}</p>
        </div>
      </footer>
    );
  }

  if (layout === 1) {
    return (
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div>
              <div className="lp-footer-logo">🏢 SERVICE</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6, lineHeight: 1.6 }}>
                一言でサービスの価値を伝えるタグライン
              </p>
            </div>
            <nav>
              <ul className="lp-footer-links">
                {d.links.map((link, i) => <li key={i}><a href="#">{link}</a></li>)}
              </ul>
            </nav>
          </div>
          <p className="lp-footer-copy">{d.copyright}</p>
        </div>
      </footer>
    );
  }

  // Pattern A (layout 0): スタンダード — ダーク背景、ロゴ左・リンク右
  return (
    <footer style={{ background: "#31302e", padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="lp-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>サービスロゴ</span>
          <div style={{ display: "flex", gap: 32 }}>
            {d.links.map((l, i) => (
              <a key={i} href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "16px 0 0 0" }}>{d.copyright}</p>
      </div>
    </footer>
  );
}

// ── Public API ──
export function renderSection(
  key: SectionKey,
  data: LPData,
  layout: LayoutIndex,
  onImageChange?: OnImageChange,
): React.ReactElement {
  const images = data.images ?? {};
  switch (key) {
    case "s1":  return <S1  key="s1"  d={data.s1}  layout={layout} />;
    case "s2":  return <S2  key="s2"  d={data.s2}  layout={layout} images={images} onImageChange={onImageChange} />;
    case "s3":  return <S3  key="s3"  d={data.s3}  layout={layout} images={images} onImageChange={onImageChange} />;
    case "s4":  return <S4  key="s4"  d={data.s4}  layout={layout} images={images} onImageChange={onImageChange} />;
    case "s5":  return <S5  key="s5"  d={data.s5}  layout={layout} images={images} onImageChange={onImageChange} />;
    case "s6":  return <S6  key="s6"  d={data.s6}  layout={layout} images={images} onImageChange={onImageChange} />;
    case "s7":  return <S7  key="s7"  d={data.s7}  layout={layout} images={images} onImageChange={onImageChange} />;
    case "s8":  return <S8  key="s8"  d={data.s8}  layout={layout} images={images} onImageChange={onImageChange} />;
    case "s9":  return <S9  key="s9"  d={data.s9}  layout={layout} images={images} onImageChange={onImageChange} />;
    case "s10": return <S10 key="s10" d={data.s10} layout={layout} images={images} onImageChange={onImageChange} />;
    case "s11": return <S11 key="s11" d={data.s11} layout={layout} />;
  }
}

export function SectionPreview({ sectionKey, data, layout }: {
  sectionKey: SectionKey; data: LPData; layout: LayoutIndex;
}) {
  return (
    <div className="lp-preview-root">
      {renderSection(sectionKey, data, layout)}
    </div>
  );
}
