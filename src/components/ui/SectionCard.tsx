"use client";

import { useState } from "react";

interface SectionCardProps {
  sectionId: string;
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  // 表示/非表示
  hidden?: boolean;
  onToggleHidden?: () => void;
  // ドラッグ用
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragOver?: boolean;
}

export default function SectionCard({
  sectionId,
  title,
  badge,
  children,
  defaultOpen = false,
  hidden = false,
  onToggleHidden,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver = false,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="glass rounded-xl overflow-hidden transition-all duration-150"
      style={{
        outline: isDragOver ? "2px solid rgba(96,165,250,0.6)" : "none",
        opacity: isDragOver ? 0.7 : hidden ? 0.45 : 1,
      }}
    >
      <div className="flex items-center">
        {/* ドラッグハンドル */}
        {draggable && (
          <div
            className="flex-shrink-0 flex flex-col items-center justify-center px-2 self-stretch cursor-grab active:cursor-grabbing"
            style={{ color: "rgba(255,255,255,0.25)" }}
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
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors duration-150"
          aria-expanded={open}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
              {sectionId}
            </span>
            <span className={`text-sm font-semibold ${hidden ? "text-slate-500 line-through" : "text-white"}`}>
              {title}
            </span>
            {badge && (
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-md">{badge}</span>
            )}
            {hidden && (
              <span className="text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md">非表示</span>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 目のアイコン（表示/非表示切り替え） */}
        {onToggleHidden && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleHidden(); }}
            className="flex-shrink-0 px-3 self-stretch flex items-center hover:bg-white/5 transition-colors duration-150"
            title={hidden ? "セクションを表示" : "セクションを非表示"}
          >
            {hidden ? (
              // 目を閉じるアイコン
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              // 目を開くアイコン
              <svg className="w-4 h-4 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {open && !hidden && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5 fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
