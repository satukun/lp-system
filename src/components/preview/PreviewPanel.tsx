"use client";

import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import type { LPData, SectionKey, SectionLayouts } from "@/lib/types";
import { renderSection } from "./SectionRenderer";

interface Props {
  data: LPData;
  isUpdating: boolean;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  sectionLayouts: SectionLayouts;
}

export interface PreviewPanelHandle {
  scrollToSection: (key: SectionKey) => void;
}

type DeviceType = "pc" | "tablet" | "sp";

const DEVICES: { key: DeviceType; label: string; width: number | null; icon: React.ReactNode }[] = [
  {
    key: "pc", label: "PC", width: null,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeWidth={1.8} d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    key: "tablet", label: "Tablet", width: 768,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth={1.8} />
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "sp", label: "SP", width: 390,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="2" width="12" height="20" rx="2" strokeWidth={1.8} />
        <circle cx="12" cy="18.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const PreviewPanel = forwardRef<PreviewPanelHandle, Props>(function PreviewPanel(
  { data, isUpdating, sectionOrder, hiddenSections, sectionLayouts },
  ref
) {
  const [device, setDevice] = useState<DeviceType>("pc");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentDevice = DEVICES.find((d) => d.key === device)!;
  const deviceWidth = currentDevice.width;

  useImperativeHandle(ref, () => ({
    scrollToSection: (key: SectionKey) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const el = container.querySelector<HTMLElement>(`#preview-section-${key}`);
      if (!el) return;
      const containerTop = container.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      const offset = elTop - containerTop + container.scrollTop - 16;
      container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
    },
  }));

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* デバイス切替 */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-1">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDevice(d.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
              style={
                device === d.key
                  ? { background: "rgba(96,165,250,0.2)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.35)" }
                  : { background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }
              }
            >
              {d.icon}
              {d.label}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
          {deviceWidth ? `${deviceWidth}px` : "100%"}
        </span>
      </div>

      {/* プレビューエリア */}
      <div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-auto"
        style={{ background: deviceWidth ? "#e5e7eb" : "transparent" }}
      >
        {isUpdating && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-blue-600/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              更新中
            </div>
          </div>
        )}

        <div
          style={
            deviceWidth
              ? {
                  width: deviceWidth, margin: "16px auto",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.25)",
                  borderRadius: 4, overflow: "hidden",
                  minHeight: "calc(100% - 32px)",
                }
              : { width: "100%", height: "100%" }
          }
        >
          <div className={`lp-preview-root transition-opacity duration-300 ${isUpdating ? "opacity-70" : "opacity-100"}`}>
            {sectionOrder
              .filter((key) => !hiddenSections.includes(key))
              .map((key) => (
                <div key={key} id={`preview-section-${key}`}>
                  {renderSection(key, data, sectionLayouts[key])}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default PreviewPanel;
