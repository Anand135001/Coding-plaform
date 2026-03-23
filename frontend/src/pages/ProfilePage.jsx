import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, CheckCircle, XCircle, Trophy, Flame, BarChart2 } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import Navbar from '../components/ui/Navbar';
import { SectionCard, SectionLabel, ProgressBar, PageLoader } from '../components/ui/Ui';
import '../styles/theme.css';

/* ── Page-specific styles ── */
const styles = `
  .pp-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 16px;
    max-width: 900px;
    margin: 0 auto;
    padding: 28px 16px 60px;
    align-items: start;
  }
  .pp-stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .logout-btn { transition: background 0.15s, color 0.15s, border-color 0.15s; }
  .logout-btn:hover { background: rgba(239,68,68,0.12) !important; color: var(--red) !important; border-color: rgba(239,68,68,0.3) !important; }
  .admin-btn  { transition: background 0.15s, border-color 0.15s; }
  .admin-btn:hover  { background: var(--accent-glow) !important; border-color: rgba(59,130,246,0.4) !important; }

  @media (max-width: 720px) {
    .pp-grid { grid-template-columns: 1fr; }
  }
`;

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user }  = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get('/user/profile');
        setProfile(response.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => { dispatch(logoutUser()); navigate('/login'); };

  if (loading) return <PageLoader label="Loading profile…" />;

  const successRate = parseFloat(profile?.stats?.successRate || 0);
  const solved      = profile?.stats?.solvedCount           || 0;
  const total       = profile?.stats?.totalSubmissions      || 0;
  const accepted    = profile?.stats?.acceptedSubmissions   || 0;
  const failed      = total - accepted;
  const easyCount   = profile?.stats?.difficulty?.easy      || 0;
  const medCount    = profile?.stats?.difficulty?.medium    || 0;
  const hardCount   = profile?.stats?.difficulty?.hard      || 0;

  // SVG ring
  const radius      = 52;
  const circumference = 2 * Math.PI * radius;
  const ringOffset  = circumference - (successRate / 100) * circumference;

  /* ── Navbar right slot ── */
  const navRight = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {user?.role === 'admin' && (
        <NavLink to="/admin" className="admin-btn nav-link-ui" style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--accent)', background: 'var(--accent-glow)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '7px', padding: '5px 13px' }}>
          Admin Panel
        </NavLink>
      )}
      <button onClick={handleLogout} className="logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 500, color: 'var(--text-muted)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '7px', padding: '5px 13px', cursor: 'pointer' }}>
        <LogOut size={13} /> Logout
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface-0)', color: 'var(--text-primary)' }}>
      <style>{styles}</style>

      <Navbar right={navRight} />

      <div className="pp-grid fade-in">

        {/* ══ LEFT COLUMN ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Avatar card */}
          <SectionCard>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: 700, color: '#fff',
                border: '3px solid var(--surface-3)',
              }}>
                {profile.user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{profile.user.name}</h2>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{profile.user.email}</p>
              </div>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-glow)', border: '1px solid rgba(59,130,246,0.2)', padding: '2px 10px', borderRadius: '99px', textTransform: 'capitalize' }}>
                  {profile.user.role}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '2px 10px', borderRadius: '99px' }}>
                  Joined {new Date(profile.user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Success rate ring */}
          <SectionCard>
            <SectionLabel>Success Rate</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                <svg viewBox="0 0 128 128" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--surface-3)" strokeWidth="9" />
                  <circle
                    className="ring-animate"
                    cx="64" cy="64" r={radius}
                    fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    style={{ '--ring-full': circumference, '--ring-offset': ringOffset }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="mono" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{successRate}%</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>success</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '18px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'var(--green)' }}>
                  <CheckCircle size={13} /> {accepted} passed
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'var(--red)' }}>
                  <XCircle size={13} /> {failed} failed
                </span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Stats row */}
          <div className="pp-stats-row">
            {[
              { icon: <Trophy size={14} />,   label: 'Solved',      value: solved,    color: 'var(--green)',        sub: 'problems' },
              { icon: <BarChart2 size={14} />, label: 'Submissions', value: total,     color: 'var(--text-primary)', sub: 'attempts' },
              { icon: <Flame size={14} />,     label: 'Accepted',    value: accepted,  color: 'var(--accent)',       sub: 'correct'  },
            ].map(({ icon, label, value, color, sub }) => (
              <SectionCard key={label} style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <span style={{ color }}>{icon}</span>
                  <span style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
                </div>
                <span className="mono" style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color, display: 'block', lineHeight: 1 }}>{value}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{sub}</span>
              </SectionCard>
            ))}
          </div>

          {/* Submission overview */}
          <SectionCard>
            <SectionLabel>Submission Overview</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: <CheckCircle size={12} />, label: 'Accepted',     count: accepted, color: 'var(--green)', textColor: 'var(--green)' },
                { icon: <XCircle size={12} />,     label: 'Wrong Answer', count: failed,   color: 'var(--red)',   textColor: 'var(--red)'   },
              ].map(({ icon, label, count, color, textColor }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: textColor }}>{icon} {label}</span>
                    <span className="mono" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>{count}</span>
                  </div>
                  <ProgressBar value={count} max={total} color={color} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Problems solved breakdown */}
          <SectionCard>
            <SectionLabel>Problems Solved</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <span className="mono" style={{ fontSize: '40px', fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>{solved}</span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', letterSpacing: '0.04em', marginTop: '4px' }}>TOTAL</span>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                {[
                  { label: 'Easy',   count: easyCount, color: 'var(--green)',  border: 'rgba(34,197,94,0.20)',  bg: 'rgba(34,197,94,0.06)'  },
                  { label: 'Medium', count: medCount,  color: 'var(--yellow)', border: 'rgba(234,179,8,0.20)',  bg: 'rgba(234,179,8,0.06)'  },
                  { label: 'Hard',   count: hardCount, color: 'var(--red)',    border: 'rgba(239,68,68,0.20)',  bg: 'rgba(239,68,68,0.06)'  },
                ].map(({ label, count, color, border, bg }) => (
                  <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '9px', padding: '10px 8px', textAlign: 'center' }}>
                    <span className="mono" style={{ fontSize: '20px', fontWeight: 700, color, display: 'block', lineHeight: 1 }}>{count}</span>
                    <span style={{ fontSize: '10.5px', color, opacity: 0.75, marginTop: '4px', display: 'block', letterSpacing: '0.04em' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Easy',   count: easyCount, color: 'var(--green)'  },
                { label: 'Medium', count: medCount,  color: 'var(--yellow)' },
                { label: 'Hard',   count: hardCount, color: 'var(--red)'    },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
                    <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{count} solved</span>
                  </div>
                  <ProgressBar value={count} max={solved || 1} color={color} />
                </div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;