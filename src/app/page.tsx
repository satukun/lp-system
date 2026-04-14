"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultContent } from "@/lib/defaultContent";
import type { LPData, SectionLayouts, LayoutIndex, SectionKey, ColorPalette } from "@/lib/types";
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_LAYOUTS } from "@/lib/types";
import S1HeaderForm from "@/components/editor/sections/S1HeaderForm";
import S2HeroForm from "@/components/editor/sections/S2HeroForm";
import S3MessageForm from "@/components/editor/sections/S3MessageForm";
import S4ProblemsForm from "@/components/editor/sections/S4ProblemsForm";
import S5FeaturesForm from "@/components/editor/sections/S5FeaturesForm";
import S6CategoriesForm from "@/components/editor/sections/S6CategoriesForm";
import S7CaseStudiesForm from "@/components/editor/sections/S7CaseStudiesForm";
import S8FlowForm from "@/components/editor/sections/S8FlowForm";
import S9FormFaqForm from "@/components/editor/sections/S9FormFaqForm";
import S10ClosingForm from "@/components/editor/sections/S10ClosingForm";
import S11FooterForm from "@/components/editor/sections/S11FooterForm";
import LayoutPicker from "@/components/wizard/LayoutPicker";
import { renderSection } from "@/components/preview/SectionRenderer";
import {
  IconCheck, IconPlus, SECTION_ICONS,
} from "@/components/ui/Icons";

const WIZARD_DATA_KEY      = "lp_wizard_data";
const WIZARD_LAYOUTS_KEY   = "lp_wizard_layouts";
const WIZARD_CONFIRMED_KEY = "lp_wizard_confirmed";
const WIZARD_PALETTE_KEY   = "lp_wizard_palette";

const STEPS = [
  { key: "s1"  as const, id: "S1",  title: "ナビゲーション",  subtitle: "Header",      description: "ヘッダーに表示するメニュー項目と、右上のCTAボタンを設定します。" },
  { key: "s2"  as const, id: "S2",  title: "ファーストビュー", subtitle: "Hero",        description: "訪問者が最初に目にするキャッチコピーとCTAです。" },
  { key: "s3"  as const, id: "S3",  title: "メッセージ",      subtitle: "Message",     description: "サービスの概要を端的に伝えるブリッジセクションです。" },
  { key: "s4"  as const, id: "S4",  title: "課題定義",        subtitle: "Problems",    description: "ターゲットが抱える課題を3つ提示し、共感を得ます。" },
  { key: "s5"  as const, id: "S5",  title: "特徴・強み",      subtitle: "Features",    description: "課題を解決できる根拠として、サービスの3つの強みを伝えます。" },
  { key: "s6"  as const, id: "S6",  title: "カテゴリ",        subtitle: "Categories",  description: "対応できる業種・カテゴリを6つのカードで網羅的に見せます。" },
  { key: "s7"  as const, id: "S7",  title: "導入事例",        subtitle: "Cases",       description: "実際の導入企業と成果を3つの事例で紹介します。" },
  { key: "s8"  as const, id: "S8",  title: "導入フロー",      subtitle: "Flow",        description: "申込みから利用開始までのステップを示します。" },
  { key: "s9"  as const, id: "S9",  title: "フォーム・FAQ",   subtitle: "Form & FAQ",  description: "よくある質問と資料請求フォームを設定します。" },
  { key: "s10" as const, id: "S10", title: "最終CTA",         subtitle: "Closing",     description: "ページ末尾の最後の行動喚起です。" },
  { key: "s11" as const, id: "S11", title: "フッター",        subtitle: "Footer",      description: "企業情報へのリンクとコピーライトを設定します。" },
] as const;

type Phase = "welcome" | "builder";

// ─── メインページ ─────────────────────────────────────────────
export default function WizardPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [data, setData] = useState<LPData>(defaultContent);
  const [layouts, setLayouts] = useState<SectionLayouts>({ ...DEFAULT_SECTION_LAYOUTS });
  const [activeKey, setActiveKey] = useState<SectionKey>("s1");
  const [confirmedSections, setConfirmedSections] = useState<SectionKey[]>([]);
  const [newlyConfirmedKey, setNewlyConfirmedKey] = useState<SectionKey | null>(null);
  const [showExitConfirm,   setShowExitConfirm]   = useState(false);
  const [palette, setPalette] = useState<ColorPalette>("A");

  const handleImageChange = (key: string, url: string) => {
    setData((prev) => ({ ...prev, images: { ...prev.images, [key]: url } }));
  };

  const formRef = useRef<HTMLDivElement>(null);
  const navRef  = useRef<HTMLDivElement>(null);

  const activeStep     = STEPS.find((s) => s.key === activeKey)!;
  const currentLayout  = layouts[activeKey] as LayoutIndex;
  const isConfirmed    = confirmedSections.includes(activeKey);
  const orderedConfirmed = DEFAULT_SECTION_ORDER.filter((k) => confirmedSections.includes(k));

  const handleSelectSection = (key: SectionKey) => {
    setActiveKey(key);
    formRef.current?.scrollTo({ top: 0, behavior: "instant" });
    const chipEl = navRef.current?.querySelector<HTMLElement>(`[data-key="${key}"]`);
    chipEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const handleConfirm = () => {
    if (!isConfirmed) {
      setConfirmedSections((prev) => [...prev, activeKey]);
      setNewlyConfirmedKey(activeKey);
      setTimeout(() => setNewlyConfirmedKey(null), 700);
    }
  };

  const handleUnconfirm = (key: SectionKey) => {
    setConfirmedSections((prev) => prev.filter((k) => k !== key));
  };

  const generate = () => {
    try {
      localStorage.setItem(WIZARD_DATA_KEY, JSON.stringify(data));
      localStorage.setItem(WIZARD_LAYOUTS_KEY, JSON.stringify(layouts));
      localStorage.setItem(WIZARD_CONFIRMED_KEY, JSON.stringify(confirmedSections));
      localStorage.setItem(WIZARD_PALETTE_KEY, palette);
    } catch { /* ignore */ }
    sessionStorage.setItem("lp_just_generated", "1");
    router.push("/generating");
  };

  const renderForm = () => {
    switch (activeKey) {
      case "s1":  return <S1HeaderForm     data={data.s1}  onChange={(s1)  => setData({ ...data, s1  })} />;
      case "s2":  return <S2HeroForm       data={data.s2}  onChange={(s2)  => setData({ ...data, s2  })} />;
      case "s3":  return <S3MessageForm    data={data.s3}  onChange={(s3)  => setData({ ...data, s3  })} />;
      case "s4":  return <S4ProblemsForm   data={data.s4}  onChange={(s4)  => setData({ ...data, s4  })} />;
      case "s5":  return <S5FeaturesForm   data={data.s5}  onChange={(s5)  => setData({ ...data, s5  })} />;
      case "s6":  return <S6CategoriesForm data={data.s6}  onChange={(s6)  => setData({ ...data, s6  })} />;
      case "s7":  return <S7CaseStudiesForm data={data.s7} onChange={(s7)  => setData({ ...data, s7  })} />;
      case "s8":  return <S8FlowForm       data={data.s8}  onChange={(s8)  => setData({ ...data, s8  })} />;
      case "s9":  return <S9FormFaqForm    data={data.s9}  onChange={(s9)  => setData({ ...data, s9  })} />;
      case "s10": return <S10ClosingForm   data={data.s10} onChange={(s10) => setData({ ...data, s10 })} />;
      case "s11": return <S11FooterForm    data={data.s11} onChange={(s11) => setData({ ...data, s11 })} />;
      default:    return null;
    }
  };

  // ── ウェルカム画面 ─────────────────────────────────────────
  if (phase === "welcome") {
    return (
      <div style={{ background: "var(--col-bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }} className="fade-in">

          {/* ロゴ */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: "var(--col-surface)", border: "1px solid var(--col-border-2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: "var(--col-text)", letterSpacing: "-0.02em",
            }}>LP</div>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--col-text)", textAlign: "center", marginBottom: 10, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
            LP生成ウィザード
          </h1>
          <p style={{ fontSize: 14, color: "var(--col-text-2)", textAlign: "center", lineHeight: 1.7, marginBottom: 6 }}>
            質問に答えるだけで、toB向けLPが完成します。
          </p>
          <p style={{ fontSize: 13, color: "var(--col-text-3)", textAlign: "center", lineHeight: 1.7, marginBottom: 28 }}>
            好きなセクションから自由に入力できます。<br />
            確定したセクションからプレビューに積み上がっていきます。
          </p>

          <button
            onClick={() => setPhase("builder")}
            style={{
              width: "100%", padding: "11px 0", borderRadius: 8,
              background: "var(--col-action)", color: "#fff",
              fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-action-h)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-action)"; }}
          >
            はじめる
          </button>
          <button
            onClick={() => router.push("/editor")}
            style={{
              width: "100%", padding: "10px 0", marginTop: 8,
              background: "transparent", color: "var(--col-text-2)",
              fontSize: 13, border: "none", cursor: "pointer", borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; }}
          >
            スキップしてエディタへ進む
          </button>
        </div>
      </div>
    );
  }

  // ── ビルダー画面 ──────────────────────────────────────────
  const SActiveIcon = SECTION_ICONS[activeKey];

  return (
    <>
    <div style={{ background: "var(--col-bg)", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── トップバー ─────────────────────────────────── */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center",
        padding: "0 16px", height: 48, background: "var(--col-bg)",
        borderBottom: "1px solid var(--col-border)", zIndex: 10, gap: 12,
      }}>
        {/* 左: ロゴ + タイトル（クリックでトップへ） */}
        <button
          onClick={() => {
            if (confirmedSections.length > 0) setShowExitConfirm(true);
            else setPhase("welcome");
          }}
          style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 6, transition: "background 0.15s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-surface-2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "var(--col-surface)", border: "1px solid var(--col-border-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "var(--col-text)",
          }}>LP</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--col-text)", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
            LP生成ウィザード
          </span>
        </button>

        {/* 中: セクションチップ (スクロール可能) */}
        <div
          ref={navRef}
          style={{
            flex: 1, display: "flex", gap: 4, overflowX: "auto",
            padding: "0 4px", scrollbarWidth: "none", alignItems: "center",
          }}
        >
          {STEPS.map((s) => {
            const done   = confirmedSections.includes(s.key);
            const active = activeKey === s.key;
            const SIcon  = SECTION_ICONS[s.key];
            return (
              <button
                key={s.key}
                data-key={s.key}
                onClick={() => handleSelectSection(s.key)}
                style={{
                  flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
                  padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                  cursor: "pointer", transition: "all 0.12s", border: "1px solid transparent",
                  background: active
                    ? "var(--col-surface-3)"
                    : done ? "var(--col-success-bg)" : "transparent",
                  color: active
                    ? "var(--col-text)"
                    : done ? "var(--col-success)" : "var(--col-text-2)",
                  borderColor: active
                    ? "var(--col-border-2)"
                    : done ? "var(--col-success-bd)" : "transparent",
                }}
              >
                {done
                  ? <IconCheck size={11} />
                  : <SIcon size={11} />
                }
                <span>{s.id}</span>
              </button>
            );
          })}
        </div>

        {/* 右: 確定数 + ボタン */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--col-text-3)", whiteSpace: "nowrap" }}>
            {confirmedSections.length} / 11
          </span>
          <button
            onClick={() => router.push("/editor")}
            style={{
              padding: "5px 12px", borderRadius: 6, background: "transparent",
              color: "var(--col-text-2)", fontSize: 12, border: "1px solid var(--col-border)",
              cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border-2)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; }}
          >
            スキップ
          </button>
          <button
            onClick={generate}
            disabled={confirmedSections.length === 0}
            style={{
              padding: "5px 14px", borderRadius: 6,
              background: confirmedSections.length > 0 ? "var(--col-action)" : "var(--col-surface-2)",
              color: confirmedSections.length > 0 ? "#fff" : "var(--col-text-3)",
              fontSize: 12, fontWeight: 600, border: "none", cursor: confirmedSections.length > 0 ? "pointer" : "not-allowed",
              transition: "all 0.15s", whiteSpace: "nowrap",
            }}
          >
            LPを生成
          </button>
        </div>
      </div>

      {/* ── 本体 ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* 左パネル */}
        <div style={{
          flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden",
          width: 480, borderRight: "1px solid var(--col-border)", background: "var(--col-surface)",
        }}>
          {/* フォームエリア */}
          <div ref={formRef} style={{ flex: 1, overflowY: "auto", padding: 20 }}>

            {/* セクションヘッダー */}
            <div key={`hdr-${activeKey}`} className="fade-in" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "3px 10px",
                  borderRadius: 20, border: "1px solid var(--col-border-2)",
                  background: "var(--col-surface-2)",
                  fontSize: 11, fontWeight: 600, color: "var(--col-text-2)",
                }}>
                  <SActiveIcon size={12} />
                  <span>{activeStep.id} · {activeStep.subtitle}</span>
                </div>
              </div>
              {/* タイトル行 + 追加/確定ボタン */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--col-text)", margin: 0, fontFamily: "Inter, sans-serif" }}>
                  {activeStep.title}
                </h2>
                {isConfirmed ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--col-success)", padding: "4px 10px", borderRadius: 6, background: "var(--col-success-bg)", border: "1px solid var(--col-success-bd)" }}>
                      <IconCheck size={11} />
                      <span>確定済み</span>
                    </div>
                    <button
                      onClick={() => handleUnconfirm(activeKey)}
                      style={{
                        padding: "4px 10px", borderRadius: 6, background: "transparent",
                        color: "var(--col-text-3)", fontSize: 11,
                        border: "1px solid var(--col-border)", cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border-2)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text-3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--col-border)"; }}
                    >
                      × 取り消す
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirm}
                    style={{
                      flexShrink: 0, padding: "5px 14px", borderRadius: 6,
                      background: "var(--col-text)", color: "var(--col-bg)",
                      fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 5,
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    <IconPlus size={12} />
                    追加
                  </button>
                )}
              </div>
              <p style={{ fontSize: 13, color: "var(--col-text-2)", lineHeight: 1.6 }}>{activeStep.description}</p>
            </div>

            {/* レイアウトピッカー */}
            <div key={`lp-${activeKey}`} className="fade-in surface" style={{ padding: 16, marginBottom: 12 }}>
              <LayoutPicker
                sectionKey={activeKey}
                value={currentLayout}
                onChange={(idx) => {
                  setLayouts({ ...layouts, [activeKey]: idx });
                }}
              />
            </div>

            {/* コンテンツフォーム */}
            <div key={`form-${activeKey}`} className="fade-in surface" style={{ padding: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>コンテンツ入力</p>
              {renderForm()}
            </div>
          </div>

        </div>

        {/* 右パネル: プレビュー */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* プレビューヘッダー */}
          <div style={{
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 12px", height: 40, background: "var(--col-bg)",
            borderBottom: "1px solid var(--col-border)",
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              プレビュー
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--col-text-3)" }}>カラー</span>
              {([
                { key: "A" as const, color: "#FFD700" },
                { key: "B" as const, color: "#3B82F6" },
                { key: "C" as const, color: "#10B981" },
              ] as { key: ColorPalette; color: string }[]).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPalette(p.key)}
                  title={`パレット${p.key}`}
                  style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: p.color, cursor: "pointer",
                    border: palette === p.key ? "2px solid var(--col-text)" : "2px solid transparent",
                    outline: palette === p.key ? `2px solid ${p.color}` : "none",
                    outlineOffset: 1,
                    transition: "all 150ms",
                  }}
                />
              ))}
              <span style={{ fontSize: 11, color: "var(--col-text-3)", marginLeft: 4 }}>
                {activeStep.id} · Layout {["A", "B", "C"][currentLayout]}
                {orderedConfirmed.length > 0 && <span style={{ marginLeft: 6, color: "var(--col-success)" }}>確定 {orderedConfirmed.length}</span>}
              </span>
            </div>
          </div>

          {/* プレビュー本体: 確定済み + 現在編集中のセクションを常に表示 */}
          <div style={{ flex: 1, overflowY: "auto", background: "#f0f0f0" }}>
            <div style={{ maxWidth: 900, margin: "20px auto", borderRadius: 6, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <div className="lp-preview-root" data-palette={palette}>
                {DEFAULT_SECTION_ORDER
                  .filter((k) => confirmedSections.includes(k) || k === activeKey)
                  .map((key) => (
                    <div
                      key={`${key}-${layouts[key] ?? 0}`}
                      style={{ position: "relative" }}
                      className={`layout-switch${newlyConfirmedKey === key ? " stack-in" : ""}`}
                    >
                      {key === activeKey && !confirmedSections.includes(key) && (
                        <div style={{
                          position: "absolute", top: 8, left: 8, zIndex: 10,
                          fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                          background: "rgba(55,53,47,0.6)", color: "#fff",
                          pointerEvents: "none", letterSpacing: "0.04em",
                        }}>
                          {activeStep.id} · 編集中
                        </div>
                      )}
                      {renderSection(key, data, layouts[key] as LayoutIndex, handleImageChange)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── 戻る確認モーダル ────────────────────────────────── */}
    {showExitConfirm && (
      <div
        onClick={() => setShowExitConfirm(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="fade-in"
          style={{
            background: "var(--col-bg)", borderRadius: 12, padding: "28px 28px 24px",
            width: 340, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            border: "1px solid var(--col-border-2)",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--col-text)", marginBottom: 8 }}>
            トップに戻りますか？
          </h3>
          <p style={{ fontSize: 13, color: "var(--col-text-2)", lineHeight: 1.6, marginBottom: 24 }}>
            確定済みの {confirmedSections.length} セクションのデータは失われます。
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowExitConfirm(false)}
              style={{
                padding: "7px 16px", borderRadius: 7, background: "transparent",
                color: "var(--col-text-2)", fontSize: 13,
                border: "1px solid var(--col-border)", cursor: "pointer",
              }}
            >
              キャンセル
            </button>
            <button
              onClick={() => { setShowExitConfirm(false); setPhase("welcome"); setConfirmedSections([]); }}
              style={{
                padding: "7px 16px", borderRadius: 7,
                background: "var(--col-text)", color: "var(--col-bg)",
                fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
              }}
            >
              トップに戻る
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
