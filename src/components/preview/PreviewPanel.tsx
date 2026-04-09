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

const SECTION_LABELS: Record<SectionKey, string> = {
  s1:  "S1 Header",
  s2:  "S2 Hero",
  s3:  "S3 Message",
  s4:  "S4 Problems",
  s5:  "S5 Features",
  s6:  "S6 Categories",
  s7:  "S7 Case Studies",
  s8:  "S8 Flow",
  s9:  "S9 Form & FAQ",
  s10: "S10 Closing",
  s11: "S11 Footer",
};

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
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 14px", background: "var(--col-bg)", borderBottom: "1px solid var(--col-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {DEVICES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDevice(d.key)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                cursor: "pointer", transition: "all 150ms",
                ...(device === d.key
                  ? { background: "var(--col-surface-3)", color: "var(--col-text)", border: "1px solid var(--col-border-2)" }
                  : { background: "transparent", color: "var(--col-text-3)", border: "1px solid transparent" }),
              }}
            >
              {d.icon}
              {d.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--col-text-3)" }}>
          {deviceWidth ? `${deviceWidth}px` : "100%"}
        </span>
      </div>

      {/* プレビューエリア */}
      <div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-auto"
        style={{ background: deviceWidth ? "var(--col-surface-2)" : "var(--col-bg)" }}
      >
        {isUpdating && (
          <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--col-action)", opacity: 0.4 }} className="shimmer" />
            <div style={{
              position: "absolute", top: 10, right: 10,
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--col-surface)", border: "1px solid var(--col-border-2)",
              color: "var(--col-text-2)", fontSize: 11, padding: "5px 10px", borderRadius: 20,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>
              <svg style={{ width: 10, height: 10 }} className="animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
                <div key={key} id={`preview-section-${key}`} style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", top: 8, left: 8, zIndex: 10,
                    fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                    padding: "2px 7px", borderRadius: 4,
                    background: "rgba(55,53,47,0.75)", color: "#fff",
                    pointerEvents: "none", letterSpacing: "0.04em",
                  }}>
                    {SECTION_LABELS[key]}
                  </div>
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
