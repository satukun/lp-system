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
        <rect key={i} x={x} y={y} width={w} height={h} fill={FILL_COLORS[fill]} rx={rx} />
      ))}
    </svg>
  );
}

const LABELS = ["A", "B", "C", "D"] as const;

export default function LayoutPicker({ sectionKey, value, onChange }: Props) {
  const patterns = SECTION_LAYOUTS[sectionKey];
  const [poppingIdx, setPoppingIdx] = useState<number | null>(null);

  const handleSelect = (idx: LayoutIndex) => {
    if (idx === value) return;
    setPoppingIdx(idx);
    onChange(idx);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 11, fontWeight: 500, color: "var(--col-text-3)", letterSpacing: "0.05em", margin: 0 }}>
        レイアウトパターン
      </p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(patterns.length, 3)}, 1fr)`, gap: 8 }}>
        {patterns.map((pattern, i) => {
          const idx = i as LayoutIndex;
          const isSelected = value === idx;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(idx)}
              className={poppingIdx === i ? "layout-pop" : ""}
              onAnimationEnd={() => setPoppingIdx(null)}
              style={{
                display: "flex", flexDirection: "column", gap: 6,
                borderRadius: 12, overflow: "hidden", textAlign: "left",
                background: isSelected ? "var(--col-surface-3)" : "var(--col-bg)",
                cursor: "pointer", padding: 0,
                boxShadow: isSelected
                  ? "rgba(0,0,0,0.4) 0px 0px 0px 1.5px, rgba(78,50,23,0.04) 0px 6px 16px"
                  : "var(--shadow-outline)",
                transition: "box-shadow 200ms ease, background 200ms ease",
              }}
            >
              {/* サムネイル */}
              <div style={{ padding: "7px 7px 0" }}>
                <div style={{ borderRadius: 6, overflow: "hidden", boxShadow: "var(--shadow-inset)" }}>
                  <Thumbnail blocks={pattern.blocks} />
                </div>
              </div>
              {/* ラベル */}
              <div style={{ padding: "5px 8px 9px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 9999,
                    background: isSelected ? "var(--col-action)" : "var(--col-surface)",
                    color: isSelected ? "#fff" : "var(--col-text-2)",
                    boxShadow: isSelected ? "none" : "var(--shadow-inset)",
                    transition: "background 200ms ease, color 200ms ease",
                  }}>
                    {LABELS[i]}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: isSelected ? "var(--col-text)" : "var(--col-text-2)",
                    transition: "color 200ms ease", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                    letterSpacing: "0.01em",
                  }}>
                    {pattern.label}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: "var(--col-text-3)", margin: 0, lineHeight: 1.5, letterSpacing: "0.01em" }}>
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
