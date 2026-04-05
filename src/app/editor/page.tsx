"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultContent } from "@/lib/defaultContent";
import type { LPData, SectionKey, StockedLP, SectionLayouts, LayoutIndex } from "@/lib/types";
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_LAYOUTS } from "@/lib/types";
import EditorPanel from "@/components/editor/EditorPanel";
import PreviewPanel, { type PreviewPanelHandle } from "@/components/preview/PreviewPanel";
import StockPanel from "@/components/stock/StockPanel";
import { generateMarkdown } from "@/lib/markdownGenerator";

const MIN_EDITOR_WIDTH = 280;
const MAX_EDITOR_WIDTH_RATIO = 0.55;
const DEFAULT_EDITOR_WIDTH = 400;
const STOCK_PANEL_WIDTH = 260;
const WIZARD_DATA_KEY = "lp_wizard_data";
const WIZARD_LAYOUTS_KEY = "lp_wizard_layouts";
const WIZARD_CONFIRMED_KEY = "lp_wizard_confirmed";

export default function EditorPage() {
  const router = useRouter();

  const [lpData, setLpData] = useState<LPData>(defaultContent);
  const [previewData, setPreviewData] = useState<LPData>(defaultContent);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [editorWidth, setEditorWidth] = useState(DEFAULT_EDITOR_WIDTH);
  const [isDragging, setIsDragging] = useState(false);

  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(DEFAULT_SECTION_ORDER);
  const [previewOrder, setPreviewOrder] = useState<SectionKey[]>(DEFAULT_SECTION_ORDER);

  const [hiddenSections, setHiddenSections] = useState<SectionKey[]>([]);
  const [previewHidden, setPreviewHidden] = useState<SectionKey[]>([]);

  const [sectionLayouts, setSectionLayouts] = useState<SectionLayouts>({ ...DEFAULT_SECTION_LAYOUTS });

  const [stocks, setStocks] = useState<StockedLP[]>([]);
  const [stockOpen, setStockOpen] = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(DEFAULT_EDITOR_WIDTH);
  const mainRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<PreviewPanelHandle>(null);

  // マウント後にwizardデータを読み込む
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawData      = localStorage.getItem(WIZARD_DATA_KEY);
      const rawLayouts   = localStorage.getItem(WIZARD_LAYOUTS_KEY);
      const rawConfirmed = localStorage.getItem(WIZARD_CONFIRMED_KEY);
      if (rawData) {
        const parsed = JSON.parse(rawData) as LPData;
        setLpData(parsed);
        setPreviewData(parsed);
        localStorage.removeItem(WIZARD_DATA_KEY);
      }
      if (rawLayouts) {
        const parsed = JSON.parse(rawLayouts) as SectionLayouts;
        setSectionLayouts(parsed);
        localStorage.removeItem(WIZARD_LAYOUTS_KEY);
      }
      if (rawConfirmed) {
        const confirmed = JSON.parse(rawConfirmed) as SectionKey[];
        // ウィザードで確定されなかったセクションを非表示にする
        const hidden = DEFAULT_SECTION_ORDER.filter((k) => !confirmed.includes(k));
        setHiddenSections(hidden);
        setPreviewHidden(hidden);
        localStorage.removeItem(WIZARD_CONFIRMED_KEY);
      }
    } catch { /* ignore */ }
    setInitialized(true);
  }, []);

  const handleChange = useCallback((updated: LPData) => {
    setLpData(updated);
    setIsUpdating(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewData(updated);
      setIsUpdating(false);
    }, 400);
  }, []);

  const handleReorder = useCallback((newOrder: SectionKey[]) => {
    setSectionOrder(newOrder);
    setIsUpdating(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewOrder(newOrder);
      setIsUpdating(false);
    }, 400);
  }, []);

  const handleToggleHidden = useCallback((key: SectionKey) => {
    const next = hiddenSections.includes(key)
      ? hiddenSections.filter((k) => k !== key)
      : [...hiddenSections, key];
    setHiddenSections(next);
    setIsUpdating(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewHidden(next);
      setIsUpdating(false);
    }, 400);
  }, [hiddenSections]);

  const handleChangeLayout = useCallback((key: SectionKey, layout: LayoutIndex) => {
    setSectionLayouts((prev) => ({ ...prev, [key]: layout }));
    // レイアウト変更時にプレビューの該当セクションへスクロール
    requestAnimationFrame(() => {
      previewRef.current?.scrollToSection(key);
    });
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = editorWidth;
    setIsDragging(true);
  }, [editorWidth]);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const stockWidth = stockOpen ? STOCK_PANEL_WIDTH + 6 : 0;
      const containerWidth = (mainRef.current?.offsetWidth ?? window.innerWidth) - stockWidth;
      const maxWidth = containerWidth * MAX_EDITOR_WIDTH_RATIO;
      const delta = e.clientX - dragStartXRef.current;
      const newWidth = Math.min(maxWidth, Math.max(MIN_EDITOR_WIDTH, dragStartWidthRef.current + delta));
      setEditorWidth(newWidth);
    };
    const onMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, stockOpen]);

  const handleDownloadMd = () => {
    const md = generateMarkdown(lpData);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content-source.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveStock = useCallback((name: string) => {
    const newStock: StockedLP = {
      id: `${Date.now()}`,
      name,
      savedAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(lpData)),
      sectionOrder: [...sectionOrder],
      hiddenSections: [...hiddenSections],
      sectionLayouts: { ...sectionLayouts },
    };
    setStocks((prev) => [newStock, ...prev]);
  }, [lpData, sectionOrder, hiddenSections, sectionLayouts]);

  const handleRestoreStock = useCallback((stock: StockedLP) => {
    setLpData(stock.data);
    setPreviewData(stock.data);
    setSectionOrder(stock.sectionOrder);
    setPreviewOrder(stock.sectionOrder);
    setHiddenSections(stock.hiddenSections);
    setPreviewHidden(stock.hiddenSections);
    setSectionLayouts(stock.sectionLayouts ?? DEFAULT_SECTION_LAYOUTS);
  }, []);

  const handleDeleteStock = useCallback((id: string) => {
    setStocks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  if (!initialized) return null;

  return (
    <div
      className="flex flex-col h-screen overflow-hidden mesh-bg"
      style={{ userSelect: isDragging ? "none" : "auto" }}
    >
      {/* Header */}
      <header className="glass sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150 text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </button>
          <div className="w-px h-4 bg-white/10" />
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-sm font-bold text-white">
            LP
          </div>
          <span className="font-semibold text-white text-sm" style={{ fontFamily: "Sora, sans-serif" }}>
            LP生成エディタ
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isUpdating && (
            <div className="flex items-center gap-2 text-xs text-blue-300 shimmer">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              更新中...
            </div>
          )}
          <button
            onClick={() => setStockOpen(!stockOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              stockOpen
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            ストック {stocks.length > 0 && <span className="bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded-full text-xs">{stocks.length}</span>}
          </button>
          <button
            onClick={handleDownloadMd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            MDをダウンロード
          </button>
        </div>
      </header>

      {/* Main */}
      <main ref={mainRef} className="flex flex-1 overflow-hidden">
        <div className="flex-shrink-0 overflow-y-auto" style={{ width: editorWidth }}>
          <EditorPanel
            data={lpData}
            onChange={handleChange}
            sectionOrder={sectionOrder}
            onReorder={handleReorder}
            hiddenSections={hiddenSections}
            onToggleHidden={handleToggleHidden}
            sectionLayouts={sectionLayouts}
            onChangeLayout={handleChangeLayout}
            onSectionOpen={(key) => {
              requestAnimationFrame(() => previewRef.current?.scrollToSection(key));
            }}
          />
        </div>

        <div
          onMouseDown={handleDividerMouseDown}
          className="flex-shrink-0 relative flex items-center justify-center"
          style={{
            width: 6,
            cursor: "col-resize",
            background: isDragging ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.07)",
            transition: isDragging ? "none" : "background 0.15s",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 3, opacity: isDragging ? 1 : 0.4 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 2, height: 2, borderRadius: "50%", background: isDragging ? "#60a5fa" : "rgba(255,255,255,0.8)" }} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative min-w-0">
          <PreviewPanel
            ref={previewRef}
            data={previewData}
            isUpdating={isUpdating}
            sectionOrder={previewOrder}
            hiddenSections={previewHidden}
            sectionLayouts={sectionLayouts}
          />
        </div>

        {stockOpen && (
          <>
            <div className="flex-shrink-0 border-l border-white/10" style={{ width: 1 }} />
            <div className="flex-shrink-0 overflow-hidden" style={{ width: STOCK_PANEL_WIDTH }}>
              <StockPanel
                stocks={stocks}
                onSave={handleSaveStock}
                onRestore={handleRestoreStock}
                onDelete={handleDeleteStock}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
