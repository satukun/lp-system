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
        <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-white/3 border border-white/8">
          <p className="text-xs font-semibold text-emerald-300">特徴カード {i + 1}</p>
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
