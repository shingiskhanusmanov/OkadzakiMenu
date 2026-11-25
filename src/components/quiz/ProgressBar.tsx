interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const pct = (current / total) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div className="progress-bar-track" style={{ flex: 1 }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span
        style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          whiteSpace: 'nowrap',
          minWidth: '3.5rem',
          textAlign: 'right',
        }}
      >
        {current} / {total}
      </span>
    </div>
  );
};
