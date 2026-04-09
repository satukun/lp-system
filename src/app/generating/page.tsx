"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SectionKey } from "@/lib/types";
import { DEFAULT_SECTION_ORDER } from "@/lib/types";
import {
  IconCheck, IconForm, IconMarkdown, IconAI, SECTION_ICONS,
} from "@/components/ui/Icons";

const WIZARD_CONFIRMED_KEY = "lp_wizard_confirmed";

const SECTION_META: Record<SectionKey, { id: string; title: string }> = {
  s1:  { id: "S1",  title: "ナビゲーション" },
  s2:  { id: "S2",  title: "ファーストビュー" },
  s3:  { id: "S3",  title: "メッセージ" },
  s4:  { id: "S4",  title: "課題定義" },
  s5:  { id: "S5",  title: "特徴・強み" },
  s6:  { id: "S6",  title: "カテゴリ" },
  s7:  { id: "S7",  title: "導入事例" },
  s8:  { id: "S8",  title: "導入フロー" },
  s9:  { id: "S9",  title: "フォーム・FAQ" },
  s10: { id: "S10", title: "最終CTA" },
  s11: { id: "S11", title: "フッター" },
};

export default function GeneratingPage() {
  const router = useRouter();
  const [confirmedSections, setConfirmedSections] = useState<SectionKey[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [flowStep,     setFlowStep]     = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WIZARD_CONFIRMED_KEY);
      if (raw) setConfirmedSections(JSON.parse(raw) as SectionKey[]);
    } catch { /* ignore */ }

    const t1 = setTimeout(() => setFlowStep(1), 1600);
    const t2 = setTimeout(() => setFlowStep(2), 3200);
    const t3 = setTimeout(() => router.push("/complete"), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [router]);

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

  const orderedSteps = DEFAULT_SECTION_ORDER
    .filter((k) => confirmedSections.includes(k))
    .map((k) => ({ key: k, ...SECTION_META[k] }));

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
