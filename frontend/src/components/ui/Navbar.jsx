import { NavLink } from 'react-router';

const Navbar = ({ right }) => (
  <nav style={{
    position: 'sticky', top: 0, zIndex: 100,
    height: '52px',
    background: 'rgba(13,15,18,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center',
    padding: '0 20px', justifyContent: 'space-between',
    flexShrink: 0,
  }}>
    {/* Brand — always on the left */}
    <NavLink to="/" className="nav-link-ui" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
      <div style={{
        width: '26px', height: '26px', background: 'var(--accent)',
        borderRadius: '7px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '12px', fontWeight: 700,
        color: '#fff', flexShrink: 0,
      }}>
        {'<>'}
      </div>
      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
        CodeRoots
      </span>
    </NavLink>

    {/* Right slot — profile icon, logout button, etc. */}
    {right && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {right}
      </div>
    )}
  </nav>
);

export default Navbar;