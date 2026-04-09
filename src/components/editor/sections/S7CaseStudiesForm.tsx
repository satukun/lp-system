import type { S7CaseStudies, CaseCard } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S7CaseStudies;
  onChange: (data: S7CaseStudies) => void;
}

export default function S7CaseStudiesForm({ data, onChange }: Props) {
  const updateCard = (index: number, field: keyof CaseCard, value: string) => {
    const cards = data.cards.map((c, i) => i === index ? { ...c, [field]: value } : c);
    onChange({ ...data, cards });
  };

  return (
    <div className="flex flex-col gap-4">
      <FieldInput
        label="セクション見出し"
        value={data.sectionHeading}
        onChange={(v) => onChange({ ...data, sectionHeading: v })}
        placeholder="導入事例"
      />
      {data.cards.map((card, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: 6, background: "var(--col-surface-2)", border: "1px solid var(--col-border)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)", margin: 0 }}>事例 {i + 1}</p>
          <FieldInput
            label="企業名"
            value={card.companyName}
            onChange={(v) => updateCard(i, "companyName", v)}
            placeholder="株式会社〇〇"
          />
          <FieldInput
            label="要約"
            value={card.summary}
            onChange={(v) => updateCard(i, "summary", v)}
            placeholder="課題と成果の要約"
            multiline
            rows={3}
          />
        </div>
      ))}
      <FieldInput label="導線リンクテキスト" value={data.linkText} onChange={(v) => onChange({ ...data, linkText: v })} />
      <FieldInput label="CTA1" value={data.cta1} onChange={(v) => onChange({ ...data, cta1: v })} />
      <FieldInput label="CTA2" value={data.cta2} onChange={(v) => onChange({ ...data, cta2: v })} />
    </div>
  );
}
