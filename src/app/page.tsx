"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { defaultContent } from "@/lib/defaultContent";
import type { LPData, SectionLayouts, LayoutIndex, SectionKey } from "@/lib/types";
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

const WIZARD_DATA_KEY = "lp_wizard_data";
const WIZARD_LAYOUTS_KEY = "lp_wizard_layouts";
const WIZARD_CONFIRMED_KEY = "lp_wizard_confirmed";

const STEPS = [
  { key: "s1"  as const, id: "S1",  title: "ナビゲーション", subtitle: "Header",   description: "ヘッダーに表示するメニュー項目と、右上のCTAボタンを設定します。",                                                                   emoji: "🧭", accent: "#60a5fa" },
  { key: "s2"  as const, id: "S2",  title: "ファーストビュー", subtitle: "Hero",     description: "訪問者が最初に目にするキャッチコピーとCTAです。読んだ瞬間に「自分ごと」と感じさせる言葉を選びましょう。",                      emoji: "🎯", accent: "#a78bfa" },
  { key: "s3"  as const, id: "S3",  title: "サービス概要",    subtitle: "Message",  description: "「このサービスは何者か」を一言で伝えるセクション。サービスの本質を簡潔に。",                                                       emoji: "💬", accent: "#22d3ee" },
  { key: "s4"  as const, id: "S4",  title: "課題提示",        subtitle: "Problems", description: "ターゲットが抱えている悩みを3つ提示します。「そうそう、それ！」と感じさせる内容が効果的。",                                         emoji: "😣", accent: "#fb923c" },
  { key: "s5"  as const, id: "S5",  title: "特徴・強み",      subtitle: "Features", description: "課題を解決できる根拠として、サービスの3つの強みを伝えます。競合との差別化を意識しましょう。",                                      emoji: "✨", accent: "#fbbf24" },
  { key: "s6"  as const, id: "S6",  title: "対応業種",        subtitle: "Categories", description: "サービスが対応している業種やカテゴリを6つ掲載します。「自分の業種もある」と安心させましょう。",                                  emoji: "🏢", accent: "#2dd4bf" },
  { key: "s7"  as const, id: "S7",  title: "導入事例",        subtitle: "Case Studies", description: "実際の導入企業の事例を3社分掲載。社会的証明として信頼性を高めます。",                                                          emoji: "📊", accent: "#818cf8" },
  { key: "s8"  as const, id: "S8",  title: "導入フロー",      subtitle: "Flow",     description: "申込みから利用開始までのステップを示します。「簡単に始められる」という安心感が申込み率を上げます。",                                emoji: "🚀", accent: "#f472b6" },
  { key: "s9"  as const, id: "S9",  title: "よくある質問",    subtitle: "FAQ",      description: "申込みをためらう理由を先回りして解消します。フォームの見出しも設定します。",                                                         emoji: "❓", accent: "#c084fc" },
  { key: "s10" as const, id: "S10", title: "最終CTA",         subtitle: "Closing",  description: "ページ末尾の最後の行動喚起です。スクロールしてここまで読んだ人への「背中を押す一言」を。",                                          emoji: "🎬", accent: "#fb7185" },
  { key: "s11" as const, id: "S11", title: "フッター",        subtitle: "Footer",   description: "企業情報へのリンクとコピーライトを設定します。",                                                                                    emoji: "📄", accent: "#94a3b8" },
] as const;

type Phase = "welcome" | "builder" | "generating";

export default function WizardPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [data, setData] = useState<LPData>(defaultContent);
  const [layouts, setLayouts] = useState<SectionLayouts>({ ...DEFAULT_SECTION_LAYOUTS });
  const [activeKey, setActiveKey] = useState<SectionKey>("s2");
  const [confirmedSections, setConfirmedSections] = useState<SectionKey[]>([]);
  const [newlyConfirmedKey, setNewlyConfirmedKey] = useState<SectionKey | null>(null);
  const [previewAnimKey, setPreviewAnimKey] = useState(0);
  const [previewMode, setPreviewMode] = useState<"current" | "stack">("current");

  const formRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const activeStep = STEPS.find((s) => s.key === activeKey)!;
  const currentLayout = layouts[activeKey] as LayoutIndex;
  const isConfirmed = confirmedSections.includes(activeKey);

  // プレビューに表示する順序（LP の正規順で確定済みのみ）
  const orderedConfirmed = DEFAULT_SECTION_ORDER.filter((k) => confirmedSections.includes(k));

  const handleSelectSection = (key: SectionKey) => {
    setActiveKey(key);
    setPreviewAnimKey((k) => k + 1);
    formRef.current?.scrollTo({ top: 0, behavior: "instant" });
    // ナビのチップをスクロールして見せる
    const chipEl = navRef.current?.querySelector<HTMLElement>(`[data-key="${key}"]`);
    chipEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const handleConfirm = () => {
    if (!isConfirmed) {
      setConfirmedSections((prev) => [...prev, activeKey]);
      setNewlyConfirmedKey(activeKey);
      setPreviewMode("stack"); // 確定したら積み上がりを表示
      setTimeout(() => setNewlyConfirmedKey(null), 700);
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
    setTimeout(() => router.push("/editor"), 1800);
  };

  const renderForm = () => {
    switch (activeKey) {
      case "s1":  return <S1HeaderForm    data={data.s1}  onChange={(s1)  => setData({ ...data, s1  })} />;
      case "s2":  return <S2HeroForm      data={data.s2}  onChange={(s2)  => setData({ ...data, s2  })} />;
      case "s3":  return <S3MessageForm   data={data.s3}  onChange={(s3)  => setData({ ...data, s3  })} />;
      case "s4":  return <S4ProblemsForm  data={data.s4}  onChange={(s4)  => setData({ ...data, s4  })} />;
      case "s5":  return <S5FeaturesForm  data={data.s5}  onChange={(s5)  => setData({ ...data, s5  })} />;
      case "s6":  return <S6CategoriesForm data={data.s6} onChange={(s6)  => setData({ ...data, s6  })} />;
      case "s7":  return <S7CaseStudiesForm data={data.s7} onChange={(s7) => setData({ ...data, s7  })} />;
      case "s8":  return <S8FlowForm      data={data.s8}  onChange={(s8)  => setData({ ...data, s8  })} />;
      case "s9":  return <S9FormFaqForm   data={data.s9}  onChange={(s9)  => setData({ ...data, s9  })} />;
      case "s10": return <S10ClosingForm  data={data.s10} onChange={(s10) => setData({ ...data, s10 })} />;
      case "s11": return <S11FooterForm   data={data.s11} onChange={(s11) => setData({ ...data, s11 })} />;
    }
  };

  // ── ウェルカム画面 ──────────────────────────────────────
  if (phase === "welcome") {
    return (
      <div className="mesh-bg min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-blue-500/30">
              LP
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            LP生成ウィザード
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-2">
            質問に答えるだけで、toB向けLPが完成します。
          </p>
          <p className="text-slate-500 text-sm leading-relaxed mb-10">
            好きなセクションから自由に入力できます。<br />
            確定したセクションからプレビューに積み上がっていきます。<br />
            サンプルが入力済みなので、気になる部分だけ変更すればOK。
          </p>

          <div className="glass rounded-2xl p-6 mb-8 text-left">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">入力するセクション</p>
            <div className="grid grid-cols-2 gap-2">
              {STEPS.map((s) => (
                <div key={s.key} className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-slate-600 w-6 flex-shrink-0">{s.id}</span>
                  <span className="text-sm text-slate-300">{s.emoji} {s.title}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setPhase("builder")}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 text-white text-lg font-bold transition-all duration-200 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            はじめる →
          </button>
          <button
            onClick={() => router.push("/editor")}
            className="mt-3 w-full py-3 rounded-xl text-slate-500 hover:text-slate-300 text-sm transition-colors duration-150"
          >
            スキップしてエディタへ進む
          </button>
        </div>
      </div>
    );
  }

  // ── 生成中 ──────────────────────────────────────────────
  if (phase === "generating") {
    return (
      <div className="mesh-bg min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Sora, sans-serif" }}>
            LPを生成しています...
          </h2>
          <p className="text-slate-400 text-sm">エディタを準備中です。少々お待ちください。</p>
        </div>
      </div>
    );
  }

  // ── ビルダー画面（自由選択式） ────────────────────────────
  return (
    <div className="mesh-bg h-screen flex flex-col overflow-hidden">

      {/* ── トップバー ─────────────────────────────── */}
      <div
        className="flex-shrink-0 z-10 flex items-center justify-between px-5 py-2.5"
        style={{ background: "rgba(15,15,26,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-xs font-bold text-white">
            LP
          </div>
          <span className="font-semibold text-white text-sm" style={{ fontFamily: "Sora, sans-serif" }}>
            LP生成ウィザード
          </span>
        </div>

        {/* 進捗 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => {
              const done = confirmedSections.includes(s.key);
              return (
                <div
                  key={s.key}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: 6, height: 6,
                    background: done ? "#34d399" : "rgba(255,255,255,0.12)",
                    boxShadow: done ? "0 0 4px rgba(52,211,153,0.6)" : "none",
                  }}
                />
              );
            })}
          </div>
          <span className="text-xs font-mono text-slate-500">
            {confirmedSections.length} / 11
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/editor")}
            className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 text-xs transition-colors duration-150"
          >
            スキップ
          </button>
          <button
            onClick={generate}
            disabled={confirmedSections.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-bold transition-all duration-200 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: confirmedSections.length > 0
                ? "linear-gradient(135deg, #3b82f6, #10b981)"
                : "rgba(255,255,255,0.1)",
            }}
          >
            ✨ LPを生成
          </button>
        </div>
      </div>

      {/* ── 本体: 左パネル + 右プレビュー ──────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* 左パネル */}
        <div
          className="flex-shrink-0 flex flex-col overflow-hidden"
          style={{ width: 480, borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* セクションナビゲーター */}
          <div
            ref={navRef}
            className="flex-shrink-0 flex gap-1.5 overflow-x-auto px-3 py-2.5"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {STEPS.map((s) => {
              const done = confirmedSections.includes(s.key);
              const active = activeKey === s.key;
              return (
                <button
                  key={s.key}
                  data-key={s.key}
                  onClick={() => handleSelectSection(s.key)}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                  style={{
                    background: active
                      ? `${s.accent}22`
                      : done
                        ? "rgba(52,211,153,0.1)"
                        : "rgba(255,255,255,0.04)",
                    color: active
                      ? s.accent
                      : done
                        ? "#34d399"
                        : "rgba(255,255,255,0.35)",
                    border: `1px solid ${active ? `${s.accent}44` : done ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {done && (
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span>{s.emoji}</span>
                  <span>{s.id}</span>
                </button>
              );
            })}
          </div>

          {/* フォームエリア（スクロール） */}
          <div ref={formRef} className="flex-1 overflow-y-auto p-5">
            {/* セクションヘッダー */}
            <div className="fade-in mb-5" key={`hdr-${activeKey}`} style={{ animationDuration: "0.2s" }}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full border"
                  style={{
                    background: `${activeStep.accent}20`,
                    color: activeStep.accent,
                    borderColor: `${activeStep.accent}40`,
                  }}
                >
                  {activeStep.emoji} {activeStep.id} · {activeStep.subtitle}
                </span>
                {isConfirmed && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    確定済み
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mb-1.5" style={{ fontFamily: "Sora, sans-serif" }}>
                {activeStep.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">{activeStep.description}</p>
            </div>

            {/* レイアウトピッカー */}
            <div
              className="fade-in glass rounded-xl p-4 mb-4"
              key={`lp-${activeKey}`}
              style={{ animationDuration: "0.25s", animationDelay: "0.04s", animationFillMode: "both" }}
            >
              <LayoutPicker
                sectionKey={activeKey}
                value={currentLayout}
                onChange={(idx) => {
                  setLayouts({ ...layouts, [activeKey]: idx });
                  setPreviewAnimKey((k) => k + 1);
                }}
              />
            </div>

            {/* コンテンツフォーム */}
            <div
              className="fade-in glass rounded-xl p-5"
              key={`form-${activeKey}`}
              style={{ animationDuration: "0.3s", animationDelay: "0.08s", animationFillMode: "both" }}
            >
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">コンテンツ入力</p>
              {renderForm()}
            </div>
          </div>

          {/* 確定ボタンエリア */}
          <div
            className="flex-shrink-0 px-5 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)" }}
          >
            {isConfirmed ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  プレビューに追加済み
                </div>
                <button
                  onClick={() => handleUnconfirm(activeKey)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-all duration-150"
                >
                  取り消す
                </button>
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${activeStep.accent}, #2563eb)`,
                  boxShadow: `0 4px 20px ${activeStep.accent}30`,
                }}
              >
                このセクションをプレビューに追加
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 右パネル: プレビュー（現在 / 積み上がり 切替） */}
        <div className="flex-1 overflow-hidden flex flex-col min-w-0">
          {/* プレビューヘッダー */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-3 py-2"
            style={{
              background: "rgba(15,15,26,0.6)",
              backdropFilter: "blur(8px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* モード切替タブ */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setPreviewMode("current"); setPreviewAnimKey((k) => k + 1); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                style={
                  previewMode === "current"
                    ? { background: `${activeStep.accent}22`, color: activeStep.accent, border: `1px solid ${activeStep.accent}44` }
                    : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid transparent" }
                }
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: previewMode === "current" ? activeStep.accent : "rgba(255,255,255,0.3)" }} />
                現在のセクション
              </button>
              <button
                onClick={() => setPreviewMode("stack")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                style={
                  previewMode === "stack"
                    ? { background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }
                    : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid transparent" }
                }
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: previewMode === "stack" ? "#34d399" : "rgba(255,255,255,0.3)" }} />
                積み上がり
                {orderedConfirmed.length > 0 && (
                  <span
                    className="text-xs font-bold px-1.5 rounded-full"
                    style={{ background: "rgba(52,211,153,0.2)", color: "#34d399" }}
                  >
                    {orderedConfirmed.length}
                  </span>
                )}
              </button>
            </div>

            {/* 現在モード時: セクション名とレイアウトラベル */}
            {previewMode === "current" && (
              <span className="text-xs text-slate-500 flex-shrink-0">
                {activeStep.emoji} {activeStep.id} &nbsp;—&nbsp; レイアウト <span style={{ color: activeStep.accent }}>{["A", "B", "C"][currentLayout]}</span>
              </span>
            )}
          </div>

          {/* プレビュー本体 */}
          <div className="flex-1 overflow-y-auto" style={{ background: "#e5e7eb" }}>

            {/* ── 現在のセクションプレビュー ── */}
            {previewMode === "current" && (
              <div
                style={{
                  maxWidth: 900, margin: "20px auto",
                  borderRadius: 6, overflow: "hidden",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                }}
              >
                <div key={previewAnimKey} className="layout-switch lp-preview-root">
                  {renderSection(activeKey, data, currentLayout)}
                </div>
              </div>
            )}

            {/* ── 確定済みスタック ── */}
            {previewMode === "stack" && (
              orderedConfirmed.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-400 mb-1">まだ確定済みセクションがありません</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      左パネルの「プレビューに追加」を押すと<br />ここに積み上がっていきます
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    maxWidth: 900, margin: "20px auto",
                    borderRadius: 6, overflow: "hidden",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="lp-preview-root">
                    {orderedConfirmed.map((key) => (
                      <div key={key} className={newlyConfirmedKey === key ? "stack-in" : ""}>
                        {renderSection(key, data, layouts[key] as LayoutIndex)}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
