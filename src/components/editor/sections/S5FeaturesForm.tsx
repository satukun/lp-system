import type { S5Features, FeatureCard } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S5Features;
  onChange: (data: S5Features) => void;
}

export default function S5FeaturesForm({ data, onChange }: Props) {
  const updateCard = (index: number, field: keyof FeatureCard, value: string) => {
    const cards = data.cards.map((c, i) => i === index ? { ...c, [field]: value } : c);
    onChange({ ...data, cards });
  };

  return (
    <div className="flex flex-col gap-4">
      <FieldInput
        label="セクション見出し"
        value={data.sectionHeading}
        onChange={(v) => onChange({ ...data, sectionHeading: v })}
        placeholder="選ばれる理由"
      />
      {data.cards.map((card, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: 6, background: "var(--col-surface-2)", border: "1px solid var(--col-border)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", margin: 0 }}>特徴カード {i + 1}</p>
          <FieldInput
            label="ポイントラベル"
            value={card.pointLabel}
            onChange={(v) => updateCard(i, "pointLabel", v)}
            placeholder="POINT1"
          />
          <FieldInput
            label="タイトル"
            value={card.title}
            onChange={(v) => updateCard(i, "title", v)}
            placeholder="特徴タイトル"
          />
          <FieldInput
            label="説明"
            value={card.description}
            onChange={(v) => updateCard(i, "description", v)}
            placeholder="特徴の説明"
            multiline
            rows={2}
          />
        </div>
      ))}
    </div>
  );
}
