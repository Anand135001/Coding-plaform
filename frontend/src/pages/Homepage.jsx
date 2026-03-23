import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/ui/Navbar';
import { DifficultyBadge, TagBadge } from '../components/ui/Badges';
import { PageLoader } from '../components/ui/Ui';
import '../styles/theme.css';

/* ── Page-specific styles ── */
const styles = `
  .hp-select {
    appearance: none; -webkit-appearance: none;
    background: var(--surface-2) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23454c5e'/%3E%3C/svg%3E") no-repeat right 10px center;
    border: 1px solid var(--border); border-radius: 8px;
    color: var(--text-secondary); font-size: 12.5px;
    padding: 7px 28px 7px 12px; cursor: pointer; outline: none;
    transition: border-color 0.15s, color 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .hp-select:hover  { border-color: rgba(255,255,255,0.14); color: var(--text-primary); }
  .hp-select:focus  { border-color: var(--accent); }
  .hp-select option { background: var(--surface-2); }

  .prob-row { transition: background 0.15s; cursor: pointer; }
  .prob-row:hover { background: var(--surface-2) !important; }

  .stat-card { transition: border-color 0.2s, transform 0.2s; }
  .stat-card:hover { border-color: rgba(255,255,255,0.10) !important; transform: translateY(-1px); }

  .prob-grid-header { display: grid; grid-template-columns: 40px 1fr 100px 90px 80px; padding: 9px 16px; }
  .prob-grid-row    { display: grid; grid-template-columns: 40px 1fr 100px 90px 80px; padding: 14px 16px; align-items: center; }
  .hp-stats         { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }

  @media (max-width: 640px) {
    .prob-grid-header          { display: none; }
    .prob-grid-row             { display: flex; flex-direction: column; gap: 8px; padding: 14px; }
    .prob-row-num              { display: none; }
    .hp-filters                { flex-direction: column !important; }
    .hp-select                 { width: 100%; }
  }
`;

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems]               = useState([]);
  const [solvedProblems, setSolvedProblems]   = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [filters, setFilters] = useState({ difficulty: 'all', tag: 'all', status: 'all' });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (err) {
        console.error('Error fetching problems:', err);
      } finally {
        setLoadingProblems(false);
      }
    };
    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (err) {
        console.error('Error fetching solved problems:', err);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const filteredProblems = problems.filter(problem => {
    const diffMatch   = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch    = filters.tag === 'all'        || problem.tags === filters.tag;
    const isSolved    = solvedProblems.some(sp => sp._id === problem._id);
    const statusMatch = filters.status === 'all'
      || (filters.status === 'solved'   && isSolved)
      || (filters.status === 'unsolved' && !isSolved);
    return diffMatch && tagMatch && statusMatch;
  });

  const navRight = user ? (
    <NavLink to="/profile" className="nav-link-ui" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 700, color: '#fff',
        border: '2px solid var(--surface-3)',
      }}>
        {user.firstname?.[0]?.toUpperCase()}
      </div>
      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {user.firstname}
      </span>
    </NavLink>
  ) : (
    <div style={{ display: 'flex', gap: '8px' }}>
      <NavLink to="/login" className="nav-link-ui" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', padding: '5px 12px', borderRadius: '7px', border: '1px solid var(--border)' }}>
        Login
      </NavLink>
      <NavLink to="/register" style={{ fontSize: '13px', fontWeight: 600, color: '#fff', background: 'var(--accent)', padding: '5px 14px', borderRadius: '7px', textDecoration: 'none' }}>
        Sign up
      </NavLink>
    </div>
  );

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface-0)', color: 'var(--text-primary)' }}>
      <style>{styles}</style>

      <Navbar right={navRight} />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* Stats row — logged-in only */}
        {user && (
          <div className="hp-stats slide-up">
            {[
              { label: 'Total',  value: problems.length,                                      color: 'var(--text-primary)' },
              { label: 'Solved', value: solvedProblems.length,                                color: 'var(--green)'        },
              { label: 'Easy',   value: problems.filter(p => p.difficulty === 'easy').length, color: 'var(--yellow)'       },
            ].map(({ label, value, color }) => (
              <div key={label} className="stat-card" style={{
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: '4px',
              }}>
                <span style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, color }}>{value}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="hp-filters" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <select className="hp-select" value={filters.status} onChange={e => setFilter('status', e.target.value)}>
            <option value="all">All Problems</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
          <select className="hp-select" value={filters.difficulty} onChange={e => setFilter('difficulty', e.target.value)}>
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select className="hp-select" value={filters.tag} onChange={e => setFilter('tag', e.target.value)}>
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Problem list */}
        {loadingProblems ? (
          <PageLoader label="Loading problems…" />
        ) : filteredProblems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '64px 20px', background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <span className="pulse-opacity" style={{ fontSize: '36px' }}>◎</span>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No problems match your filters.</p>
            <button
              onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all' })}
              style={{ fontSize: '12.5px', color: 'var(--accent)', background: 'var(--accent-glow)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '7px', padding: '6px 16px', cursor: 'pointer' }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="slide-up" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Header */}
            <div className="prob-grid-header" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              {['#', 'Title', 'Difficulty', 'Tag', 'Status'].map(h => (
                <span key={h} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {filteredProblems.map((problem, index) => {
              const isSolved = solvedProblems.some(sp => sp._id === problem._id);
              return (
                <NavLink key={problem._id} to={`/problem/${problem._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    className="prob-row prob-grid-row"
                    style={{ background: 'transparent', borderBottom: index < filteredProblems.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <span className="prob-row-num mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{index + 1}</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {problem.title}
                    </span>
                    <span><DifficultyBadge difficulty={problem.difficulty} /></span>
                    <span><TagBadge tag={problem.tags} /></span>
                    <span>
                      {isSolved ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 600, color: 'var(--green)' }}>
                          <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Solved
                        </span>
                      ) : (
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        )}

        {!loadingProblems && filteredProblems.length > 0 && (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
            Showing {filteredProblems.length} of {problems.length} problems
          </p>
        )}
      </div>
    </div>
  );
}

export default Homepage;