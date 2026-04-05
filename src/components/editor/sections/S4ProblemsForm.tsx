import type { S4Problems, ProblemCard } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S4Problems;
  onChange: (data: S4Problems) => void;
}

export default function S4ProblemsForm({ data, onChange }: Props) {
  const updateCard = (index: number, field: keyof ProblemCard, value: string) => {
    const cards = data.cards.map((c, i) => i === index ? { ...c, [field]: value } : c);
    onChange({ ...data, cards });
  };

  return (
    <div className="flex flex-col gap-4">
      <FieldInput
        label="セクション見出し"
        value={data.sectionHeading}
        onChange={(v) => onChange({ ...data, sectionHeading: v })}
        placeholder="こんなお悩みありませんか？"
      />
      {data.cards.map((card, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-white/3 border border-white/8">
          <p className="text-xs font-semibold text-blue-300">課題カード {i + 1}</p>
          <FieldInput
            label="見出し"
            value={card.heading}
            onChange={(v) => updateCard(i, "heading", v)}
            placeholder="課題タイトル"
          />
          <FieldInput
            label="説明"
            value={card.description}
            onChange={(v) => updateCard(i, "description", v)}
            placeholder="課題の説明"
            multiline
            rows={2}
          />
        </div>
      ))}
    </div>
  );
}
