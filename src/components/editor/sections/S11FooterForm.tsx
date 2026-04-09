import type { S11Footer } from "@/lib/types";
import FieldInput from "@/components/ui/FieldInput";

interface Props {
  data: S11Footer;
  onChange: (data: S11Footer) => void;
}

export default function S11FooterForm({ data, onChange }: Props) {
  const updateLink = (index: number, value: string) => {
    const links = [...data.links];
    links[index] = value;
    onChange({ ...data, links });
  };

  return (
    <div className="flex flex-col gap-3">
      <p style={{ fontSize: 11, color: "var(--col-text-3)", margin: 0 }}>フッターリンク</p>
      {data.links.map((link, i) => (
        <FieldInput
          key={i}
          label={`リンク ${i + 1}`}
          value={link}
          onChange={(v) => updateLink(i, v)}
          placeholder="リンクテキスト"
        />
      ))}
      <FieldInput
        label="コピーライト"
        value={data.copyright}
        onChange={(v) => onChange({ ...data, copyright: v })}
        placeholder="© 2025 サービス名, Inc."
      />
    </div>
  );
}
