/**
 * Notion-style icon set
 * viewBox 20x20 · strokeWidth 1.5 · rounded caps · currentColor
 */

import type { SVGProps, ReactElement } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

// ─── セクション別アイコン ──────────────────────────────────────

/** S1 Header / Navigation */
export const IconNav = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 5h14M3 10h10M3 15h7" />
  </svg>
);

/** S2 Hero / ファーストビュー */
export const IconHero = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M10 2.5l1.9 5.8H18l-5 3.6 1.9 5.8-4.9-3.6-4.9 3.6 1.9-5.8-5-3.6h6.1z" />
  </svg>
);

/** S3 Message / サービス概要 */
export const IconMessage = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M17 4H3a1 1 0 00-1 1v8a1 1 0 001 1h5l2 2.5 2-2.5h5a1 1 0 001-1V5a1 1 0 00-1-1z" />
    <path d="M6 9h8M6 12h5" />
  </svg>
);

/** S4 Problems / 課題提示 */
export const IconProblems = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M10 3l7.5 13H2.5L10 3z" />
    <path d="M10 9v3.5M10 14.5v.5" />
  </svg>
);

/** S5 Features / 特徴・強み */
export const IconFeatures = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M10 2l1.6 5H17l-4.4 3.2 1.6 5L10 12.5 5.8 15.2l1.6-5L3 7h5.4L10 2z" />
  </svg>
);

/** S6 Categories / 対応業種 */
export const IconCategories = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="3" width="6" height="6" rx="1.5" />
    <rect x="11" y="3" width="6" height="6" rx="1.5" />
    <rect x="3" y="11" width="6" height="6" rx="1.5" />
    <rect x="11" y="11" width="6" height="6" rx="1.5" />
  </svg>
);

/** S7 Case Studies / 導入事例 */
export const IconCaseStudies = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 16V10M8 16V6M12 16V9M16 16V12" />
    <path d="M2 16h16" />
  </svg>
);

/** S8 Flow / 導入フロー */
export const IconFlow = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="4" cy="10" r="2" />
    <circle cx="10" cy="10" r="2" />
    <circle cx="16" cy="10" r="2" />
    <path d="M6 10h2M12 10h2" />
  </svg>
);

/** S9 FAQ / よくある質問 */
export const IconFAQ = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="10" cy="10" r="7.5" />
    <path d="M7.5 7.8a2.5 2.5 0 015 0c0 1.7-2.5 2.2-2.5 3.7" />
    <circle cx="10" cy="14" r=".6" fill="currentColor" stroke="none" />
  </svg>
);

/** S10 CTA / 最終CTA */
export const IconCTA = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 7.5l14-4.5v10L3 8.5v-1zM3 8v4" />
    <path d="M17 13v4a1 1 0 01-2 0v-4" />
  </svg>
);

/** S11 Footer / フッター */
export const IconFooter = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="2.5" y="3" width="15" height="14" rx="2" />
    <path d="M2.5 13.5h15" />
    <path d="M7 16.5h6" />
  </svg>
);

// ─── UI 共通アイコン ──────────────────────────────────────────

/** チェックマーク */
export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 10.5l4 4 8-8" />
  </svg>
);

/** 左矢印 (戻る) */
export const IconArrowLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12.5 4l-7 6 7 6" />
  </svg>
);

/** 右矢印 */
export const IconArrowRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7.5 4l7 6-7 6" />
  </svg>
);

/** ダウンロード */
export const IconDownload = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M10 3v10M6.5 9.5l3.5 4 3.5-4" />
    <path d="M4 15.5h12" />
  </svg>
);

/** ストック / 保存 */
export const IconStock = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5" width="14" height="10" rx="1.5" />
    <path d="M3 9h14" />
    <path d="M7 5V3h6v2" />
  </svg>
);

/** フォーム (生成フロー) */
export const IconForm = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="2.5" width="14" height="15" rx="2" />
    <path d="M6.5 7h7M6.5 10h5M6.5 13h6" />
  </svg>
);

/** Markdown ファイル (生成フロー) */
export const IconMarkdown = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 2.5h8l4 4V17a1 1 0 01-1 1H5a1 1 0 01-1-1V3.5a1 1 0 011-1z" />
    <path d="M13 2.5v4h4" />
    <path d="M6.5 13.5v-4l2.5 2.5 2.5-2.5v4" />
    <path d="M13.5 13.5v-4" />
    <path d="M12 11.5h3" />
  </svg>
);

/** AI スパークル (生成フロー) */
export const IconAI = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M10 2l1.5 5.5L17 9l-5.5 1.5L10 16l-1.5-5.5L3 9l5.5-1.5L10 2z" />
    <path d="M16 3l.8 2.2L19 6l-2.2.8L16 9l-.8-2.2L13 6l2.2-.8L16 3z" />
  </svg>
);

/** プラス */
export const IconPlus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M10 4v12M4 10h12" />
  </svg>
);

/** 更新中スピナー (SVG ベース、animate-spin で回す) */
export const IconSpinner = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} stroke="none">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="35 9" />
  </svg>
);

// ─── セクションキーからアイコンを取得 ────────────────────────

export const SECTION_ICONS: Record<string, (p: P) => ReactElement> = {
  s1: IconNav,
  s2: IconHero,
  s3: IconMessage,
  s4: IconProblems,
  s5: IconFeatures,
  s6: IconCategories,
  s7: IconCaseStudies,
  s8: IconFlow,
  s9: IconFAQ,
  s10: IconCTA,
  s11: IconFooter,
};
