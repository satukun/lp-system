/**
 * sync-from-figma.ts
 * Figma の各セクションページにあるフレームと sectionLayouts.ts の定義を比較し、
 * 差分レポートを出力するスクリプト。
 *
 * 使い方:
 *   npm run sync-from-figma
 *   （.env の FIGMA_TOKEN が自動で読み込まれます）
 */

// .env を自動ロード（tsx が NODE_OPTIONS 経由で --env-file をサポートしない環境向け）
import { readFileSync } from "fs";
import { resolve } from "path";
try {
  const envPath = resolve(process.cwd(), ".env");
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && !process.env[key]) {
      process.env[key] = rest.join("=").trim();
    }
  }
} catch {
  // .env がない場合は環境変数をそのまま使う
}

import { getFile, getPageFrames } from "./figma-client.js";
import {
  expectedPatterns,
  parseFrameName,
} from "./layout-mapper.js";
import { SECTION_LAYOUTS } from "../src/lib/sectionLayouts.js";

// Pattern Overview ページ名
const OVERVIEW_PAGE_NAME = "Pattern Overview";

// ── ターミナル出力カラー ──────────────────────────────────────────
const C = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

function green(s: string) { return `${C.green}${s}${C.reset}`; }
function yellow(s: string) { return `${C.yellow}${s}${C.reset}`; }
function red(s: string) { return `${C.red}${s}${C.reset}`; }
function bold(s: string) { return `${C.bold}${s}${C.reset}`; }
function dim(s: string) { return `${C.dim}${s}${C.reset}`; }

// ── メイン処理 ───────────────────────────────────────────────────
async function main() {
  console.log(bold("\n🔍  Figma ↔ sectionLayouts.ts 同期チェック\n"));

  // 1. Figma ファイルの Pattern Overview ページを取得
  console.log(dim("Figma ファイルを取得中..."));
  const file = await getFile();
  console.log(dim(`  ファイル名: ${file.name}`));

  const overviewPage = file.document.children.find(p => p.name === OVERVIEW_PAGE_NAME);
  if (!overviewPage) {
    console.error(red(`\n❌ "${OVERVIEW_PAGE_NAME}" ページが見つかりません。\n`));
    process.exit(2);
  }
  console.log(dim(`  参照ページ: ${OVERVIEW_PAGE_NAME} (id: ${overviewPage.id})`));

  // 2. sectionLayouts.ts から「コードに定義されているパターン」を収集
  const codePatterns = new Set<string>(); // "s2/D" 形式
  for (const [sectionKey, layouts] of Object.entries(SECTION_LAYOUTS)) {
    layouts.forEach((_, idx) => {
      const label = ["A", "B", "C", "D"][idx];
      if (label) codePatterns.add(`${sectionKey}/${label}`);
    });
  }

  // 3. Pattern Overview ページから「Figmaに存在するパターン」を収集
  const figmaPatterns = new Map<string, string>(); // "s2/D" → nodeId
  const figmaExtraFrames: string[] = []; // パースできなかったフレーム名

  const frames = await getPageFrames(overviewPage.id);
  for (const frame of frames) {
    const parsed = parseFrameName(frame.name);
    if (!parsed) {
      figmaExtraFrames.push(frame.name);
      continue;
    }
    if (parsed.isThumbnail) continue;
    const key = `${parsed.sectionKey}/${parsed.label}`;
    figmaPatterns.set(key, frame.id);
  }

  // 4. 差分を計算
  const allExpected = expectedPatterns();
  const onlyInCode: string[] = [];    // コードにあるが Figma にない
  const onlyInFigma: string[] = [];   // Figma にあるがコードにない
  const inBoth: string[] = [];        // 両方に存在（✅）

  for (const { sectionKey, label } of allExpected) {
    const key = `${sectionKey}/${label}`;
    const inCode = codePatterns.has(key);
    const inFigma = figmaPatterns.has(key);

    if (inCode && inFigma) inBoth.push(key);
    else if (inCode && !inFigma) onlyInCode.push(key);
    else if (!inCode && inFigma) onlyInFigma.push(key);
  }

  // 5. レポート出力
  console.log(`\n${bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}`);
  console.log(bold(" 同期ステータス"));
  console.log(`${bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}\n`);

  // ✅ 同期済み
  console.log(green(`✅  同期済み (${inBoth.length} パターン)`));
  const bySection = new Map<string, string[]>();
  for (const key of inBoth) {
    const [sec, lbl] = key.split("/");
    if (!bySection.has(sec)) bySection.set(sec, []);
    bySection.get(sec)!.push(lbl);
  }
  for (const [sec, labels] of [...bySection.entries()].sort()) {
    console.log(dim(`    ${sec}: ${labels.join(", ")}`));
  }

  // ⚠ コードにあるが Figma にない（Figmaにフレームを作るべき）
  if (onlyInCode.length > 0) {
    console.log(`\n${yellow(`⚠   コードに定義済みだが Figma フレームが未作成 (${onlyInCode.length} パターン)`)}`);
    console.log(yellow("    → CLAUDE.md ルートA の手順で Figma にフレームを追加してください"));
    for (const key of onlyInCode.sort()) {
      console.log(`    ${yellow("•")} ${key}`);
    }
  }

  // 🆕 Figma にあるがコードにない（コードへの反映が必要）
  if (onlyInFigma.length > 0) {
    console.log(`\n${C.cyan}🆕  Figma にフレームがあるがコードに未実装 (${onlyInFigma.length} パターン)${C.reset}`);
    console.log(dim("    → CLAUDE.md ルートB の手順でコードに反映してください"));
    for (const key of onlyInFigma.sort()) {
      const nodeId = figmaPatterns.get(key);
      console.log(`    ${C.cyan}•${C.reset} ${key}  ${dim(`(node: ${nodeId})`)}`);
    }
  }

  // 🔵 パースできなかった Figma フレーム
  if (figmaExtraFrames.length > 0) {
    console.log(`\n${dim(`🔵  命名規則外の Figma フレーム (${figmaExtraFrames.length} 件)`)}`);
    console.log(dim("    → {sectionKey}/{patternLabel} 形式ではないためスキップしました"));
    for (const name of figmaExtraFrames) {
      console.log(dim(`    • ${name}`));
    }
  }

  // サマリー
  const total = allExpected.length;
  const syncedPct = Math.round((inBoth.length / total) * 100);
  console.log(`\n${bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}`);
  console.log(bold(` サマリー: ${inBoth.length}/${total} パターン同期済み (${syncedPct}%)`));
  if (onlyInCode.length > 0 || onlyInFigma.length > 0) {
    console.log(yellow(` ⚠ ${onlyInCode.length + onlyInFigma.length} パターンに差分があります`));
  } else {
    console.log(green(" ✅ 完全に同期されています！"));
  }
  console.log(`${bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}\n`);

  // 差分がある場合は exit code 1
  if (onlyInCode.length > 0 || onlyInFigma.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(red(`\n❌ エラーが発生しました: ${err.message}\n`));
  process.exit(2);
});
