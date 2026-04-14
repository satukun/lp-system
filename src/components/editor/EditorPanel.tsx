"use client";

import { useState, useRef, useCallback } from "react";
import type { LPData, SectionKey, SectionLayouts, LayoutIndex } from "@/lib/types";
import SectionCard from "@/components/ui/SectionCard";
import LayoutPicker from "@/components/wizard/LayoutPicker";
import S1HeaderForm from "./sections/S1HeaderForm";
import S2HeroForm from "./sections/S2HeroForm";
import S3MessageForm from "./sections/S3MessageForm";
import S4ProblemsForm from "./sections/S4ProblemsForm";
import S5FeaturesForm from "./sections/S5FeaturesForm";
import S6CategoriesForm from "./sections/S6CategoriesForm";
import S7CaseStudiesForm from "./sections/S7CaseStudiesForm";
import S8FlowForm from "./sections/S8FlowForm";
import S9FormFaqForm from "./sections/S9FormFaqForm";
import S10ClosingForm from "./sections/S10ClosingForm";
import S11FooterForm from "./sections/S11FooterForm";

interface Props {
  data: LPData;
  onChange: (data: LPData) => void;
  sectionOrder: SectionKey[];
  onReorder: (order: SectionKey[]) => void;
  hiddenSections: SectionKey[];
  onToggleHidden: (key: SectionKey) => void;
  sectionLayouts: SectionLayouts;
  onChangeLayout: (key: SectionKey, layout: LayoutIndex) => void;
  confirmedSections: SectionKey[];
  onToggleConfirmed: (key: SectionKey) => void;
  onSectionOpen?: (key: SectionKey) => void;
  onCollapse?: () => void;
}

const SECTION_META: Record<SectionKey, { id: string; title: string }> = {
  s1:  { id: "S1",  title: "Header" },
  s2:  { id: "S2",  title: "Hero & Trust Badges" },
  s3:  { id: "S3",  title: "Message" },
  s4:  { id: "S4",  title: "Problem Identification" },
  s5:  { id: "S5",  title: "Features & Benefits" },
  s6:  { id: "S6",  title: "Categories" },
  s7:  { id: "S7",  title: "Case Studies" },
  s8:  { id: "S8",  title: "Implementation Flow" },
  s9:  { id: "S9",  title: "Lead Form & FAQ" },
  s10: { id: "S10", title: "Closing Message" },
  s11: { id: "S11", title: "Footer" },
};

const LAYOUT_LABELS = ["A", "B", "C", "D"] as const;

export default function EditorPanel({
  data, onChange, sectionOrder, onReorder,
  hiddenSections, onToggleHidden,
  sectionLayouts, onChangeLayout,
  confirmedSections, onToggleConfirmed,
  onSectionOpen, onCollapse,
}: Props) {
  const [dragOverKey, setDragOverKey] = useState<SectionKey | null>(null);
  const [flashKey,    setFlashKey]    = useState<SectionKey | null>(null);
  const draggingKey = useRef<SectionKey | null>(null);

  const handleConfirmClick = useCallback((key: SectionKey) => {
    onToggleConfirmed(key);
    if (confirmedSections.includes(key)) return; // 追加時のみフラッシュ
    setFlashKey(key);
    setTimeout(() => setFlashKey(null), 900);
  }, [confirmedSections, onToggleConfirmed]);

  const handleDragStart = (key: SectionKey) => (e: React.DragEvent) => {
    draggingKey.current = key;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (key: SectionKey) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (key !== draggingKey.current) setDragOverKey(key);
  };

  const handleDrop = (targetKey: SectionKey) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = draggingKey.current;
    if (!from || from === targetKey) { setDragOverKey(null); return; }
    const newOrder = [...sectionOrder];
    const fromIdx = newOrder.indexOf(from);
    const toIdx = newOrder.indexOf(targetKey);
    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, from);
    onReorder(newOrder);
    draggingKey.current = null;
    setDragOverKey(null);
  };

  const handleDragEnd = () => {
    draggingKey.current = null;
    setDragOverKey(null);
  };

  const renderForm = (key: SectionKey) => {
    switch (key) {
      case "s1":  return <S1HeaderForm  data={data.s1}  onChange={(s1)  => onChange({ ...data, s1  })} />;
      case "s2":  return <S2HeroForm    data={data.s2}  onChange={(s2)  => onChange({ ...data, s2  })} />;
      case "s3":  return <S3MessageForm data={data.s3}  onChange={(s3)  => onChange({ ...data, s3  })} />;
      case "s4":  return <S4ProblemsForm data={data.s4} onChange={(s4)  => onChange({ ...data, s4  })} />;
      case "s5":  return <S5FeaturesForm data={data.s5} onChange={(s5)  => onChange({ ...data, s5  })} />;
      case "s6":  return <S6CategoriesForm data={data.s6} onChange={(s6) => onChange({ ...data, s6 })} />;
      case "s7":  return <S7CaseStudiesForm data={data.s7} onChange={(s7) => onChange({ ...data, s7 })} />;
      case "s8":  return <S8FlowForm    data={data.s8}  onChange={(s8)  => onChange({ ...data, s8  })} />;
      case "s9":  return <S9FormFaqForm data={data.s9}  onChange={(s9)  => onChange({ ...data, s9  })} />;
      case "s10": return <S10ClosingForm data={data.s10} onChange={(s10) => onChange({ ...data, s10 })} />;
      case "s11": return <S11FooterForm data={data.s11} onChange={(s11) => onChange({ ...data, s11 })} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <h2 style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>セクション編集</h2>
          <p style={{ fontSize: 11, color: "var(--col-text-3)", marginTop: 3, marginBottom: 0 }}>ドラッグで並び替え · タイトルクリックで展開</p>
        </div>
        {onCollapse && (
          <button
            onClick={onCollapse}
            title="パネルを閉じる"
            style={{ flexShrink: 0, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 5, background: "transparent", border: "none", cursor: "pointer", color: "var(--col-text-3)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-surface-2)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--col-text-3)"; }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {sectionOrder.map((key) => {
        const meta = SECTION_META[key];
        const currentLayoutIdx = sectionLayouts[key] as LayoutIndex;
        return (
          <div key={key} onDragEnd={handleDragEnd}>
            <SectionCard
              sectionId={meta.id}
              title={meta.title}
              defaultOpen={key === "s2"}
              hidden={hiddenSections.includes(key)}
              onToggleHidden={() => onToggleHidden(key)}
              onOpen={() => onSectionOpen?.(key)}
              draggable
              onDragStart={handleDragStart(key)}
              onDragOver={handleDragOver(key)}
              onDrop={handleDrop(key)}
              isDragOver={dragOverKey === key}
              layoutLabel={LAYOUT_LABELS[currentLayoutIdx]}
            >
              {/* レイアウトピッカー */}
              <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--col-border)" }}>
                <LayoutPicker
                  sectionKey={key}
                  value={currentLayoutIdx}
                  onChange={(layout) => onChangeLayout(key, layout)}
                />
              </div>

              {/* コンテンツフォーム */}
              {renderForm(key)}

              {/* 確定/追加ボタン */}
              <div style={{
                marginTop: 16, paddingTop: 12,
                borderTop: "1px solid var(--col-border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                {confirmedSections.includes(key) ? (
                  <>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 12, fontWeight: 600, color: "var(--col-success)",
                      padding: "4px 10px", borderRadius: 6,
                      background: flashKey === key ? "var(--col-success-bg)" : "transparent",
                      border: `1px solid ${flashKey === key ? "var(--col-success-bd)" : "transparent"}`,
                      transition: "all 0.3s",
                    }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                      確定済み
                    </div>
                    <button
                      onClick={() => onToggleConfirmed(key)}
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
                  </>
                ) : (
                  <button
                    onClick={() => handleConfirmClick(key)}
                    style={{
                      padding: "6px 16px", borderRadius: 6,
                      background: "var(--col-text)", color: "var(--col-bg)",
                      fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 5,
                      transition: "opacity 0.15s", marginLeft: "auto",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2v8M2 6h8" />
                    </svg>
                    追加
                  </button>
                )}
              </div>
            </SectionCard>
          </div>
        );
      })}
    </div>
  );
}
