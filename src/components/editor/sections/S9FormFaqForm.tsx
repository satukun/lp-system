import type { S9FormFaq, FaqItem } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S9FormFaq;
  onChange: (data: S9FormFaq) => void;
}

export default function S9FormFaqForm({ data, onChange }: Props) {
  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const faqs = data.faqs.map((f, i) => i === index ? { ...f, [field]: value } : f);
    onChange({ ...data, faqs });
  };

  return (
    <div className="flex flex-col gap-4">
      <FieldInput
        label="フォーム見出し"
        value={data.formHeading}
        onChange={(v) => onChange({ ...data, formHeading: v })}
        placeholder="まずは資料請求"
      />
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", marginTop: 4, marginBottom: 0 }}>FAQ（5問）</p>
      {data.faqs.map((faq, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: 6, background: "var(--col-surface-2)", border: "1px solid var(--col-border)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", margin: 0 }}>Q{i + 1}</p>
          <FieldInput
            label="質問"
            value={faq.question}
            onChange={(v) => updateFaq(i, "question", v)}
            placeholder="よくある質問"
          />
          <FieldInput
            label="回答"
            value={faq.answer}
            onChange={(v) => updateFaq(i, "answer", v)}
            placeholder="回答内容"
            multiline
            rows={2}
          />
        </div>
      ))}
    </div>
  );
}
