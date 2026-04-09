"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultContent } from "@/lib/defaultContent";
import type { LPData, SectionLayouts, LayoutIndex, SectionKey } from "@/lib/types";
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_LAYOUTS } from "@/lib/types";
import S1HeaderForm from "@/components/editor/sections/S1HeaderForm";
import S2HeroForm from "@/components/editor/sections/S2HeroForm";
import S5FeaturesForm from "@/components/editor/sections/S5FeaturesForm";
import S8FlowForm from "@/components/editor/sections/S8FlowForm";
import S10ClosingForm from "@/components/editor/sections/S10ClosingForm";
import S11FooterForm from "@/components/editor/sections/S11FooterForm";
import LayoutPicker from "@/components/wizard/LayoutPicker";
import { renderSection } from "@/components/preview/SectionRenderer";
import {
  IconCheck, IconPlus, IconForm, IconMarkdown, IconAI,
  SECTION_ICONS,
} from "@/components/ui/Icons";

const WIZARD_DATA_KEY      = "lp_wizard_data";
const WIZARD_LAYOUTS_KEY   = "lp_wizard_layouts";
const WIZARD_CONFIRMED_KEY = "lp_wizard_confirmed";

const STEPS = [
  { key: "s1"  as const, id: "S1",  title: "ナビゲーション",  subtitle: "Header",   description: "ヘッダーに表示するメニュー項目と、右上のCTAボタンを設定します。" },
  { key: "s2"  as const, id: "S2",  title: "ファーストビュー", subtitle: "Hero",     description: "訪問者が最初に目にするキャッチコピーとCTAです。" },
  { key: "s5"  as const, id: "S5",  title: "特徴・強み",      subtitle: "Features", description: "課題を解決できる根拠として、サービスの3つの強みを伝えます。" },
  { key: "s8"  as const, id: "S8",  title: "導入フロー",      subtitle: "Flow",     description: "申込みから利用開始までのステップを示します。" },
  { key: "s10" as const, id: "S10", title: "最終CTA",         subtitle: "Closing",  description: "ページ末尾の最後の行動喚起です。" },
  { key: "s11" as const, id: "S11", title: "フッター",        subtitle: "Footer",   description: "企業情報へのリンクとコピーライトを設定します。" },
] as const;

type Phase = "welcome" | "builder" | "generating";

// ─── 生成中スクリーン ─────────────────────────────────────────
function GeneratingScreen({ confirmedSections }: { confirmedSections: SectionKey[] }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [flowStep,     setFlowStep]     = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setFlowStep(1), 1600);
    const t2 = setTimeout(() => setFlowStep(2), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (confirmedSections.length === 0) return;
    const interval = Math.min(4000 / confirmedSections.length, 400);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= confirmedSections.length) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [confirmedSections]);

  const orderedSteps = STEPS.filter((s) => confirmedSections.includes(s.key));
  const progress = orderedSteps.length > 0
    ? Math.round((visibleCount / orderedSteps.length) * 100) : 0;
  const isDone = visibleCount >= orderedSteps.length;

  const flowNodes = [
    { icon: <IconForm size={22} />, label: "フォーム入力", sub: "入力内容を収集" },
    { icon: <IconMarkdown size={22} />, label: "MDファイル", sub: "Markdownに変換" },
    { icon: <IconAI size={22} />, label: "AI生成", sub: "LPを自動構築" },
  ];

  return (
    <div style={{ background: "var(--col-bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ width: "100%", maxWidth: 480 }} className="fade-in">

        {/* ロゴ */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: "var(--col-surface)", border: "1px solid var(--col-border-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "var(--col-text)",
          }}>LP</div>
        </div>

        {/* タイトル */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--col-text)", marginBottom: 6, fontFamily: "Inter, sans-serif" }}>
            LPを生成しています
          </h2>
          <p style={{ fontSize: 13, color: "var(--col-text-2)" }}>
            {isDone ? "エディタを準備中です..." : "セクションを構築しています..."}
          </p>
        </div>

        {/* フロー図 */}
        <div style={{
          background: "var(--col-surface)", border: "1px solid var(--col-border)",
          borderRadius: 10, padding: "20px 24px", marginBottom: 16,
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20, textAlign: "center" }}>
            生成フロー
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
            {flowNodes.map((node, i) => {
              const active = flowStep >= i;
              const isCurrent = flowStep === i;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 100 }}>
                    {/* アイコン枠 */}
                    <div style={{
                      width: 56, height: 56, borderRadius: 12,
                      background: active ? "var(--col-surface-3)" : "var(--col-surface-2)",
                      border: `1px solid ${active ? "var(--col-border-2)" : "var(--col-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: active ? "var(--col-text)" : "var(--col-text-3)",
                      transform: isCurrent ? "scale(1.06)" : "scale(1)",
                      transition: "all 0.4s ease",
                      marginBottom: 10,
                    }}>
                      {node.icon}
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: active ? "var(--col-text)" : "var(--col-text-3)", textAlign: "center", transition: "color 0.4s", marginBottom: 2 }}>
                      {node.label}
                    </p>
                    <p style={{ fontSize: 10, color: active ? "var(--col-text-2)" : "var(--col-text-3)", textAlign: "center", transition: "color 0.4s" }}>
                      {node.sub}
                    </p>
                    <div style={{
                      marginTop: 8, width: 20, height: 20, borderRadius: "50%",
                      background: active ? "var(--col-surface-3)" : "transparent",
                      border: `1px solid ${active ? "var(--col-border-2)" : "var(--col-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: active ? "var(--col-text)" : "var(--col-text-3)",
                      transition: "all 0.4s",
                    }}>{i + 1}</div>
                  </div>
                  {i < 2 && (
                    <div style={{ marginBottom: 44, marginLeft: 4, marginRight: 4 }}>
                      <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                        <line x1="0" y1="8" x2="20" y2="8"
                          stroke={flowStep > i ? "var(--col-text-2)" : "var(--col-border-2)"}
                          strokeWidth="1.5" strokeDasharray="4 2.5"
                          style={{ transition: "stroke 0.4s" }}
                        />
                        <path d="M18 4 L27 8 L18 12 Z"
                          fill={flowStep > i ? "var(--col-text-2)" : "var(--col-border-2)"}
                          style={{ transition: "fill 0.4s" }}
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* セクション一覧 */}
        {orderedSteps.length > 0 && (
          <div style={{
            background: "var(--col-surface)", border: "1px solid var(--col-border)",
            borderRadius: 10, padding: "16px 20px", marginBottom: 16,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              生成中のセクション
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {orderedSteps.map((step, i) => {
                const SIcon = SECTION_ICONS[step.key];
                const isVis = i < visibleCount;
                return (
                  <div key={step.key} style={{ display: "flex", alignItems: "center", gap: 10, opacity: isVis ? 1 : 0.3, transition: "opacity 0.3s" }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: isVis ? "var(--col-success-bg)" : "var(--col-surface-2)",
                      border: `1px solid ${isVis ? "var(--col-success-bd)" : "var(--col-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "all 0.3s",
                      color: isVis ? "var(--col-success)" : "var(--col-text-3)",
                    }}>
                      {isVis ? <IconCheck size={12} /> : <div style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />}
                    </div>
                    <span style={{ fontSize: 13, color: isVis ? "var(--col-text)" : "var(--col-text-3)", fontWeight: isVis ? 500 : 400, flex: 1 }}>
                      {step.title}
                    </span>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: isVis ? "var(--col-text-2)" : "var(--col-text-3)" }}>{step.id}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* プログレスバー */}
        <div style={{ background: "var(--col-surface-2)", borderRadius: 4, overflow: "hidden", height: 4, marginBottom: 8 }}>
          <div style={{ height: "100%", borderRadius: 4, background: "var(--col-action)", transition: "width 0.3s ease", width: `${progress}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "var(--col-text-3)" }}>{visibleCount} / {orderedSteps.length} セクション</span>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--col-text-2)" }}>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

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
      const newConfirmed = [...confirmedSections, activeKey];
      setConfirmedSections(newConfirmed);
      setNewlyConfirmedKey(activeKey);
      setTimeout(() => setNewlyConfirmedKey(null), 700);
      // 次のセクションへ自動移動
      const currentIdx = STEPS.findIndex((s) => s.key === activeKey);
      const nextStep = STEPS[currentIdx + 1];
      if (nextStep) {
        setTimeout(() => handleSelectSection(nextStep.key), 300);
      } else {
        // 最後のセクションの場合、未確定の最初のセクションへ
        const firstUnconfirmed = STEPS.find((s) => !newConfirmed.includes(s.key));
        if (firstUnconfirmed) setTimeout(() => handleSelectSection(firstUnconfirmed.key), 300);
      }
    }
  };

  const handleUnconfirm = (key: SectionKey) => {
    setConfirmedSections((prev) => prev.filter((k) => k !== key));
  };

  const generate = () => {
    setPhase("generating");
    try {
      localStorage.setItem(WIZARD_DATA_KEY, JSON.stringify(data));
      localStorage.setItem(WIZARD_LAYOUTS_KEY, JSON.stringify(layouts));
      localStorage.setItem(WIZARD_CONFIRMED_KEY, JSON.stringify(confirmedSections));
    } catch { /* ignore */ }
    setTimeout(() => router.push("/complete"), 5000);
  };

  const renderForm = () => {
    switch (activeKey) {
      case "s1":  return <S1HeaderForm   data={data.s1}  onChange={(s1)  => setData({ ...data, s1  })} />;
      case "s2":  return <S2HeroForm     data={data.s2}  onChange={(s2)  => setData({ ...data, s2  })} />;
      case "s5":  return <S5FeaturesForm data={data.s5}  onChange={(s5)  => setData({ ...data, s5  })} />;
      case "s8":  return <S8FlowForm     data={data.s8}  onChange={(s8)  => setData({ ...data, s8  })} />;
      case "s10": return <S10ClosingForm data={data.s10} onChange={(s10) => setData({ ...data, s10 })} />;
      case "s11": return <S11FooterForm  data={data.s11} onChange={(s11) => setData({ ...data, s11 })} />;
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

  // ── 生成中 ────────────────────────────────────────────────
  if (phase === "generating") {
    return <GeneratingScreen confirmedSections={confirmedSections} />;
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
            {confirmedSections.length} / 6
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
            <span style={{ fontSize: 11, color: "var(--col-text-3)" }}>
              {activeStep.id} · Layout {["A", "B", "C"][currentLayout]}
              {orderedConfirmed.length > 0 && <span style={{ marginLeft: 8, color: "var(--col-success)" }}>確定 {orderedConfirmed.length}</span>}
            </span>
          </div>

          {/* プレビュー本体: 確定済み + 現在編集中のセクションを常に表示 */}
          <div style={{ flex: 1, overflowY: "auto", background: "#f0f0f0" }}>
            <div style={{ maxWidth: 900, margin: "20px auto", borderRadius: 6, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <div className="lp-preview-root">
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
                      {renderSection(key, data, layouts[key] as LayoutIndex)}
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
