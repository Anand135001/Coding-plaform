const TabBar = ({ tabs, active, onChange }) => (
  <div style={{
    background: 'var(--surface-1)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '42px',
    flexShrink: 0,
    overflowX: 'auto',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  }}>
    <style>{`.tabbar-hide-scroll::-webkit-scrollbar { display: none; }`}</style>

    <div
      className="tabbar-hide-scroll"
      style={{
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        flex: 1,
        minWidth: 0,
      }}
    >
      {tabs.map(({ id, label, icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              padding: '0 14px',
              height: '42px',
              fontSize: '12.5px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: 'transparent',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              letterSpacing: '0.01em',
              transition: 'color 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {icon && (
              <span style={{ fontSize: '12px', opacity: isActive ? 1 : 0.5 }}>{icon}</span>
            )}
            {label}
          </button>
        );
      })}
    </div>
  </div>
);

export default TabBar;