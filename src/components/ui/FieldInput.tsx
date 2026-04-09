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
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--col-bg)",
    border: "1px solid var(--col-border-2)",
    borderRadius: 6,
    padding: "7px 10px",
    fontSize: 13,
    color: "var(--col-text)",
    outline: "none",
    resize: multiline ? "vertical" : "none",
    fontFamily: "inherit",
    lineHeight: 1.6,
    transition: "border-color 150ms",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--col-text-2)" }}>{label}</label>
      {multiline ? (
        <textarea
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--col-border-2)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--col-border-2)")}
        />
      ) : (
        <input
          type="text"
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(55,53,47,0.4)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--col-border-2)")}
        />
      )}
      {hint && <p style={{ fontSize: 11, color: "var(--col-text-3)", margin: 0 }}>{hint}</p>}
    </div>
  );
}
