"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LPData, SectionLayouts, SectionKey, LayoutIndex, ColorPalette } from "@/lib/types";
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_LAYOUTS } from "@/lib/types";
import { defaultContent } from "@/lib/defaultContent";
import { renderSection } from "@/components/preview/SectionRenderer";
import { generateMarkdown } from "@/lib/markdownGenerator";
import {
  IconCheck, IconArrowRight, IconArrowLeft, IconDownload,
} from "@/components/ui/Icons";

const WIZARD_DATA_KEY      = "lp_wizard_data";
const WIZARD_LAYOUTS_KEY   = "lp_wizard_layouts";
const WIZARD_CONFIRMED_KEY = "lp_wizard_confirmed";
const WIZARD_PALETTE_KEY   = "lp_wizard_palette";

export default function CompletePage() {
  const router = useRouter();
  const [lpData,            setLpData]            = useState<LPData>(defaultContent);
  const [sectionLayouts,    setSectionLayouts]    = useState<SectionLayouts>({ ...DEFAULT_SECTION_LAYOUTS });
  const [confirmedSections, setConfirmedSections] = useState<SectionKey[]>([]);
  const [palette,           setPalette]           = useState<ColorPalette>("A");
  const [initialized,       setInitialized]       = useState(false);
  const [modalOpen,         setModalOpen]         = useState(false);
  const [device,            setDevice]            = useState<"pc" | "tablet" | "sp">("pc");
  const [feedbackOpen,      setFeedbackOpen]      = useState(false);
  const [feedbackText,      setFeedbackText]      = useState("");
  const [feedbackSent,      setFeedbackSent]      = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawData      = localStorage.getItem(WIZARD_DATA_KEY);
      const rawLayouts   = localStorage.getItem(WIZARD_LAYOUTS_KEY);
      const rawConfirmed = localStorage.getItem(WIZARD_CONFIRMED_KEY);
      if (rawData)      setLpData(JSON.parse(rawData));
      if (rawLayouts)   setSectionLayouts(JSON.parse(rawLayouts));
      if (rawConfirmed) setConfirmedSections(JSON.parse(rawConfirmed));
      const savedPalette = localStorage.getItem(WIZARD_PALETTE_KEY) as ColorPalette | null;
      if (savedPalette && ["A", "B", "C"].includes(savedPalette)) setPalette(savedPalette);
    } catch { /* ignore */ }
    setInitialized(true);
    if (sessionStorage.getItem("lp_just_generated") === "1") {
      sessionStorage.removeItem("lp_just_generated");
      setTimeout(() => setModalOpen(true), 80);
    }
  }, []);

  // モーダルを2.5秒後に自動クローズ
  useEffect(() => {
    if (!modalOpen) return;
    const t = setTimeout(() => setModalOpen(false), 2500);
    return () => clearTimeout(t);
  }, [modalOpen]);

  const orderedSections = DEFAULT_SECTION_ORDER.filter((k) => confirmedSections.includes(k));

  const handleDownloadHtml = () => {
    // TODO: HTML生成・ダウンロード実装
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;
    // TODO: フィードバック送信処理
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText("");
      setFeedbackOpen(false);
    }, 1800);
  };

  const handleDownloadMd = () => {
    const md   = generateMarkdown(lpData, confirmedSections);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "content-source.md"; a.click();
    URL.revokeObjectURL(url);
  };

  if (!initialized) return null;

  return (
    <>
      <style>{`
        @keyframes ring-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          65%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes check-draw {
          from { stroke-dashoffset: 56; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes modal-in {
          0%   { opacity: 0; transform: scale(0.94) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .anim-ring  { animation: ring-pop 0.5s cubic-bezier(.22,.61,.36,1) forwards; }
        .anim-check { stroke-dasharray: 56; stroke-dashoffset: 56; animation: check-draw 0.35s ease forwards 0.45s; }
        .modal-in   { animation: modal-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>

      {/* ── 完成モーダル ────────────────────────────────────── */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.3)", backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-in"
            style={{
              background: "var(--col-bg)", borderRadius: 16,
              padding: "36px 40px 32px",
              width: 360, textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              border: "1px solid var(--col-border-2)",
            }}
          >
            <div className="anim-ring" style={{ display: "inline-block", marginBottom: 20 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" fill="var(--col-success-bg)" stroke="var(--col-success-bd)" strokeWidth="1.5" />
                <circle cx="40" cy="40" r="26" fill="none" stroke="var(--col-success-bd)" strokeWidth="1" />
                <path className="anim-check" d="M26 40 L36 51 L55 30"
                  stroke="var(--col-success)" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--col-text)", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>
              LPが完成しました
            </h2>
            <p style={{ fontSize: 13, color: "var(--col-text-2)", lineHeight: 1.7, marginBottom: 24 }}>
              <strong style={{ color: "var(--col-text)" }}>{orderedSections.length}個</strong>のセクションでLPを構築しました
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: "8px 24px", borderRadius: 8,
                  background: "var(--col-text)", color: "var(--col-bg)",
                  fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                プレビューを確認
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── フィードバックモーダル ───────────────────────────── */}
      {feedbackOpen && (
        <div
          onClick={() => { if (!feedbackSent) setFeedbackOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: "rgba(0,0,0,0.3)", backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-in"
            style={{
              background: "var(--col-bg)", borderRadius: 14,
              padding: "28px 28px 24px", width: 440,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              border: "1px solid var(--col-border-2)",
            }}
          >
            {feedbackSent ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🙏</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--col-text)", marginBottom: 4 }}>
                  ありがとうございます！
                </p>
                <p style={{ fontSize: 13, color: "var(--col-text-2)" }}>
                  フィードバックを受け付けました
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--col-text)", margin: "0 0 6px 0", fontFamily: "Inter, sans-serif" }}>
                    生成結果はどうでしたか？
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--col-text-2)", margin: 0, lineHeight: 1.6 }}>
                    改善してほしい点やご要望をお聞かせください
                  </p>
                </div>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="例: S3のメッセージセクションのコピーをもっと簡潔にしたい、カラーの選択肢を増やしてほしい..."
                  rows={5}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8,
                    border: "1px solid var(--col-border-2)",
                    background: "var(--col-surface)", color: "var(--col-text)",
                    fontSize: 13, lineHeight: 1.7, resize: "vertical",
                    outline: "none", fontFamily: "inherit", transition: "border-color 0.15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-text-2)"; }}
                  onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border-2)"; }}
                />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                  <button
                    onClick={() => setFeedbackOpen(false)}
                    style={{
                      padding: "7px 16px", borderRadius: 7,
                      background: "transparent", color: "var(--col-text-2)",
                      fontSize: 13, border: "1px solid var(--col-border)", cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border-2)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border)"; }}
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={!feedbackText.trim()}
                    style={{
                      padding: "7px 20px", borderRadius: 7,
                      background: feedbackText.trim() ? "var(--col-action)" : "var(--col-surface-2)",
                      color: feedbackText.trim() ? "var(--col-bg)" : "var(--col-text-3)",
                      fontSize: 13, fontWeight: 600, border: "none",
                      cursor: feedbackText.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { if (feedbackText.trim()) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    送信する
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── メインレイアウト ─────────────────────────────────── */}
      <div style={{ background: "var(--col-bg)", height: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ヘッダー */}
        <header style={{
          flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: 52, background: "var(--col-bg)",
          borderBottom: "1px solid var(--col-border)", position: "sticky", top: 0, zIndex: 50,
        }}>
          <div
            onClick={() => router.push("/")}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 6, background: "var(--col-surface)",
              border: "1px solid var(--col-border-2)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "var(--col-text)",
            }}>LP</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--col-text)", fontFamily: "Inter, sans-serif" }}>
              LP生成ウィザード
            </span>
            <div style={{
              display: "flex", alignItems: "center", gap: 5, padding: "2px 10px",
              borderRadius: 20, background: "var(--col-success-bg)", border: "1px solid var(--col-success-bd)",
              fontSize: 11, fontWeight: 600, color: "var(--col-success)",
            }}>
              <IconCheck size={11} />
              <span>生成完了</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setFeedbackOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 6, background: "transparent",
                color: "var(--col-text-2)", fontSize: 12, fontWeight: 500,
                border: "1px solid var(--col-border)", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border-2)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              フィードバック
            </button>
            <button
              onClick={handleDownloadMd}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 6, background: "transparent",
                color: "var(--col-text-2)", fontSize: 12, fontWeight: 500,
                border: "1px solid var(--col-border)", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border-2)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; }}
            >
              <IconDownload size={13} />
              MDをダウンロード
            </button>
            <button
              onClick={handleDownloadHtml}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 6, background: "transparent",
                color: "var(--col-text-2)", fontSize: 12, fontWeight: 500,
                border: "1px solid var(--col-border)", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border-2)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; }}
            >
              <IconDownload size={13} />
              HTMLをダウンロード
            </button>
            <button
              onClick={() => router.push("/editor")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 14px", borderRadius: 6, background: "var(--col-action)",
                color: "#fff", fontSize: 12, fontWeight: 600,
                border: "none", cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-action-h)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-action)"; }}
            >
              エディタで編集
              <IconArrowRight size={12} />
            </button>
          </div>
        </header>

        {/* メインコンテンツ: 全幅プレビュー */}
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: 20, gap: 12, minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--col-text)" }}>
              生成されたLPプレビュー
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: "var(--col-text-3)" }}>
                {orderedSections.length}セクション
              </span>
            </p>
            <span style={{ fontSize: 11, color: "var(--col-text-3)" }}>スクロールして全体を確認</span>
          </div>

          {/* ブラウザウィンドウ */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0,
            borderRadius: 10, border: "1px solid var(--col-border-2)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}>
            {/* バー */}
            <div style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: 10,
              padding: "6px 14px", background: "var(--col-surface)",
              borderBottom: "1px solid var(--col-border)",
            }}>
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, display: "flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: 5,
                background: "var(--col-surface-2)", border: "1px solid var(--col-border)",
              }}>
                <span style={{ fontSize: 11, color: "var(--col-text-3)", fontFamily: "monospace" }}>
                  your-lp.example.com
                </span>
              </div>
              {/* デバイス切替 */}
              <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                {([
                  { key: "pc",     label: "PC",
                    icon: <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={1.8}/><path strokeLinecap="round" strokeWidth={1.8} d="M8 21h8M12 17v4"/></svg> },
                  { key: "tablet", label: "Tablet",
                    icon: <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth={1.8}/><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/></svg> },
                  { key: "sp",     label: "SP",
                    icon: <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2" strokeWidth={1.8}/><circle cx="12" cy="18.5" r="0.8" fill="currentColor" stroke="none"/></svg> },
                ] as const).map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDevice(d.key)}
                    title={d.label}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 28, height: 28, borderRadius: 6, border: "none",
                      cursor: "pointer", transition: "all 150ms",
                      ...(device === d.key
                        ? { background: "var(--col-surface-3)", color: "var(--col-text)" }
                        : { background: "transparent", color: "var(--col-text-3)" }),
                    }}
                  >
                    {d.icon}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--col-text-3)", flexShrink: 0, minWidth: 36 }}>
                {device === "tablet" ? "768px" : device === "sp" ? "390px" : "100%"}
              </span>
            </div>
            {/* LP本体 */}
            <div style={{
              flex: 1, overflowY: "auto",
              background: device === "pc" ? "var(--col-bg)" : "var(--col-surface-2)",
            }}>
              <div style={
                device !== "pc"
                  ? { width: device === "tablet" ? 768 : 390, margin: "16px auto", boxShadow: "0 4px 24px rgba(0,0,0,0.18)", borderRadius: 4, overflow: "hidden", minHeight: "calc(100% - 32px)" }
                  : { width: "100%" }
              }>
                <div className="lp-preview-root" data-palette={palette}>
                  {orderedSections.map((key) => (
                    <div key={key}>
                      {renderSection(key, lpData, (sectionLayouts[key] ?? 0) as LayoutIndex)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ボトムバー */}
        <footer style={{
          flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: 52, background: "var(--col-bg)",
          borderTop: "1px solid var(--col-border)",
        }}>
          <button
            onClick={() => router.push("/")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 6, background: "transparent",
              color: "var(--col-text-2)", fontSize: 12, border: "none", cursor: "pointer",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; }}
          >
            <IconArrowLeft size={13} />
            ウィザードに戻る
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleDownloadMd}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 7, background: "transparent",
                color: "var(--col-text)", fontSize: 13, fontWeight: 500,
                border: "1px solid var(--col-border-2)", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-surface)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <IconDownload size={14} />
              MDをダウンロード
            </button>
            <button
              onClick={handleDownloadHtml}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 7, background: "transparent",
                color: "var(--col-text)", fontSize: 13, fontWeight: 500,
                border: "1px solid var(--col-border-2)", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-surface)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <IconDownload size={14} />
              HTMLをダウンロード
            </button>
            <button
              onClick={() => router.push("/editor")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 20px", borderRadius: 7, background: "var(--col-action)",
                color: "#fff", fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-action-h)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-action)"; }}
            >
              エディタで編集
              <IconArrowRight size={14} />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
