"use client";

import type { StockedLP, LPData, SectionKey } from "@/lib/types";

interface Props {
  stocks: StockedLP[];
  onRestore: (stock: StockedLP) => void;
  onDelete: (id: string) => void;
  onSave: (name: string) => void;
}

export default function StockPanel({ stocks, onRestore, onDelete, onSave }: Props) {
  const handleSave = () => {
    const name = prompt("このLPに名前をつけてください", `LP案件 ${stocks.length + 1}`);
    if (name?.trim()) onSave(name.trim());
  };

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">ストック</h2>
          <p className="text-xs text-slate-600 mt-0.5">{stocks.length}件保存済み</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          保存
        </button>
      </div>

      {/* ストックリスト */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {stocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              「保存」ボタンで現在のLPをストックできます
            </p>
          </div>
        ) : (
          stocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              onRestore={() => onRestore(stock)}
              onDelete={() => onDelete(stock.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function StockCard({
  stock,
  onRestore,
  onDelete,
}: {
  stock: StockedLP;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const visibleCount = stock.sectionOrder.length - stock.hiddenSections.length;
  const date = new Date(stock.savedAt);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="glass rounded-xl p-3 flex flex-col gap-2.5 hover:bg-white/8 transition-colors duration-150">
      {/* タイトル行 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{stock.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{dateStr} 保存</p>
        </div>
        <button
          onClick={onDelete}
          className="flex-shrink-0 p-1 rounded-md hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all duration-150"
          title="削除"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* メタ情報 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 bg-slate-700/40 px-2 py-0.5 rounded-md">
          {visibleCount}セクション表示
        </span>
        <span className="text-xs text-slate-600 truncate max-w-full">
          {stock.data.s2.mainCopy.slice(0, 20)}{stock.data.s2.mainCopy.length > 20 ? "…" : ""}
        </span>
      </div>

      {/* セクション順序バッジ */}
      <div className="flex flex-wrap gap-1">
        {stock.sectionOrder.map((key) => {
          const isHidden = stock.hiddenSections.includes(key);
          return (
            <span
              key={key}
              className="text-xs px-1.5 py-0.5 rounded font-mono"
              style={{
                background: isHidden ? "rgba(255,255,255,0.04)" : "rgba(96,165,250,0.12)",
                color: isHidden ? "rgba(255,255,255,0.2)" : "rgba(96,165,250,0.8)",
                textDecoration: isHidden ? "line-through" : "none",
              }}
            >
              {key.toUpperCase()}
            </span>
          );
        })}
      </div>

      {/* 復元ボタン */}
      <button
        onClick={onRestore}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/20 text-blue-300 text-xs font-semibold transition-all duration-150"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        このLPを復元
      </button>
    </div>
  );
}
