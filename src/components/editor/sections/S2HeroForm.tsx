import type { S2Hero } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S2Hero;
  onChange: (data: S2Hero) => void;
}

export default function S2HeroForm({ data, onChange }: Props) {
  const updateBadge = (index: number, value: string) => {
    const badges = [...data.trustBadges];
    badges[index] = value;
    onChange({ ...data, trustBadges: badges });
  };

  return (
    <div className="flex flex-col gap-3">
      <FieldInput
        label="メインコピー"
        value={data.mainCopy}
        onChange={(v) => onChange({ ...data, mainCopy: v })}
        placeholder="キャッチコピーを入力"
        multiline
        rows={2}
      />
      <FieldInput
        label="サブコピー"
        value={data.subCopy}
        onChange={(v) => onChange({ ...data, subCopy: v })}
        placeholder="補足説明を入力"
        multiline
        rows={2}
      />
      <FieldInput
        label="プライマリCTA"
        value={data.ctaText}
        onChange={(v) => onChange({ ...data, ctaText: v })}
        placeholder="無料でアカウント開設"
      />
      <FieldInput
        label="セカンダリCTA"
        value={data.secondaryCtaText}
        onChange={(v) => onChange({ ...data, secondaryCtaText: v })}
        placeholder="資料をダウンロード"
      />
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-300">信頼バッジ（3つ）</p>
        {data.trustBadges.map((badge, i) => (
          <FieldInput
            key={i}
            label={`バッジ ${i + 1}`}
            value={badge}
            onChange={(v) => updateBadge(i, v)}
            placeholder="例：応募課金0円"
          />
        ))}
      </div>
    </div>
  );
}
