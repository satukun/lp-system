/**
 * figma-client.ts
 * Figma REST API の薄いラッパー。FIGMA_TOKEN 環境変数を使用する。
 */

const FILE_KEY = "jpGxPuHcGbWRXxCAPFotBf";
const BASE_URL = "https://api.figma.com/v1";

function getToken(): string {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    throw new Error(
      "FIGMA_TOKEN 環境変数が設定されていません。\n" +
        "export FIGMA_TOKEN=<your_personal_access_token> を実行してください。"
    );
  }
  return token;
}

async function figmaFetch<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "X-Figma-Token": getToken() },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API エラー ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export interface FigmaPage {
  id: string;
  name: string;
  type: "CANVAS";
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
}

export interface FigmaFile {
  name: string;
  document: {
    id: string;
    name: string;
    type: string;
    children: FigmaPage[];
  };
}

/** ファイル全体のメタデータ（ページ一覧）を取得 */
export async function getFile(): Promise<FigmaFile> {
  return figmaFetch<FigmaFile>(`/files/${FILE_KEY}?depth=1`);
}

/** 特定ページのトップレベルフレーム一覧を取得 */
export async function getPageFrames(pageId: string): Promise<FigmaNode[]> {
  const data = await figmaFetch<{
    nodes: Record<string, { document: FigmaNode & { children?: FigmaNode[] } }>;
  }>(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(pageId)}&depth=1`);

  const node = data.nodes[pageId];
  if (!node) return [];
  return (node.document.children ?? []).filter((n) => n.type === "FRAME");
}
