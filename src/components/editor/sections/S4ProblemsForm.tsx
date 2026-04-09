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
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: 6, background: "var(--col-surface-2)", border: "1px solid var(--col-border)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", margin: 0 }}>課題カード {i + 1}</p>
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
