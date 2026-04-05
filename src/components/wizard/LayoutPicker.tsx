"use client";

import { useState } from "react";
import type { SectionKey, LayoutIndex } from "@/lib/types";
import { SECTION_LAYOUTS, FILL_COLORS, type ThumbnailBlock } from "@/lib/sectionLayouts";

interface Props {
  sectionKey: SectionKey;
  value: LayoutIndex;
  onChange: (layout: LayoutIndex) => void;
}

function Thumbnail({ blocks }: { blocks: ThumbnailBlock[] }) {
  return (
    <svg viewBox="0 0 100 65" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block" }}>
      {blocks.map(([x, y, w, h, fill, rx = 0], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          fill={FILL_COLORS[fill]}
          rx={rx}
        />
      ))}
    </svg>
  );
}

const LABELS = ["A", "B", "C"] as const;

export default function LayoutPicker({ sectionKey, value, onChange }: Props) {
  const patterns = SECTION_LAYOUTS[sectionKey];
  const [poppingIdx, setPoppingIdx] = useState<number | null>(null);

  const handleSelect = (idx: LayoutIndex) => {
    if (idx === value) return;
    setPoppingIdx(idx);
    onChange(idx);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">レイアウトパターン</p>
      <div className="grid grid-cols-3 gap-2">
        {patterns.map((pattern, i) => {
          const idx = i as LayoutIndex;
          const isSelected = value === idx;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`flex flex-col gap-1.5 rounded-xl overflow-hidden text-left focus:outline-none ${poppingIdx === i ? "layout-pop" : ""}`}
              onAnimationEnd={() => setPoppingIdx(null)}
              style={{
                border: isSelected ? "2px solid #60a5fa" : "2px solid rgba(255,255,255,0.08)",
                background: isSelected ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.03)",
                boxShadow: isSelected ? "0 0 0 1px rgba(96,165,250,0.3), 0 0 12px rgba(96,165,250,0.15)" : "none",
                transition: "border-color 200ms ease, background 200ms ease, box-shadow 200ms ease",
              }}
            >
              {/* サムネイル */}
              <div style={{ padding: "6px 6px 0" }}>
                <div style={{ borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Thumbnail blocks={pattern.blocks} />
                </div>
              </div>

              {/* ラベル */}
              <div style={{ padding: "4px 8px 8px" }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="text-xs font-bold px-1.5 rounded"
                    style={{
                      background: isSelected ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.08)",
                      color: isSelected ? "#93c5fd" : "rgba(255,255,255,0.4)",
                      transition: "background 200ms ease, color 200ms ease",
                    }}
                  >
                    {LABELS[i]}
                  </span>
                  <span
                    className="text-xs font-semibold truncate"
                    style={{
                      color: isSelected ? "#e2e8f0" : "rgba(255,255,255,0.5)",
                      transition: "color 200ms ease",
                    }}
                  >
                    {pattern.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)", margin: 0, fontSize: 10 }}>
                  {pattern.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
