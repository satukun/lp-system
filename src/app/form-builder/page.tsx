"use client";

import { useState } from "react";
import type { FormConfig, FormField } from "@/lib/types";

const DEFAULT_CONFIG: FormConfig = {
  fields: [
    { id: "name",    label: "お名前",        type: "text",  placeholder: "山田 太郎",              required: true  },
    { id: "company", label: "会社名",         type: "text",  placeholder: "株式会社サンプル",        required: true  },
    { id: "email",   label: "メールアドレス", type: "email", placeholder: "example@company.co.jp",  required: true  },
    { id: "tel",     label: "電話番号",       type: "tel",   placeholder: "03-1234-5678",            required: false },
    {
      id: "size", label: "従業員数", type: "select", placeholder: "", required: true,
      options: ["選択してください", "1〜10名", "11〜50名", "51〜300名", "301名以上"],
    },
  ],
  submitLabel: "資料を請求する",
  actionUrl: "",
  adminEmail: "",
  ccEmail: "",
  privacyLabel: "プライバシーポリシーに同意する",
  successMessage: "お問い合わせありがとうございます。担当者よりご連絡いたします。",
};

const STEPS = [
  { id: "fields",   label: "入力項目の設定" },
  { id: "action",   label: "送信先の設定" },
  { id: "messages", label: "テキストの設定" },
  { id: "preview",  label: "確認・ダウンロード" },
] as const;

type StepId = typeof STEPS[number]["id"];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function generateFormHtml(cfg: FormConfig): string {
  const actionAttr = cfg.actionUrl ? ` action="${esc(cfg.actionUrl)}" method="POST"` : ` onsubmit="handleSubmit(event)"`;
  const fields = cfg.fields.map((f) => {
    const req = f.required ? " required" : "";
    const reqLabel = f.required ? ` <span style="color:#e53e3e;">*</span>` : "";
    if (f.type === "select") {
      const opts = (f.options ?? []).map((o) => `  <option value="${esc(o)}">${esc(o)}</option>`).join("\n");
      return `<div style="margin-bottom:16px;">
  <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;">${esc(f.label)}${reqLabel}</label>
  <select name="${esc(f.id)}" style="width:100%;padding:10px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:14px;"${req}>
${opts}
  </select>
</div>`;
    }
    return `<div style="margin-bottom:16px;">
  <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;">${esc(f.label)}${reqLabel}</label>
  <input type="${f.type}" name="${esc(f.id)}" placeholder="${esc(f.placeholder)}" style="width:100%;padding:10px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:14px;box-sizing:border-box;"${req}>
</div>`;
  }).join("\n");

  const submitScript = !cfg.actionUrl ? `
<script>
function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('form-area').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}
</script>` : "";

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせフォーム</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Noto Sans JP', sans-serif; background: #f6f5f4; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
    .form-card { background: #fff; border-radius: 16px; padding: 40px; max-width: 480px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #1a1a2e; }
    input, select { outline: none; transition: border-color 150ms; }
    input:focus, select:focus { border-color: rgba(0,0,0,0.3) !important; }
    .btn { width: 100%; padding: 14px; background: #1a1a2e; color: #fff; border: none; border-radius: 9999px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 8px; }
    .btn:hover { opacity: 0.85; }
    .privacy { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #666; margin-bottom: 16px; }
    .success { text-align: center; padding: 40px 20px; }
    .success p { font-size: 16px; color: #333; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="form-card">
    <div id="form-area">
      <h2>お問い合わせ</h2>
      <form${actionAttr}>
${fields}
        <div class="privacy">
          <input type="checkbox" id="privacy" required>
          <label for="privacy">${esc(cfg.privacyLabel)}</label>
        </div>
        <button type="submit" class="btn">${esc(cfg.submitLabel)}</button>
      </form>
    </div>
    <div id="form-success" style="display:none;" class="success">
      <p>${esc(cfg.successMessage)}</p>
    </div>
  </div>
${submitScript}
</body>
</html>`;
}

export default function FormBuilderPage() {
  const [step, setStep] = useState<StepId>("fields");
  const [config, setConfig] = useState<FormConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);

  const currentIndex = STEPS.findIndex((s) => s.id === step);
  const html = generateFormHtml(config);

  const updateField = (index: number, key: keyof FormField, value: string | boolean) => {
    const fields = config.fields.map((f, i) => i === index ? { ...f, [key]: value } : f);
    setConfig({ ...config, fields });
  };

  const addField = () => {
    setConfig({
      ...config,
      fields: [...config.fields, { id: `field_${Date.now()}`, label: "", type: "text", placeholder: "", required: false }],
    });
  };

  const removeField = (index: number) => {
    setConfig({ ...config, fields: config.fields.filter((_, i) => i !== index) });
  };

  const download = () => {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "form.html";
    a.click();
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--col-bg)", border: "1px solid var(--col-border-2)",
    borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "var(--col-text)",
    boxShadow: "var(--shadow-inset)", outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, color: "var(--col-text-2)", letterSpacing: "0.03em",
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--col-bg)", borderRadius: 12, padding: "16px",
    boxShadow: "var(--shadow-outline)", display: "flex", flexDirection: "column", gap: 10,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--col-surface)", fontFamily: "inherit" }}>
      {/* ヘッダー */}
      <div style={{
        background: "var(--col-bg)", borderBottom: "1px solid var(--col-border)",
        padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ fontSize: 13, color: "var(--col-text-3)", textDecoration: "none" }}>← LP生成ウィザード</a>
          <span style={{ color: "var(--col-border)" }}>|</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--col-text)" }}>フォームビルダー</span>
        </div>
        <span style={{
          fontSize: 11, padding: "2px 10px", borderRadius: 9999,
          background: "var(--col-surface-2)", color: "var(--col-text-3)",
          boxShadow: "var(--shadow-inset)",
        }}>
          β版
        </span>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

        {/* 左：設定パネル */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ステップナビ */}
          <div style={{ display: "flex", gap: 4 }}>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                style={{
                  flex: 1, padding: "8px 4px", fontSize: 11, fontWeight: 600, borderRadius: 8,
                  border: "none", cursor: "pointer", textAlign: "center",
                  background: step === s.id ? "var(--col-action)" : "var(--col-bg)",
                  color: step === s.id ? "#fff" : "var(--col-text-3)",
                  boxShadow: step === s.id ? "none" : "var(--shadow-outline)",
                  transition: "all 150ms",
                }}
              >
                <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{i + 1}</div>
                {s.label}
              </button>
            ))}
          </div>

          {/* Step: 入力項目 */}
          {step === "fields" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 13, color: "var(--col-text-2)", margin: 0 }}>
                フォームに表示する入力項目を設定してください。
              </p>
              {config.fields.map((field, i) => (
                <div key={field.id} style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-3)" }}>項目 {i + 1}</span>
                    <button onClick={() => removeField(i)} style={{ fontSize: 11, color: "var(--col-text-3)", background: "none", border: "none", cursor: "pointer" }}>削除</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={labelStyle}>ラベル</label>
                    <input style={inputStyle} value={field.label} onChange={(e) => updateField(i, "label", e.target.value)} placeholder="お名前" />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={labelStyle}>タイプ</label>
                      <select style={inputStyle} value={field.type} onChange={(e) => updateField(i, "type", e.target.value)}>
                        <option value="text">テキスト</option>
                        <option value="email">メール</option>
                        <option value="tel">電話番号</option>
                        <option value="select">セレクト</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "flex-end" }}>
                      <label style={labelStyle}>必須</label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", height: 38, fontSize: 12, color: "var(--col-text-2)" }}>
                        <input type="checkbox" checked={field.required} onChange={(e) => updateField(i, "required", e.target.checked)} />
                        必須
                      </label>
                    </div>
                  </div>
                  {field.type !== "select" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={labelStyle}>プレースホルダー</label>
                      <input style={inputStyle} value={field.placeholder} onChange={(e) => updateField(i, "placeholder", e.target.value)} placeholder="山田 太郎" />
                    </div>
                  )}
                  {field.type === "select" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={labelStyle}>選択肢（1行1項目）</label>
                      <textarea
                        style={{ ...inputStyle, resize: "vertical" }}
                        rows={3}
                        value={(field.options ?? []).join("\n")}
                        onChange={(e) => updateField(i, "options", e.target.value.split("\n") as unknown as string)}
                        placeholder={"選択してください\n1〜10名\n11〜50名"}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={addField}
                style={{
                  padding: "10px", borderRadius: 9999, border: "1.5px dashed var(--col-border-2)",
                  background: "transparent", fontSize: 13, fontWeight: 600, color: "var(--col-text-3)",
                  cursor: "pointer",
                }}
              >
                + 項目を追加
              </button>
            </div>
          )}

          {/* Step: 送信先 */}
          {step === "action" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 13, color: "var(--col-text-2)", margin: 0 }}>
                フォームの送信先を設定します。空欄の場合は送信完了画面のみ表示されます（バックエンドなし）。
              </p>
              <div style={cardStyle}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>送信先 URL</label>
                  <input style={inputStyle} value={config.actionUrl} onChange={(e) => setConfig({ ...config, actionUrl: e.target.value })} placeholder="https://formspree.io/f/xxxxxxxx" />
                  <p style={{ fontSize: 11, color: "var(--col-text-3)", margin: 0 }}>Formspree / Netlify Forms 等のURLを入力してください</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>管理者メールアドレス</label>
                  <input style={inputStyle} value={config.adminEmail} onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })} placeholder="admin@company.co.jp" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>CC メールアドレス（任意）</label>
                  <input style={inputStyle} value={config.ccEmail} onChange={(e) => setConfig({ ...config, ccEmail: e.target.value })} placeholder="cc@company.co.jp" />
                </div>
              </div>
            </div>
          )}

          {/* Step: テキスト設定 */}
          {step === "messages" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={cardStyle}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>送信ボタンのテキスト</label>
                  <input style={inputStyle} value={config.submitLabel} onChange={(e) => setConfig({ ...config, submitLabel: e.target.value })} placeholder="資料を請求する" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>プライバシーポリシー文言</label>
                  <input style={inputStyle} value={config.privacyLabel} onChange={(e) => setConfig({ ...config, privacyLabel: e.target.value })} placeholder="プライバシーポリシーに同意する" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>送信完了メッセージ</label>
                  <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={config.successMessage} onChange={(e) => setConfig({ ...config, successMessage: e.target.value })} placeholder="お問い合わせありがとうございます。" />
                </div>
              </div>
            </div>
          )}

          {/* Step: プレビュー・DL */}
          {step === "preview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 13, color: "var(--col-text-2)", margin: 0 }}>
                設定が完了しました。HTMLをダウンロードして LP の所定の場所に配置してください。
              </p>
              <button
                onClick={download}
                style={{
                  padding: "14px", borderRadius: 9999, border: "none",
                  background: "var(--col-action)", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                form.html をダウンロード
              </button>
              <button
                onClick={copyHtml}
                style={{
                  padding: "14px", borderRadius: 9999,
                  border: "1.5px solid var(--col-border-2)",
                  background: "var(--col-bg)", color: "var(--col-text)",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                {copied ? "コピーしました ✓" : "HTML をコピー"}
              </button>
            </div>
          )}

          {/* ナビゲーション */}
          <div style={{ display: "flex", gap: 8 }}>
            {currentIndex > 0 && (
              <button
                onClick={() => setStep(STEPS[currentIndex - 1].id)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 9999,
                  border: "1.5px solid var(--col-border-2)", background: "var(--col-bg)",
                  fontSize: 13, fontWeight: 600, color: "var(--col-text-2)", cursor: "pointer",
                }}
              >
                ← 戻る
              </button>
            )}
            {currentIndex < STEPS.length - 1 && (
              <button
                onClick={() => setStep(STEPS[currentIndex + 1].id)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 9999, border: "none",
                  background: "var(--col-action)", color: "#fff",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                次へ →
              </button>
            )}
          </div>
        </div>

        {/* 右：プレビュー */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "sticky", top: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-3)", margin: 0, letterSpacing: "0.05em" }}>プレビュー</p>
          <div style={{
            background: "var(--col-bg)", borderRadius: 12, overflow: "hidden",
            boxShadow: "var(--shadow-outline)",
          }}>
            <iframe
              srcDoc={html}
              style={{ width: "100%", height: 600, border: "none", display: "block" }}
              title="フォームプレビュー"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
