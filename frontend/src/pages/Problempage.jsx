import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import SubmissionHistory from '../components/SubmissionHistory';
import Chatbot from '../components/ChatbBot';
import Editorial from '../components/EditorialVideo';
import TabBar from '../components/ui/Tabbar';
import { DifficultyBadge, TagBadge, StatusBadge } from '../components/ui/Badges';
import { StatChip, PageLoader } from '../components/ui/Ui';
import '../styles/theme.css';

/* ── Page-specific styles ── */
const styles = `
  .prob-page { height: 100dvh; display: flex; flex-direction: column; background: var(--surface-0); color: var(--text-primary); overflow: hidden; }

  .split-layout { display: flex; flex-direction: row; flex: 1; overflow: hidden; gap: 1px; background: var(--border); }
  .left-panel  { width: 48%; display: flex; flex-direction: column; background: var(--surface-0); overflow: hidden; }
  .right-panel { flex: 1;    display: flex; flex-direction: column; background: var(--surface-0); overflow: hidden; }
  .mobile-switcher { display: none; }

  .tc-card { transition: border-color 0.2s; }

  .editor-wrap { flex: 1; overflow: hidden; }

  @media (max-width: 767px) {
    .split-layout { flex-direction: column; gap: 0; background: var(--surface-0); position: relative; }
    .left-panel, .right-panel { width: 100%; flex: 1; position: absolute; inset: 0; transition: opacity 0.2s, transform 0.2s; }
    .panel-hidden { opacity: 0; pointer-events: none; transform: translateX(20px); }
    .mobile-switcher { display: flex; flex-shrink: 0; height: 44px; background: var(--surface-1); border-bottom: 1px solid var(--border); }
    .mobile-switch-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; color: var(--text-muted); border-bottom: 2px solid transparent; transition: color 0.15s, border-color 0.15s; font-family: 'DM Sans', sans-serif; }
    .mobile-switch-btn.msb-active { color: var(--text-primary); border-bottom-color: var(--accent); background: var(--surface-0); }
    .editor-wrap { height: 50vw !important; min-height: 220px !important; max-height: 360px !important; flex: none !important; }
  }
`;

/* ── TestCaseCard ── */
const TestCaseCard = ({ tc, index, passed }) => (
  <div className="tc-card" style={{
    background: 'var(--surface-2)',
    border: `1px solid ${passed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
    borderRadius: '8px', padding: '12px 14px',
    display: 'flex', flexDirection: 'column', gap: '8px',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Case {index + 1}</span>
      <span style={{ fontSize: '11px', fontWeight: 600, color: passed ? 'var(--green)' : 'var(--red)', background: passed ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)', padding: '2px 8px', borderRadius: '99px' }}>
        {passed ? '✓ Passed' : '✗ Failed'}
      </span>
    </div>
    {[['Input', tc.stdin], ['Expected', tc.expected_output], ['Output', tc.stdout]].map(([k, v]) => (
      <div key={k} style={{ display: 'grid', gridTemplateColumns: '68px 1fr', gap: '6px', alignItems: 'start' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, paddingTop: '2px' }}>{k}</span>
        <span className="mono" style={{ fontSize: '12px', color: 'var(--text-primary)', background: 'var(--surface-3)', padding: '4px 8px', borderRadius: '5px', wordBreak: 'break-all' }}>
          {v || '—'}
        </span>
      </div>
    ))}
  </div>
);

/* ── Main Page ── */
const ProblemPage = () => {
  const [problem, setProblem]               = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode]                     = useState({ javascript: '', java: '', cpp: '' });
  const [loading, setLoading]               = useState(false);
  const [runResult, setRunResult]           = useState(null);
  const [submitResult, setSubmitResult]     = useState(null);
  const [activeLeftTab, setActiveLeftTab]   = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [mobilePanel, setMobilePanel]       = useState('left');
  const editorRef = useRef(null);
  const { problemId } = useParams();
  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(response.data);
        const savedCode = localStorage.getItem(`code_${problemId}`);
        if (savedCode) {
          setCode(JSON.parse(savedCode));
        } else {
          const m = { javascript: '', java: '', cpp: '' };
          response.data.startCode.forEach(sc => {
            const lang = sc.language.toLowerCase();
            if (lang === 'c++')         m.cpp        = sc.initialCode;
            else if (lang === 'javascript') m.javascript = sc.initialCode;
            else if (lang === 'java')    m.java       = sc.initialCode;
          });
          setCode(m);
        }
      } catch (err) {
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  const handleEditorChange = (value) => setCode(prev => ({ ...prev, [selectedLanguage]: value || '' }));

  useEffect(() => {
    const hasCode = code.javascript?.trim() || code.java?.trim() || code.cpp?.trim();
    if (hasCode) localStorage.setItem(`code_${problemId}`, JSON.stringify(code));
  }, [code, problemId]);

  const handleRun = async () => {
    setLoading(true); setRunResult(null);
    try {
      const res = await axiosClient.post(`/submission/run/${problemId}`, { code: code[selectedLanguage], language: selectedLanguage });
      setRunResult(res.data);
    } catch {
      setRunResult({ success: false, testCases: [], error: 'Internal server error' });
    }
    setLoading(false); setActiveRightTab('testcase'); setMobilePanel('right');
  };

  const handleSubmitCode = async () => {
    setLoading(true); setSubmitResult(null);
    try {
      const res = await axiosClient.post(`/submission/submit/${problemId}`, { code: code[selectedLanguage], language: selectedLanguage });
      setSubmitResult(res.data);
    } catch {
      setSubmitResult(null);
    }
    setLoading(false); setActiveRightTab('result'); setMobilePanel('right');
  };

  const getMonacoLang = (lang) => ({ cpp: 'cpp', java: 'java', javascript: 'javascript' }[lang] || 'javascript');
  const langLabels = { javascript: 'JS', java: 'Java', cpp: 'C++' };

  const leftTabs  = [
    { id: 'description', label: 'Description', icon: '≡' },
    { id: 'editorial',   label: 'Editorial',   icon: '▶' },
    { id: 'solutions',   label: 'Solutions',   icon: '⌨' },
    { id: 'submissions', label: 'Submissions', icon: '↑' },
    { id: 'chatbot',     label: 'Root AI',     icon: '✦' },
  ];
  const rightTabs = [
    { id: 'code',     label: 'Code',     icon: '{ }' },
    { id: 'testcase', label: 'Testcase', icon: '⚡'  },
    { id: 'result',   label: 'Result',   icon: '◎'  },
  ];

  if (loading && !problem) return <PageLoader label="Loading problem…" />;

  return (
    <div className="prob-page">
      <style>{styles}</style>

      {/* Top bar */}
      <div style={{ height: '48px', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '10px', flexShrink: 0, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{ width: '22px', height: '22px', background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {'<>'}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {problem?.title || 'Problem'}
          </span>
        </div>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <div className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Running…</span>
          </div>
        )}
      </div>

      {/* Mobile switcher */}
      <div className="mobile-switcher">
        <button className={`mobile-switch-btn ${mobilePanel === 'left' ? 'msb-active' : ''}`} onClick={() => setMobilePanel('left')}>≡ Problem</button>
        <button className={`mobile-switch-btn ${mobilePanel === 'right' ? 'msb-active' : ''}`} onClick={() => setMobilePanel('right')}>{'{ }'} Code</button>
      </div>

      {/* Split layout */}
      <div className="split-layout">

        {/* ═══ LEFT ═══ */}
        <div className={`left-panel ${mobilePanel !== 'left' ? 'panel-hidden' : ''}`}>
          <TabBar tabs={leftTabs} active={activeLeftTab} onChange={setActiveLeftTab} />

          <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {problem && (
              <>
                {activeLeftTab === 'description' && (
                  <div className="slide-up">
                    <h1 style={{ fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.35 }}>
                      {problem.title}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      <DifficultyBadge difficulty={problem.difficulty} />
                      <TagBadge tag={problem.tags} />
                    </div>
                    <div style={{ height: '1px', background: 'var(--border)', marginBottom: '16px' }} />
                    <p style={{ fontSize: '13.5px', lineHeight: 1.75, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginBottom: '22px' }}>
                      {problem.description}
                    </p>
                    <h3 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Examples</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {problem.visibleTestCases.map((ex, i) => (
                        <div key={i} style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ padding: '7px 14px', borderBottom: '1px solid var(--border)', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                            Example {i + 1}
                          </div>
                          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[['Input', ex.input], ['Output', ex.output], ['Explanation', ex.explanation]].map(([k, v]) => (
                              <div key={k} style={{ display: 'grid', gridTemplateColumns: '82px 1fr', gap: '6px' }}>
                                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)' }}>{k}</span>
                                <span className="mono" style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5, wordBreak: 'break-word' }}>{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeLeftTab === 'editorial' && (
                  <div className="slide-up">
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                  </div>
                )}

                {activeLeftTab === 'solutions' && (
                  <div className="slide-up">
                    <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>Solutions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {problem.referenceSolution?.map((sol, i) => (
                        <div key={i} style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{problem?.title}</span>
                            <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '99px', background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid rgba(59,130,246,0.2)', fontWeight: 500 }}>{sol?.language}</span>
                          </div>
                          <pre className="mono custom-scroll" style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)', overflowX: 'auto', margin: 0, lineHeight: 1.65, background: 'var(--surface-0)' }}>
                            <code>{sol?.completeCode}</code>
                          </pre>
                        </div>
                      )) || (
                        <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', background: 'var(--surface-1)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          Solutions available after solving.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeLeftTab === 'submissions' && (
                  <div className="slide-up">
                    <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>My Submissions</h2>
                    <SubmissionHistory problemId={problemId} />
                  </div>
                )}

                {activeLeftTab === 'chatbot' && (
                  <div className="slide-up">
                    <Chatbot problem={problem} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ═══ RIGHT ═══ */}
        <div className={`right-panel ${mobilePanel !== 'right' ? 'panel-hidden' : ''}`}>
          <TabBar tabs={rightTabs} active={activeRightTab} onChange={setActiveRightTab} />

          {/* CODE */}
          {activeRightTab === 'code' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 14px', borderBottom: '1px solid var(--border)', background: 'var(--surface-1)', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '3px', background: 'var(--surface-0)', borderRadius: '7px', padding: '3px' }}>
                  {['javascript', 'java', 'cpp'].map(lang => (
                    <button key={lang} className="lang-btn mono" onClick={() => setSelectedLanguage(lang)} style={{ padding: '4px 12px', borderRadius: '5px', fontSize: '12px', fontWeight: selectedLanguage === lang ? 600 : 400, color: selectedLanguage === lang ? 'var(--text-primary)' : 'var(--text-muted)', background: selectedLanguage === lang ? 'var(--surface-2)' : 'transparent', border: selectedLanguage === lang ? '1px solid var(--border)' : '1px solid transparent', cursor: 'pointer' }}>
                      {langLabels[lang]}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto-saved</span>
              </div>

              <div className="editor-wrap">
                <Editor
                  height="100%"
                  language={getMonacoLang(selectedLanguage)}
                  value={code[selectedLanguage] || ''}
                  onChange={handleEditorChange}
                  onMount={(editor) => { editorRef.current = editor; }}
                  theme="vs-dark"
                  options={{
                    fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontLigatures: true,
                    minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true,
                    tabSize: 2, wordWrap: 'on', lineNumbers: 'on', glyphMargin: false, folding: true,
                    lineDecorationsWidth: 6, lineNumbersMinChars: 3, renderLineHighlight: 'line',
                    cursorStyle: 'line', cursorBlinking: 'smooth', mouseWheelZoom: true,
                    padding: { top: 14, bottom: 14 },
                    scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                  }}
                />
              </div>

              <div style={{ padding: '9px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <button onClick={() => { setActiveRightTab('testcase'); setMobilePanel('right'); }} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 11px', cursor: 'pointer' }}>
                  ⚡ Console
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="action-btn" onClick={handleRun} disabled={loading} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '7px', padding: '6px 18px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {loading ? <span className="spinner" /> : '▷'} Run
                  </button>
                  <button className="action-btn" onClick={handleSubmitCode} disabled={loading} style={{ fontSize: '13px', fontWeight: 600, color: '#fff', background: 'var(--accent)', border: 'none', borderRadius: '7px', padding: '6px 20px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 2px 12px rgba(59,130,246,0.28)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {loading ? <span className="spinner" /> : '↑'} Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TESTCASE */}
          {activeRightTab === 'testcase' && (
            <div className="custom-scroll slide-up" style={{ flex: 1, padding: '18px', overflowY: 'auto' }}>
              {runResult ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{runResult.success ? '✅' : '❌'}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: runResult.success ? 'var(--green)' : 'var(--red)' }}>
                          {runResult.success ? 'All test cases passed' : 'Some test cases failed'}
                        </div>
                        {runResult.error && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{runResult.error}</div>}
                      </div>
                    </div>
                    {runResult.success && (
                      <div style={{ display: 'flex', gap: '7px' }}>
                        <StatChip label="Runtime" value={`${runResult.runtime}s`} />
                        <StatChip label="Memory"  value={`${runResult.memory} KB`} />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {(runResult.testCases || []).map((tc, i) => (
                      <TestCaseCard key={i} tc={tc} index={i} passed={runResult.success || tc.status?.id === 3} />
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', opacity: 0.35 }}>⚡</div>
                  <p style={{ fontSize: '13px' }}>Click <strong style={{ color: 'var(--text-secondary)' }}>Run</strong> to test your code</p>
                </div>
              )}
            </div>
          )}

          {/* RESULT */}
          {activeRightTab === 'result' && (
            <div className="custom-scroll slide-up" style={{ flex: 1, padding: '18px', overflowY: 'auto' }}>
              {submitResult ? (
                <div>
                  <div style={{ background: submitResult.accepted ? 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03))' : 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.03))', border: `1px solid ${submitResult.accepted ? 'rgba(34,197,94,0.20)' : 'rgba(239,68,68,0.20)'}`, borderRadius: '12px', padding: '22px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '26px', marginBottom: '8px' }}>{submitResult.accepted ? '🎉' : '😞'}</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: submitResult.accepted ? 'var(--green)' : 'var(--red)', marginBottom: '14px' }}>
                      {submitResult.accepted ? 'Accepted' : submitResult.status?.replaceAll('_', ' ')}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <StatChip label="Test Cases" value={`${submitResult.passedTestCases}/${submitResult.totalTestCases}`} />
                      <StatChip label="Runtime"    value={`${submitResult.runtime}s`} />
                      <StatChip label="Memory"     value={`${submitResult.memory} KB`} />
                    </div>
                  </div>
                  {submitResult.error && (
                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--red)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Error</div>
                      <pre className="mono" style={{ fontSize: '12px', color: '#fca5a5', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{submitResult.error}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', opacity: 0.35 }}>◎</div>
                  <p style={{ fontSize: '13px' }}>Click <strong style={{ color: 'var(--text-secondary)' }}>Submit</strong> to evaluate your solution</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;