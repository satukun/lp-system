"use client";

import { useState } from "react";
import type { LPData, SectionKey } from "@/lib/types";
import "@/styles/lp-preview.css";

interface Props {
  data: LPData;
  isUpdating: boolean;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
}

type DeviceType = "pc" | "tablet" | "sp";

const DEVICES: { key: DeviceType; label: string; width: number | null; icon: React.ReactNode }[] = [
  {
    key: "pc",
    label: "PC",
    width: null,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeWidth={1.8} d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    key: "tablet",
    label: "Tablet",
    width: 768,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth={1.8} />
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "sp",
    label: "SP",
    width: 390,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="2" width="12" height="20" rx="2" strokeWidth={1.8} />
        <circle cx="12" cy="18.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function PreviewPanel({ data, isUpdating, sectionOrder, hiddenSections }: Props) {
  const [device, setDevice] = useState<DeviceType>("pc");
  const { s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11 } = data;

  const currentDevice = DEVICES.find((d) => d.key === device)!;
  const deviceWidth = currentDevice.width;

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case "s1":
        return (
          <header key="s1" className="lp-header">
            <div className="lp-container">
              <div className="lp-header-inner">
                <div className="lp-logo">🏢 SERVICE</div>
                <nav>
                  <ul className="lp-nav">
                    {s1.menuItems.map((item, i) => <li key={i}><a href="#">{item}</a></li>)}
                  </ul>
                </nav>
                <a href="#" className="btn-primary" style={{ padding: "10px 20px", fontSize: "14px" }}>
                  {s1.ctaText}
                </a>
              </div>
            </div>
          </header>
        );

      case "s2":
        return (
          <section key="s2" className="lp-hero">
            <div className="lp-container">
              <div className="lp-hero-inner">
                <div className="lp-hero-copy">
                  <h1>{s2.mainCopy}</h1>
                  <p>{s2.subCopy}</p>
                  <div className="lp-hero-actions">
                    <a href="#" className="btn-primary">{s2.ctaText}</a>
                    <a href="#" className="btn-secondary">{s2.secondaryCtaText}</a>
                  </div>
                  <div className="lp-trust-badges">
                    {s2.trustBadges.map((badge, i) => <span key={i}>{badge}</span>)}
                  </div>
                </div>
                <div className="lp-hero-visual">
                  <img src="https://placehold.co/480x360/F5F5F0/1A1A2E?text=Hero+Visual" alt="ヒーロービジュアル" />
                </div>
              </div>
            </div>
          </section>
        );

      case "s3":
        return (
          <section key="s3" className="lp-message">
            <div className="lp-message-inner">
              <p className="lp-label">OVERVIEW</p>
              <h2>{s3.heading}</h2>
              <p>{s3.body}</p>
            </div>
          </section>
        );

      case "s4":
        return (
          <section key="s4" className="lp-section lp-problems">
            <div className="lp-container">
              <p className="lp-label" style={{ textAlign: "center" }}>PROBLEMS</p>
              <h2 className="lp-heading" style={{ textAlign: "center" }}>{s4.sectionHeading}</h2>
              <div className="lp-cards-3">
                {s4.cards.map((card, i) => (
                  <div key={i} className="lp-card" style={{ textAlign: "center" }}>
                    <div className="lp-card-icon" />
                    <h3 className="lp-card-title">{card.heading}</h3>
                    <p className="lp-card-desc">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "s5":
        return (
          <section key="s5" className="lp-section-alt">
            <div className="lp-container">
              <p className="lp-label" style={{ textAlign: "center" }}>FEATURES</p>
              <h2 className="lp-heading" style={{ textAlign: "center" }}>{s5.sectionHeading}</h2>
              <div className="lp-cards-3">
                {s5.cards.map((card, i) => (
                  <div key={i} className="lp-card">
                    <span className="lp-card-point">{card.pointLabel}</span>
                    <h3 className="lp-card-title">{card.title}</h3>
                    <p className="lp-card-desc">{card.description}</p>
                    <img
                      src={`https://placehold.co/280x160/F5F5F0/1A1A2E?text=Feature+${i + 1}`}
                      alt={card.imageHint}
                      style={{ width: "100%", borderRadius: "8px", marginTop: "16px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "s6":
        return (
          <section key="s6" className="lp-section">
            <div className="lp-container">
              <p className="lp-label" style={{ textAlign: "center" }}>CATEGORIES</p>
              <h2 className="lp-heading" style={{ textAlign: "center" }}>{s6.sectionHeading}</h2>
              <div className="lp-cards-6">
                {s6.cards.map((card, i) => (
                  <div key={i} className="lp-category-card">
                    <img src={`https://placehold.co/320x120/E0E0E0/666666?text=${encodeURIComponent(card.name)}`} alt={card.imageHint} />
                    <div className="lp-category-card-body">
                      <p className="lp-category-card-name">{card.name}</p>
                      <p className="lp-category-card-sub">{card.subText}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lp-cta-area">
                <a href="#" className="btn-primary">{s6.cta1}</a>
                <a href="#" className="btn-secondary">{s6.cta2}</a>
              </div>
            </div>
          </section>
        );

      case "s7":
        return (
          <section key="s7" className="lp-section-alt">
            <div className="lp-container">
              <p className="lp-label" style={{ textAlign: "center" }}>CASE STUDIES</p>
              <h2 className="lp-heading" style={{ textAlign: "center" }}>{s7.sectionHeading}</h2>
              <div className="lp-cards-3">
                {s7.cards.map((card, i) => (
                  <div key={i} className="lp-card lp-case-card" style={{ padding: "0" }}>
                    <img src={`https://placehold.co/360x180/E0E0E0/666666?text=${encodeURIComponent(card.companyName)}`} alt={card.imageHint} />
                    <div className="lp-case-card-body">
                      <h3 className="lp-card-title">{card.companyName}</h3>
                      <p className="lp-card-desc">{card.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#" className="lp-link">{s7.linkText} →</a>
              <div className="lp-cta-area">
                <a href="#" className="btn-primary">{s7.cta1}</a>
                <a href="#" className="btn-secondary">{s7.cta2}</a>
              </div>
            </div>
          </section>
        );

      case "s8":
        return (
          <section key="s8" className="lp-section">
            <div className="lp-container">
              <p className="lp-label" style={{ textAlign: "center" }}>FLOW</p>
              <h2 className="lp-heading" style={{ textAlign: "center" }}>{s8.sectionHeading}</h2>
              <div className="lp-flow-steps">
                {s8.steps.map((step, i) => (
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

      case "s9":
        return (
          <section key="s9" className="lp-section-alt">
            <div className="lp-container">
              <p className="lp-label" style={{ textAlign: "center" }}>CONTACT</p>
              <div className="lp-contact-grid">
                <div>
                  <h2 className="lp-heading" style={{ fontSize: "22px", marginBottom: "24px" }}>よくある質問</h2>
                  {s9.faqs.map((faq, i) => (
                    <div key={i} className="lp-faq-item">
                      <p className="lp-faq-q">{faq.question}</p>
                      <p className="lp-faq-a">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="lp-form">
                  <h3>{s9.formHeading}</h3>
                  {[
                    { label: "お名前", type: "text", placeholder: "山田 太郎" },
                    { label: "会社名", type: "text", placeholder: "株式会社サンプル" },
                    { label: "メールアドレス", type: "email", placeholder: "example@company.co.jp" },
                    { label: "電話番号", type: "tel", placeholder: "03-1234-5678" },
                  ].map((f, i) => (
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
                  <div className="lp-form-field" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="checkbox" id="privacy" readOnly />
                    <label htmlFor="privacy" style={{ fontSize: "13px", color: "#666" }}>プライバシーポリシーに同意する</label>
                  </div>
                  <button className="btn-primary" style={{ width: "100%", marginTop: "8px" }}>資料を請求する</button>
                </div>
              </div>
            </div>
          </section>
        );

      case "s10":
        return (
          <section key="s10" className="lp-closing">
            <div className="lp-container">
              <h2>{s10.microCopy}</h2>
              <div className="lp-closing-actions">
                <a href="#" className="btn-primary">{s10.cta1}</a>
                <a href="#" className="btn-secondary" style={{ borderColor: "var(--color-secondary)", color: "var(--color-secondary)" }}>
                  {s10.cta2}
                </a>
              </div>
            </div>
          </section>
        );

      case "s11":
        return (
          <footer key="s11" className="lp-footer">
            <div className="lp-container">
              <div className="lp-footer-inner">
                <div className="lp-footer-logo">🏢 SERVICE</div>
                <nav>
                  <ul className="lp-footer-links">
                    {s11.links.map((link, i) => <li key={i}><a href="#">{link}</a></li>)}
                  </ul>
                </nav>
              </div>
              <p className="lp-footer-copy">{s11.copyright}</p>
            </div>
          </footer>
        );
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* デバイス切替ツールバー */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        {/* デバイスボタン */}
        <div className="flex items-center gap-1">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDevice(d.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
              style={
                device === d.key
                  ? { background: "rgba(96,165,250,0.2)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.35)" }
                  : { background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }
              }
            >
              {d.icon}
              {d.label}
            </button>
          ))}
        </div>

        {/* 幅バッジ */}
        <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
          {deviceWidth ? `${deviceWidth}px` : "100%"}
        </span>
      </div>

      {/* プレビューエリア */}
      <div
        className="relative flex-1 overflow-auto"
        style={{ background: deviceWidth ? "#e5e7eb" : "transparent" }}
      >
        {/* ローディングオーバーレイ */}
        {isUpdating && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-blue-600/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              更新中
            </div>
          </div>
        )}

        {/* デバイスフレーム */}
        <div
          style={
            deviceWidth
              ? {
                  width: deviceWidth,
                  margin: "16px auto",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.25)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  minHeight: "calc(100% - 32px)",
                }
              : { width: "100%", height: "100%" }
          }
        >
          {/* LP本体（セクション順序・表示設定に従ってレンダリング） */}
          <div className={`lp-preview-root transition-opacity duration-300 ${isUpdating ? "opacity-70" : "opacity-100"}`}>
            {sectionOrder
              .filter((key) => !hiddenSections.includes(key))
              .map((key) => renderSection(key))}
          </div>
        </div>
      </div>
    </div>
  );
}
