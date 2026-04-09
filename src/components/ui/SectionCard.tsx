"use client";

import { useState } from "react";

interface SectionCardProps {
  sectionId: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  hidden?: boolean;
  onToggleHidden?: () => void;
  onOpen?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragOver?: boolean;
  layoutLabel?: string;
}

export default function SectionCard({
  sectionId, title, children,
  defaultOpen = false, hidden = false, onToggleHidden, onOpen,
  draggable = false, onDragStart, onDragOver, onDrop,
  isDragOver = false, layoutLabel,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        background: "var(--col-bg)",
        border: isDragOver ? "1px solid rgba(55,53,47,0.4)" : "1px solid var(--col-border)",
        borderRadius: 8,
        overflow: "hidden",
        opacity: hidden ? 0.5 : 1,
        transition: "border-color 150ms, opacity 150ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* ドラッグハンドル */}
        {draggable && (
          <div
            style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 8px", alignSelf: "stretch", cursor: "grab", color: "var(--col-text-3)" }}
            title="ドラッグして並び替え"
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
              <circle cx="3" cy="3" r="1.5" />
              <circle cx="7" cy="3" r="1.5" />
              <circle cx="3" cy="8" r="1.5" />
              <circle cx="7" cy="8" r="1.5" />
              <circle cx="3" cy="13" r="1.5" />
              <circle cx="7" cy="13" r="1.5" />
            </svg>
          </div>
        )}

        {/* アコーディオントグル */}
        <button
          onClick={() => {
            const next = !open;
            setOpen(next);
            if (next) onOpen?.();
          }}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", background: "transparent", border: "none", cursor: "pointer",
            textAlign: "left",
          }}
          aria-expanded={open}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
              background: "var(--col-surface-2)", border: "1px solid var(--col-border)",
              color: "var(--col-text-2)",
            }}>
              {sectionId}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: hidden ? "var(--col-text-3)" : "var(--col-text)", textDecoration: hidden ? "line-through" : "none" }}>
              {title}
            </span>
            {hidden && (
              <span style={{ fontSize: 11, color: "var(--col-text-3)", background: "var(--col-surface-2)", padding: "1px 7px", borderRadius: 4 }}>
                非表示
              </span>
            )}
            {layoutLabel && !hidden && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--col-success)", background: "var(--col-success-bg)", border: "1px solid var(--col-success-bd)", padding: "1px 6px", borderRadius: 4 }}>
                {layoutLabel}
              </span>
            )}
          </div>
          <svg
            style={{ width: 14, height: 14, color: "var(--col-text-3)", transition: "transform 200ms", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 表示/非表示 */}
        {onToggleHidden && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleHidden(); }}
            style={{ flexShrink: 0, padding: "0 12px", alignSelf: "stretch", display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--col-text-3)", borderLeft: "1px solid var(--col-border)" }}
            title={hidden ? "セクションを表示" : "セクションを非表示"}
          >
            {hidden ? (
              <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* アコーディオン本体 */}
      <div style={{
        display: "grid",
        gridTemplateRows: (open && !hidden) ? "1fr" : "0fr",
        transition: "grid-template-rows 280ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{
            padding: "12px 16px 16px",
            borderTop: "1px solid var(--col-border)",
            opacity: (open && !hidden) ? 1 : 0,
            transform: (open && !hidden) ? "translateY(0)" : "translateY(-4px)",
            transition: "opacity 220ms ease, transform 220ms ease",
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
