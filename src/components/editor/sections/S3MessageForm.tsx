import type { S3Message } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S3Message;
  onChange: (data: S3Message) => void;
}

export default function S3MessageForm({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <FieldInput
        label="見出し"
        value={data.heading}
        onChange={(v) => onChange({ ...data, heading: v })}
        placeholder="サービス概要の見出し"
        multiline
        rows={3}
      />
      <FieldInput
        label="本文"
        value={data.body}
        onChange={(v) => onChange({ ...data, body: v })}
        placeholder="サービス説明（1〜3文）"
        multiline
        rows={3}
      />
    </div>
  );
}
