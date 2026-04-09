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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
        レイアウトパターン
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
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
                borderRadius: 8, overflow: "hidden", textAlign: "left",
                border: isSelected ? "2px solid var(--col-action)" : "2px solid var(--col-border-2)",
                background: isSelected ? "var(--col-surface-2)" : "var(--col-surface)",
                cursor: "pointer", padding: 0,
                transition: "border-color 200ms ease, background 200ms ease",
              }}
            >
              {/* サムネイル */}
              <div style={{ padding: "6px 6px 0" }}>
                <div style={{ borderRadius: 4, overflow: "hidden", border: "1px solid var(--col-border)" }}>
                  <Thumbnail blocks={pattern.blocks} />
                </div>
              </div>
              {/* ラベル */}
              <div style={{ padding: "4px 8px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                    background: isSelected ? "var(--col-surface-3)" : "var(--col-surface-2)",
                    color: isSelected ? "var(--col-text)" : "var(--col-text-2)",
                    transition: "background 200ms ease, color 200ms ease",
                  }}>
                    {LABELS[i]}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: isSelected ? "var(--col-text)" : "var(--col-text-2)",
                    transition: "color 200ms ease", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                  }}>
                    {pattern.label}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: "var(--col-text-3)", margin: 0, lineHeight: 1.5 }}>
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
