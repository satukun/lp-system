import type { S6Categories, CategoryCard } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S6Categories;
  onChange: (data: S6Categories) => void;
}

export default function S6CategoriesForm({ data, onChange }: Props) {
  const updateCard = (index: number, field: keyof CategoryCard, value: string) => {
    const cards = data.cards.map((c, i) => i === index ? { ...c, [field]: value } : c);
    onChange({ ...data, cards });
  };

  return (
    <div className="flex flex-col gap-4">
      <FieldInput
        label="セクション見出し"
        value={data.sectionHeading}
        onChange={(v) => onChange({ ...data, sectionHeading: v })}
        placeholder="募集できる仕事"
      />
      <div className="grid grid-cols-2 gap-2">
        {data.cards.map((card, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 10, borderRadius: 6, background: "var(--col-surface-2)", border: "1px solid var(--col-border)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", margin: 0 }}>カテゴリ {i + 1}</p>
            <FieldInput
              label="カテゴリ名"
              value={card.name}
              onChange={(v) => updateCard(i, "name", v)}
              placeholder="飲食"
            />
            <FieldInput
              label="補足テキスト"
              value={card.subText}
              onChange={(v) => updateCard(i, "subText", v)}
              placeholder="業務内容など"
              multiline
              rows={2}
            />
          </div>
        ))}
      </div>
      <FieldInput label="CTA1" value={data.cta1} onChange={(v) => onChange({ ...data, cta1: v })} />
      <FieldInput label="CTA2" value={data.cta2} onChange={(v) => onChange({ ...data, cta2: v })} />
    </div>
  );
}
