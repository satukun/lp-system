"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultContent } from "@/lib/defaultContent";
import type { LPData, SectionKey, StockedLP, SectionLayouts, LayoutIndex, ColorPalette } from "@/lib/types";
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_LAYOUTS } from "@/lib/types";
import type { OnImageChange } from "@/components/preview/SectionRenderer";
import EditorPanel from "@/components/editor/EditorPanel";
import PreviewPanel, { type PreviewPanelHandle } from "@/components/preview/PreviewPanel";
import StockPanel from "@/components/stock/StockPanel";
import { generateMarkdown } from "@/lib/markdownGenerator";
import { generateHtml } from "@/lib/htmlGenerator";

const MIN_EDITOR_WIDTH = 280;
const MAX_EDITOR_WIDTH_RATIO = 0.55;
const DEFAULT_EDITOR_WIDTH = 400;
const STOCK_PANEL_WIDTH = 260;
const WIZARD_DATA_KEY = "lp_wizard_data";
const WIZARD_LAYOUTS_KEY = "lp_wizard_layouts";
const WIZARD_CONFIRMED_KEY = "lp_wizard_confirmed";
const WIZARD_PALETTE_KEY = "lp_wizard_palette";

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

  const [confirmedSections, setConfirmedSections] = useState<SectionKey[]>([]);
  const [palette, setPalette] = useState<ColorPalette>("A");
  const [hasChanges, setHasChanges] = useState(false);
  const skipFirstChangeRef = useRef(true);

  const [stocks, setStocks] = useState<StockedLP[]>([]);
  const [stockOpen, setStockOpen] = useState(true);
  const [editorOpen, setEditorOpen] = useState(true);

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
      }
      if (rawLayouts) {
        const parsed = JSON.parse(rawLayouts) as SectionLayouts;
        setSectionLayouts(parsed);
      }
      if (rawConfirmed) {
        const confirmed = JSON.parse(rawConfirmed) as SectionKey[];
        setConfirmedSections(confirmed);
        // ウィザードで確定されなかったセクションを非表示にする
        const hidden = DEFAULT_SECTION_ORDER.filter((k) => !confirmed.includes(k));
        setHiddenSections(hidden);
        setPreviewHidden(hidden);
      }
      const savedPalette = localStorage.getItem(WIZARD_PALETTE_KEY) as ColorPalette | null;
      if (savedPalette && ["A", "B", "C"].includes(savedPalette)) {
        setPalette(savedPalette);
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

  const handleToggleConfirmed = useCallback((key: SectionKey) => {
    setConfirmedSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const handleRegenerate = useCallback(() => {
    try {
      localStorage.setItem(WIZARD_DATA_KEY, JSON.stringify(lpData));
      localStorage.setItem(WIZARD_LAYOUTS_KEY, JSON.stringify(sectionLayouts));
      localStorage.setItem(WIZARD_CONFIRMED_KEY, JSON.stringify(confirmedSections));
      localStorage.setItem(WIZARD_PALETTE_KEY, palette);
    } catch { /* ignore */ }
    sessionStorage.setItem("lp_just_generated", "1");
    router.push("/generating");
  }, [lpData, sectionLayouts, confirmedSections, palette, router]);

  const handlePaletteChange = useCallback((p: ColorPalette) => {
    setPalette(p);
    localStorage.setItem(WIZARD_PALETTE_KEY, p);
  }, []);

  const handleImageChange: OnImageChange = useCallback((key: string, url: string) => {
    setLpData((prev) => {
      const updated = { ...prev, images: { ...prev.images, [key]: url } };
      setPreviewData(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  // 初期ロード完了後の変更を検知 → hasChanges
  useEffect(() => {
    if (!initialized) return;
    if (skipFirstChangeRef.current) {
      skipFirstChangeRef.current = false;
      return;
    }
    setHasChanges(true);
  }, [lpData, sectionLayouts, confirmedSections, palette, initialized]);

  // lpData / sectionLayouts の変更を localStorage に自動保存
  const saveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!initialized) return;
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      try {
        localStorage.setItem(WIZARD_DATA_KEY, JSON.stringify(lpData));
        localStorage.setItem(WIZARD_LAYOUTS_KEY, JSON.stringify(sectionLayouts));
      } catch { /* quota exceeded: ignore */ }
    }, 800);
  }, [lpData, sectionLayouts, initialized]);

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
    const md = generateMarkdown(lpData, confirmedSections);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content-source.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const visibleSections = sectionOrder.filter((k) => !hiddenSections.includes(k));
    const html = generateHtml(
      lpData,
      visibleSections,
      sectionLayouts,
      palette,
      hiddenSections
    );
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
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
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--col-bg)", userSelect: isDragging ? "none" : "auto" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-0"
        style={{ height: 48, background: "var(--col-bg)", borderBottom: "1px solid var(--col-border)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-all duration-150"
            style={{ color: "var(--col-text-2)", border: "none", background: "transparent", cursor: "pointer" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; (e.currentTarget as HTMLElement).style.background = "var(--col-surface-2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </button>
          <div style={{ width: 1, height: 16, background: "var(--col-border-2)" }} />
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "var(--col-surface)", border: "1px solid var(--col-border-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "var(--col-text)",
          }}>LP</div>
          <span className="text-sm font-semibold" style={{ color: "var(--col-text)", fontFamily: "Inter, sans-serif" }}>
            LP生成エディタ
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isUpdating && (
            <div className="flex items-center gap-2 text-xs shimmer" style={{ color: "var(--col-text-2)" }}>
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              更新中
            </div>
          )}
          <button
            onClick={handleRegenerate}
            disabled={!hasChanges}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
            style={{
              background: hasChanges ? "var(--col-surface-2)" : "transparent",
              border: `1px solid ${hasChanges ? "var(--col-border-2)" : "var(--col-border)"}`,
              color: hasChanges ? "var(--col-text-2)" : "var(--col-text-3)",
              cursor: hasChanges ? "pointer" : "not-allowed",
              opacity: hasChanges ? 1 : 0.5,
            }}
            onMouseEnter={(e) => { if (hasChanges) { (e.currentTarget as HTMLElement).style.color = "var(--col-text)"; (e.currentTarget as HTMLElement).style.background = "var(--col-surface-3)"; }}}
            onMouseLeave={(e) => { if (hasChanges) { (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; (e.currentTarget as HTMLElement).style.background = "var(--col-surface-2)"; }}}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 20 20">
              <path d="M4 4v5h5M16 16v-5h-5" /><path d="M4.5 15.5A8 8 0 1015.5 4.5" />
            </svg>
            再生成
          </button>
          <button
            onClick={() => router.push("/complete")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
            style={{ background: "var(--col-success-bg)", border: "1px solid var(--col-success-bd)", color: "var(--col-success)", cursor: "pointer" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4" /><circle cx="10" cy="10" r="7.5" />
            </svg>
            完成画面へ
          </button>
          <button
            onClick={handleDownloadMd}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
            style={{ background: "var(--col-surface-2)", border: "1px solid var(--col-border-2)", color: "var(--col-text)", cursor: "pointer" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-surface-3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-surface-2)"; }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" viewBox="0 0 20 20">
              <path d="M10 3v10M6.5 9.5l3.5 4 3.5-4"/><path d="M4 15.5h12"/>
            </svg>
            MDをダウンロード
          </button>
          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-xs font-semibold transition-all duration-150"
            style={{ background: "var(--col-action)", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-action-h)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-action)"; }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" viewBox="0 0 20 20">
              <path d="M10 3v10M6.5 9.5l3.5 4 3.5-4"/><path d="M4 15.5h12"/>
            </svg>
            HTMLをダウンロード
          </button>
        </div>
      </header>

      {/* Main */}
      <main ref={mainRef} className="flex flex-1 overflow-hidden">
        {/* エディタパネル (開) */}
        {editorOpen && (
          <>
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
                confirmedSections={confirmedSections}
                onToggleConfirmed={handleToggleConfirmed}
                onSectionOpen={(key) => {
                  requestAnimationFrame(() => previewRef.current?.scrollToSection(key));
                }}
                onCollapse={() => setEditorOpen(false)}
              />
            </div>
            <div
              onMouseDown={handleDividerMouseDown}
              className="flex-shrink-0 relative flex items-center justify-center"
              style={{
                width: 6, cursor: "col-resize",
                background: isDragging ? "rgba(55,53,47,0.12)" : "var(--col-border)",
                transition: isDragging ? "none" : "background 0.15s",
                zIndex: 10,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 3, opacity: isDragging ? 1 : 0.4 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 2, height: 2, borderRadius: "50%", background: isDragging ? "var(--col-text)" : "var(--col-text-3)" }} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* エディタパネル (閉) — 細いタブ */}
        {!editorOpen && (
          <div
            onClick={() => setEditorOpen(true)}
            title="セクション編集を開く"
            style={{
              flexShrink: 0, width: 32, borderRight: "1px solid var(--col-border)",
              background: "var(--col-bg)", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, gap: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-surface-2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-bg)"; }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--col-text-3)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative min-w-0">
          <PreviewPanel
            ref={previewRef}
            data={previewData}
            isUpdating={isUpdating}
            sectionOrder={previewOrder}
            hiddenSections={previewHidden}
            sectionLayouts={sectionLayouts}
            palette={palette}
            onPaletteChange={handlePaletteChange}
            onImageChange={handleImageChange}
          />
        </div>

        {/* ストックパネル (閉) — 細いタブ */}
        {!stockOpen && (
          <div
            onClick={() => setStockOpen(true)}
            title="ストックを開く"
            style={{
              flexShrink: 0, width: 32, borderLeft: "1px solid var(--col-border)",
              background: "var(--col-bg)", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, gap: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-surface-2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-bg)"; }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--col-text-3)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        )}

        {/* ストックパネル (開) */}
        {stockOpen && (
          <>
            <div style={{ flexShrink: 0, width: 1, background: "var(--col-border)" }} />
            <div className="flex-shrink-0 overflow-hidden" style={{ width: STOCK_PANEL_WIDTH }}>
              <StockPanel
                stocks={stocks}
                onSave={handleSaveStock}
                onRestore={handleRestoreStock}
                onDelete={handleDeleteStock}
                onCollapse={() => setStockOpen(false)}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
