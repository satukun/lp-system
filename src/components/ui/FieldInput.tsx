interface FieldInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}

export default function FieldInput({ label, value, onChange, placeholder, multiline = false, rows = 3, hint }: FieldInputProps) {
  const baseClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/60 focus:bg-white/8 transition-all duration-150 resize-none";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-300">{label}</label>
      {multiline ? (
        <textarea
          className={baseClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          className={baseClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
