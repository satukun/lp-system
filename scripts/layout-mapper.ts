/**
 * layout-mapper.ts
 * Figma フレーム名（例: "s2/D"）を sectionLayouts.ts のインデックスにマップする。
 */

import type { SectionKey } from "../src/lib/types";

export const SECTION_KEYS: SectionKey[] = [
  "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11",
];

/** パターンラベル (A/B/C/D) → LayoutIndex (0/1/2/3) */
const LABEL_TO_INDEX: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

export interface ParsedFrame {
  sectionKey: SectionKey;
  label: string;        // "A" | "B" | "C" | "D"
  layoutIndex: number;  // 0 | 1 | 2 | 3
  isThumbnail: boolean; // フレーム名が "{key}/{label}/thumbnail" 形式の場合 true
}

/**
 * "s2/D" → { sectionKey: "s2", label: "D", layoutIndex: 3, isThumbnail: false }
 * "s2/D/thumbnail" → { ..., isThumbnail: true }
 * 解析できない場合は null を返す
 */
export function parseFrameName(name: string): ParsedFrame | null {
  const parts = name.split("/");
  if (parts.length < 2) return null;

  const sectionKey = parts[0] as SectionKey;
  if (!SECTION_KEYS.includes(sectionKey)) return null;

  const label = parts[1].toUpperCase();
  if (!(label in LABEL_TO_INDEX)) return null;

  const isThumbnail = parts[2]?.toLowerCase() === "thumbnail";

  return {
    sectionKey,
    label,
    layoutIndex: LABEL_TO_INDEX[label],
    isThumbnail,
  };
}

/** 期待されるパターン一覧（sectionKey × A〜D の全組み合わせ）を生成 */
export function expectedPatterns(): Array<{ sectionKey: SectionKey; label: string; layoutIndex: number }> {
  const result = [];
  for (const key of SECTION_KEYS) {
    for (const [label, idx] of Object.entries(LABEL_TO_INDEX)) {
      result.push({ sectionKey: key, label, layoutIndex: idx });
    }
  }
  return result;
}
