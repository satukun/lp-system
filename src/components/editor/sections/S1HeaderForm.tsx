import type { S1Header } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S1Header;
  onChange: (data: S1Header) => void;
}

export default function S1HeaderForm({ data, onChange }: Props) {
  const updateMenuItem = (index: number, value: string) => {
    const items = [...data.menuItems];
    items[index] = value;
    onChange({ ...data, menuItems: items });
  };

  return (
    <div className="flex flex-col gap-3">
      <p style={{ fontSize: 11, color: "var(--col-text-3)", margin: 0 }}>メニュー項目（最大4個）</p>
      {data.menuItems.map((item, i) => (
        <FieldInput
          key={i}
          label={`メニュー ${i + 1}`}
          value={item}
          onChange={(v) => updateMenuItem(i, v)}
          placeholder="メニュー項目"
        />
      ))}
      <FieldInput
        label="CTA文言"
        value={data.ctaText}
        onChange={(v) => onChange({ ...data, ctaText: v })}
        placeholder="無料でアカウント開設"
      />
    </div>
  );
}
