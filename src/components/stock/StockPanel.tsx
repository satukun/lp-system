"use client";

import type { StockedLP } from "@/lib/types";

interface Props {
  stocks: StockedLP[];
  onRestore: (stock: StockedLP) => void;
  onDelete: (id: string) => void;
  onSave: (name: string) => void;
  onCollapse?: () => void;
}

export default function StockPanel({ stocks, onRestore, onDelete, onSave, onCollapse }: Props) {
  const handleSave = () => {
    const name = prompt("このLPに名前をつけてください", `LP案件 ${stocks.length + 1}`);
    if (name?.trim()) onSave(name.trim());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--col-bg)" }}>
      {/* ヘッダー */}
      <div style={{
        padding: "12px 16px", borderBottom: "1px solid var(--col-border)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {onCollapse && (
            <button
              onClick={onCollapse}
              title="パネルを閉じる"
              style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 5, background: "transparent", border: "none", cursor: "pointer", color: "var(--col-text-3)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--col-surface-2)"; (e.currentTarget as HTMLElement).style.color = "var(--col-text-2)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--col-text-3)"; }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <div>
            <h2 style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>ストック</h2>
            <p style={{ fontSize: 11, color: "var(--col-text-3)", marginTop: 2, marginBottom: 0 }}>{stocks.length}件保存済み</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 6,
            background: "var(--col-success-bg)", border: "1px solid var(--col-success-bd)",
            color: "var(--col-success)", fontSize: 11, fontWeight: 600, cursor: "pointer",
          }}
        >
          <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          保存
        </button>
      </div>

      {/* ストックリスト */}
      <div style={{ flex: 1, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        {stocks.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "0 16px", gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "var(--col-surface-2)", border: "1px solid var(--col-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--col-text-3)",
            }}>
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p style={{ fontSize: 11, color: "var(--col-text-3)", lineHeight: 1.6, margin: 0 }}>
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

function StockCard({ stock, onRestore, onDelete }: { stock: StockedLP; onRestore: () => void; onDelete: () => void }) {
  const visibleCount = stock.sectionOrder.length - stock.hiddenSections.length;
  const date = new Date(stock.savedAt);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

  return (
    <div style={{
      background: "var(--col-bg)", border: "1px solid var(--col-border)", borderRadius: 8,
      padding: 12, display: "flex", flexDirection: "column", gap: 8,
    }}>
      {/* タイトル行 */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--col-text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stock.name}</p>
          <p style={{ fontSize: 11, color: "var(--col-text-3)", marginTop: 2, marginBottom: 0 }}>{dateStr} 保存</p>
        </div>
        <button
          onClick={onDelete}
          style={{ flexShrink: 0, padding: 4, borderRadius: 4, background: "transparent", border: "none", cursor: "pointer", color: "var(--col-text-3)" }}
          title="削除"
        >
          <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* メタ情報 */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "var(--col-text-2)", background: "var(--col-surface-2)", padding: "1px 7px", borderRadius: 4 }}>
          {visibleCount}セクション
        </span>
        <span style={{ fontSize: 11, color: "var(--col-text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
          {stock.data.s2.mainCopy.slice(0, 20)}{stock.data.s2.mainCopy.length > 20 ? "…" : ""}
        </span>
      </div>

      {/* セクション順序バッジ */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {stock.sectionOrder.map((key) => {
          const isHidden = stock.hiddenSections.includes(key);
          return (
            <span
              key={key}
              style={{
                fontSize: 10, padding: "1px 5px", borderRadius: 3, fontFamily: "monospace",
                background: isHidden ? "var(--col-surface-2)" : "var(--col-surface-3)",
                color: isHidden ? "var(--col-text-3)" : "var(--col-text-2)",
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
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          padding: "6px 0", borderRadius: 6, background: "var(--col-surface-2)",
          border: "1px solid var(--col-border)", color: "var(--col-text-2)",
          fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 150ms",
        }}
      >
        <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        このLPを復元
      </button>
    </div>
  );
}
