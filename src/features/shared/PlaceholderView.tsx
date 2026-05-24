interface PlaceholderViewProps {
  icon: string;
  label: string;
  description: string;
  badges?: Array<{ label: string; color: string }>;
  actions?: Array<{ label: string; onClick: () => void }>;
}

export function PlaceholderView({ icon, label, description, badges, actions }: PlaceholderViewProps) {
  return (
    <div className="placeholder-view fade-in">
      <div className="placeholder-icon">{icon}</div>
      <div className="placeholder-label">{label}</div>
      <div className="placeholder-desc">{description}</div>
      {badges && badges.length > 0 && (
        <div className="placeholder-badges">
          {badges.map((b, i) => (
            <span key={i} className={`tag ${b.color}`}>{b.label}</span>
          ))}
        </div>
      )}
      {actions && actions.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          {actions.map((a, i) => (
            <button key={i} className="topbar-btn primary" onClick={a.onClick}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
