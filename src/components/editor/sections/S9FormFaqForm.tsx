"use client";

import { useState } from "react";
import type { S9FormFaq, FaqItem, FormField } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S9FormFaq;
  onChange: (data: S9FormFaq) => void;
}

const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", marginTop: 8, marginBottom: 0,
};

const CARD_STYLE: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: 8, padding: 12,
  borderRadius: 6, background: "var(--col-surface-2)", border: "1px solid var(--col-border)",
};

export default function S9FormFaqForm({ data, onChange }: Props) {
  const [tab, setTab] = useState<"faq" | "form">("faq");

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const faqs = data.faqs.map((f, i) => i === index ? { ...f, [field]: value } : f);
    onChange({ ...data, faqs });
  };

  const updateConfig = (key: keyof S9FormFaq["formConfig"], value: string) => {
    onChange({ ...data, formConfig: { ...data.formConfig, [key]: value } });
  };

  const updateField = (index: number, key: keyof FormField, value: string | boolean) => {
    const fields = data.formConfig.fields.map((f, i) => i === index ? { ...f, [key]: value } : f);
    onChange({ ...data, formConfig: { ...data.formConfig, fields } });
  };

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`, label: "", type: "text", placeholder: "", required: false,
    };
    onChange({ ...data, formConfig: { ...data.formConfig, fields: [...data.formConfig.fields, newField] } });
  };

  const removeField = (index: number) => {
    const fields = data.formConfig.fields.filter((_, i) => i !== index);
    onChange({ ...data, formConfig: { ...data.formConfig, fields } });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* タブ切り替え */}
      <div style={{ display: "flex", gap: 4, background: "var(--col-surface)", borderRadius: 8, padding: 3 }}>
        {(["faq", "form"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "5px 0", fontSize: 12, fontWeight: 600, borderRadius: 6,
              border: "none", cursor: "pointer",
              background: tab === t ? "var(--col-bg)" : "transparent",
              color: tab === t ? "var(--col-text)" : "var(--col-text-3)",
              boxShadow: tab === t ? "var(--shadow-outline)" : "none",
              transition: "all 150ms",
            }}
          >
            {t === "faq" ? "FAQ" : "フォーム設定"}
          </button>
        ))}
      </div>

      {/* FAQ タブ */}
      {tab === "faq" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <FieldInput
            label="フォーム見出し"
            value={data.formHeading}
            onChange={(v) => onChange({ ...data, formHeading: v })}
            placeholder="まずは資料請求"
          />
          <p style={SECTION_LABEL_STYLE}>FAQ（5問）</p>
          {data.faqs.map((faq, i) => (
            <div key={i} style={CARD_STYLE}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", margin: 0 }}>Q{i + 1}</p>
              <FieldInput label="質問" value={faq.question} onChange={(v) => updateFaq(i, "question", v)} placeholder="よくある質問" />
              <FieldInput label="回答" value={faq.answer} onChange={(v) => updateFaq(i, "answer", v)} placeholder="回答内容" multiline rows={2} />
            </div>
          ))}
        </div>
      )}

      {/* フォーム設定タブ */}
      {tab === "form" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* 基本設定 */}
          <div style={CARD_STYLE}>
            <p style={SECTION_LABEL_STYLE}>基本設定</p>
            <FieldInput
              label="送信ボタンのテキスト"
              value={data.formConfig.submitLabel}
              onChange={(v) => updateConfig("submitLabel", v)}
              placeholder="資料を請求する"
            />
            <FieldInput
              label="プライバシーポリシー文言"
              value={data.formConfig.privacyLabel}
              onChange={(v) => updateConfig("privacyLabel", v)}
              placeholder="プライバシーポリシーに同意する"
            />
            <FieldInput
              label="送信完了メッセージ"
              value={data.formConfig.successMessage}
              onChange={(v) => updateConfig("successMessage", v)}
              placeholder="お問い合わせありがとうございます。"
              multiline
              rows={2}
            />
          </div>

          {/* 送信先設定 */}
          <div style={CARD_STYLE}>
            <p style={SECTION_LABEL_STYLE}>送信先設定</p>
            <FieldInput
              label="送信先 URL"
              value={data.formConfig.actionUrl}
              onChange={(v) => updateConfig("actionUrl", v)}
              placeholder="https://formspree.io/f/xxxxxxxx"
              hint="空欄の場合はフォームが動作しません。Formspree 等のURLを設定してください。"
            />
            <FieldInput
              label="管理者メールアドレス"
              value={data.formConfig.adminEmail}
              onChange={(v) => updateConfig("adminEmail", v)}
              placeholder="admin@company.co.jp"
            />
            <FieldInput
              label="CC メールアドレス（任意）"
              value={data.formConfig.ccEmail}
              onChange={(v) => updateConfig("ccEmail", v)}
              placeholder="cc@company.co.jp"
            />
          </div>

          {/* 入力項目 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ ...SECTION_LABEL_STYLE, marginTop: 0 }}>入力項目</p>
              <button
                type="button"
                onClick={addField}
                style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 9999,
                  border: "none", cursor: "pointer",
                  background: "var(--col-action)", color: "#fff",
                }}
              >
                + 追加
              </button>
            </div>
            {data.formConfig.fields.map((field, i) => (
              <div key={field.id} style={CARD_STYLE}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", margin: 0 }}>項目 {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeField(i)}
                    style={{ fontSize: 11, color: "var(--col-text-3)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}
                  >
                    削除
                  </button>
                </div>
                <FieldInput
                  label="ラベル"
                  value={field.label}
                  onChange={(v) => updateField(i, "label", v)}
                  placeholder="お名前"
                />
                <FieldInput
                  label="プレースホルダー"
                  value={field.placeholder}
                  onChange={(v) => updateField(i, "placeholder", v)}
                  placeholder="山田 太郎"
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 500, color: "var(--col-text-2)" }}>入力タイプ</label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(i, "type", e.target.value)}
                      style={{
                        background: "var(--col-bg)", border: "1px solid var(--col-border-2)",
                        borderRadius: 8, padding: "8px 12px", fontSize: 13,
                        color: "var(--col-text)", boxShadow: "var(--shadow-inset)",
                      }}
                    >
                      <option value="text">テキスト</option>
                      <option value="email">メール</option>
                      <option value="tel">電話番号</option>
                      <option value="select">セレクトボックス</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, justifyContent: "flex-end" }}>
                    <label style={{ fontSize: 11, fontWeight: 500, color: "var(--col-text-2)" }}>必須</label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", height: 38 }}>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(i, "required", e.target.checked)}
                      />
                      <span style={{ fontSize: 12, color: "var(--col-text-2)" }}>必須</span>
                    </label>
                  </div>
                </div>
                {field.type === "select" && (
                  <FieldInput
                    label="選択肢（改行区切り）"
                    value={(field.options ?? []).join("\n")}
                    onChange={(v) => updateField(i, "options", v.split("\n") as unknown as string)}
                    placeholder={"選択してください\n1〜10名\n11〜50名"}
                    multiline
                    rows={3}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
