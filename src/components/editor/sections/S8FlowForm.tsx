import type { S8Flow, FlowStep } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S8Flow;
  onChange: (data: S8Flow) => void;
}

export default function S8FlowForm({ data, onChange }: Props) {
  const updateStep = (index: number, field: keyof FlowStep, value: string) => {
    const steps = data.steps.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onChange({ ...data, steps });
  };

  return (
    <div className="flex flex-col gap-4">
      <FieldInput
        label="セクション見出し"
        value={data.sectionHeading}
        onChange={(v) => onChange({ ...data, sectionHeading: v })}
        placeholder="お申込みの流れ"
      />
      {data.steps.map((step, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: 6, background: "var(--col-surface-2)", border: "1px solid var(--col-border)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", margin: 0 }}>ステップ {i + 1}</p>
          <FieldInput
            label="タイトル"
            value={step.title}
            onChange={(v) => updateStep(i, "title", v)}
            placeholder="ステップタイトル"
          />
          <FieldInput
            label="説明"
            value={step.description}
            onChange={(v) => updateStep(i, "description", v)}
            placeholder="ステップの説明"
            multiline
            rows={2}
          />
        </div>
      ))}
    </div>
  );
}
