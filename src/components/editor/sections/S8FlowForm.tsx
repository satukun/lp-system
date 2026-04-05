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
        <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-white/3 border border-white/8">
          <p className="text-xs font-semibold text-cyan-300">ステップ {i + 1}</p>
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
