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
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    color: "var(--col-text)",
    outline: "none",
    resize: multiline ? "vertical" : "none",
    fontFamily: "inherit",
    lineHeight: 1.6,
    letterSpacing: "0.01em",
    boxShadow: "var(--shadow-inset)",
    transition: "border-color 150ms, box-shadow 150ms",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: "var(--col-text-2)", letterSpacing: "0.03em" }}>{label}</label>
      {multiline ? (
        <textarea
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
            e.currentTarget.style.boxShadow = "var(--shadow-inset), 0 0 0 3px rgba(147,197,253,0.3)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--col-border-2)";
            e.currentTarget.style.boxShadow = "var(--shadow-inset)";
          }}
        />
      ) : (
        <input
          type="text"
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
            e.currentTarget.style.boxShadow = "var(--shadow-inset), 0 0 0 3px rgba(147,197,253,0.3)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--col-border-2)";
            e.currentTarget.style.boxShadow = "var(--shadow-inset)";
          }}
        />
      )}
      {hint && <p style={{ fontSize: 11, color: "var(--col-text-3)", margin: 0, letterSpacing: "0.01em" }}>{hint}</p>}
    </div>
  );
}
