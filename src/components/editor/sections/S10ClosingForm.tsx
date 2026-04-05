import type { S10Closing } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S10Closing;
  onChange: (data: S10Closing) => void;
}

export default function S10ClosingForm({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <FieldInput
        label="マイクロコピー"
        value={data.microCopy}
        onChange={(v) => onChange({ ...data, microCopy: v })}
        placeholder="まずは資料請求してみませんか？"
      />
      <FieldInput label="CTA1（プライマリ）" value={data.cta1} onChange={(v) => onChange({ ...data, cta1: v })} />
      <FieldInput label="CTA2（セカンダリ）" value={data.cta2} onChange={(v) => onChange({ ...data, cta2: v })} />
    </div>
  );
}
