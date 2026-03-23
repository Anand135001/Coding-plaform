const diffConfig = {
  easy:   { label: 'Easy',   color: '#22c55e', bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.20)'  },
  medium: { label: 'Medium', color: '#eab308', bg: 'rgba(234,179,8,0.10)',  border: 'rgba(234,179,8,0.20)'  },
  hard:   { label: 'Hard',   color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.20)'  },
};

export const DifficultyBadge = ({ difficulty }) => {
  const cfg = diffConfig[difficulty?.toLowerCase()] || {
    label: difficulty, color: '#888',
    bg: 'rgba(136,136,136,0.1)', border: 'rgba(136,136,136,0.2)',
  };
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600,
      letterSpacing: '0.05em', textTransform: 'uppercase',
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      padding: '2px 9px', borderRadius: '99px',
    }}>
      {cfg.label}
    </span>
  );
};

export const TagBadge = ({ tag }) => (
  <span style={{
    fontSize: '11px', fontWeight: 500,
    color: 'var(--accent)', background: 'var(--accent-glow)',
    border: '1px solid rgba(59,130,246,0.2)',
    padding: '2px 9px', borderRadius: '99px',
  }}>
    {tag}
  </span>
);


const statusConfig = {
  accepted: { label: 'Accepted', color: 'var(--green)',  bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.20)'  },
  wrong:    { label: 'Wrong',    color: 'var(--red)',    bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.20)'  },
  error:    { label: 'Error',    color: 'var(--yellow)', bg: 'rgba(234,179,8,0.10)',  border: 'rgba(234,179,8,0.20)'  },
  pending:  { label: 'Pending',  color: 'var(--accent)', bg: 'var(--accent-glow)',    border: 'rgba(59,130,246,0.20)' },
};

export const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || {
    label: status, color: 'var(--text-muted)',
    bg: 'var(--surface-3)', border: 'var(--border)',
  };
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em',
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      padding: '2px 10px', borderRadius: '99px', textTransform: 'capitalize',
    }}>
      {cfg.label}
    </span>
  );
};