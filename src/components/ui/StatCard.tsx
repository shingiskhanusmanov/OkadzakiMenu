interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  accent?: boolean;
}

export const StatCard = ({ value, label, icon, accent }: StatCardProps) => (
  <div
    className="card-sm"
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      borderColor: accent ? 'rgba(232,184,109,0.3)' : undefined,
      background: accent ? 'rgba(232,184,109,0.05)' : undefined,
    }}
  >
    {icon && (
      <div style={{ color: 'var(--color-gold)', marginBottom: '0.25rem' }}>{icon}</div>
    )}
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);
