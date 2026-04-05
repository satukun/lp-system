"use client";

import { useState, useRef } from "react";
import type { LPData, SectionKey } from "@/lib/types";
import SectionCard from "@/components/ui/SectionCard";
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
}

const SECTION_META: Record<SectionKey, { id: string; title: string; badge: string }> = {
  s1:  { id: "S1",  title: "Header",                badge: "固定" },
  s2:  { id: "S2",  title: "Hero & Trust Badges",   badge: "可変" },
  s3:  { id: "S3",  title: "Message",               badge: "可変" },
  s4:  { id: "S4",  title: "Problem Identification", badge: "可変" },
  s5:  { id: "S5",  title: "Features & Benefits",   badge: "可変" },
  s6:  { id: "S6",  title: "Categories",            badge: "可変" },
  s7:  { id: "S7",  title: "Case Studies",          badge: "可変" },
  s8:  { id: "S8",  title: "Implementation Flow",   badge: "可変" },
  s9:  { id: "S9",  title: "Lead Form & FAQ",       badge: "可変" },
  s10: { id: "S10", title: "Closing Message",       badge: "可変" },
  s11: { id: "S11", title: "Footer",                badge: "固定" },
};

export default function EditorPanel({ data, onChange, sectionOrder, onReorder, hiddenSections, onToggleHidden }: Props) {
  const [dragOverKey, setDragOverKey] = useState<SectionKey | null>(null);
  const draggingKey = useRef<SectionKey | null>(null);

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
    if (!from || from === targetKey) {
      setDragOverKey(null);
      return;
    }
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
    <div className="flex flex-col gap-2 p-4">
      <div className="mb-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">セクション編集</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          ☰ をドラッグして並び替え／タイトルをクリックして展開
        </p>
      </div>

      {sectionOrder.map((key) => {
        const meta = SECTION_META[key];
        return (
          <div key={key} onDragEnd={handleDragEnd}>
            <SectionCard
              sectionId={meta.id}
              title={meta.title}
              badge={meta.badge}
              defaultOpen={key === "s2"}
              hidden={hiddenSections.includes(key)}
              onToggleHidden={() => onToggleHidden(key)}
              draggable
              onDragStart={handleDragStart(key)}
              onDragOver={handleDragOver(key)}
              onDrop={handleDrop(key)}
              isDragOver={dragOverKey === key}
            >
              {renderForm(key)}
            </SectionCard>
          </div>
        );
      })}
    </div>
  );
}
