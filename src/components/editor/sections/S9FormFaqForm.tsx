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
      <p className="text-xs font-semibold text-slate-300 mt-1">FAQ（5問）</p>
      {data.faqs.map((faq, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-white/3 border border-white/8">
          <p className="text-xs font-semibold text-rose-300">Q{i + 1}</p>
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
