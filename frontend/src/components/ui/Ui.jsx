export const StatChip = ({ label, value }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'var(--surface-2)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '7px 12px', gap: '2px',
  }}>
    <span className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
      {value}
    </span>
    <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {label}
    </span>
  </div>
);

export const ProgressBar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{
      width: '100%', height: '5px',
      background: 'var(--surface-3)', borderRadius: '99px', overflow: 'hidden',
    }}>
      <div
        className="bar-animate"
        style={{
          height: '100%', borderRadius: '99px',
          background: color,
          '--bar-target': `${pct}%`,
          width: '0%',
        }}
      />
    </div>
  );
};


export const SectionCard = ({ children, style = {} }) => (
  <div
    className="hover-card"
    style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      ...style,
    }}
  >
    {children}
  </div>
);


export const SectionLabel = ({ children }) => (
  <p style={{
    fontSize: '11px', fontWeight: 600,
    letterSpacing: '0.07em', textTransform: 'uppercase',
    color: 'var(--text-muted)', marginBottom: '14px',
  }}>
    {children}
  </p>
);

export const PageLoader = ({ label = 'Loading…' }) => (
  <div className="page-loader">
    <div className="spinner-lg" style={{ borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <span>{label}</span>
  </div>
);