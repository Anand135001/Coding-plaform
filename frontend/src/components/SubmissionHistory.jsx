import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

const statusConfig = {
  accepted: { label: "Accepted", color: "var(--green)",  bg: "rgba(34,197,94,0.10)",  border: "rgba(34,197,94,0.20)"  },
  wrong:    { label: "Wrong",    color: "var(--red)",    bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.20)"  },
  error:    { label: "Error",    color: "var(--yellow)", bg: "rgba(234,179,8,0.10)",  border: "rgba(234,179,8,0.20)"  },
  pending:  { label: "Pending",  color: "var(--accent)", bg: "var(--accent-glow)",    border: "rgba(59,130,246,0.20)" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { label: status, color: "var(--text-muted)", bg: "var(--surface-3)", border: "var(--border)" };
  return (
    <span style={{
      fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em",
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      padding: "2px 10px", borderRadius: "99px", textTransform: "capitalize",
    }}>
      {cfg.label}
    </span>
  );
};

const formatMemory = (memory) => memory < 1024 ? `${memory} KB` : `${(memory / 1024).toFixed(1)} MB`;
const formatDate   = (d) => new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
const langLabel    = (l) => ({ javascript: "JS", java: "Java", cpp: "C++" }[l?.toLowerCase()] || l);

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions]         = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch submission history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "160px" }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: "2px solid var(--surface-3)", borderTop: "2px solid var(--accent)", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", color: "var(--red)", fontSize: "13px" }}>
      ⚠ {error}
    </div>
  );

  if (submissions.length === 0) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "48px 20px", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--text-muted)" }}>
      <span style={{ fontSize: "28px", opacity: 0.4 }}>↑</span>
      <p style={{ fontSize: "13.5px" }}>No submissions yet for this problem.</p>
    </div>
  );

  return (
    <>
      {/* Count */}
      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
        {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "36px 70px 100px 80px 80px 80px 1fr 60px",
          gap: "0",
          padding: "9px 14px",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--border)",
        }}>
          {["#", "Lang", "Status", "Runtime", "Memory", "Cases", "Submitted", ""].map((h) => (
            <span key={h} style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {submissions.map((sub, index) => (
          <div
            key={sub._id}
            style={{
              display: "grid",
              gridTemplateColumns: "36px 70px 100px 80px 80px 80px 1fr 60px",
              gap: "0",
              padding: "11px 14px",
              borderBottom: index < submissions.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{index + 1}</span>
            <span className="mono" style={{ fontSize: "12px", color: "var(--text-primary)", background: "var(--surface-3)", padding: "2px 8px", borderRadius: "5px", display: "inline-block" }}>
              {langLabel(sub.language)}
            </span>
            <span><StatusBadge status={sub.status} /></span>
            <span className="mono" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{sub.runtime}s</span>
            <span className="mono" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{formatMemory(sub.memory)}</span>
            <span className="mono" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{sub.testCasesPassed}/{sub.testCasesTotal}</span>
            <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{formatDate(sub.createdAt)}</span>
            <button
              onClick={() => setSelectedSubmission(sub)}
              style={{
                fontSize: "11.5px", fontWeight: 500,
                color: "var(--accent)", background: "var(--accent-glow)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "6px", padding: "4px 10px",
                cursor: "pointer", transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedSubmission && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "14px", width: "100%", maxWidth: "760px", maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Submission</span>
                <StatusBadge status={selectedSubmission.status} />
                <span className="mono" style={{ fontSize: "12px", color: "var(--text-muted)", background: "var(--surface-3)", padding: "2px 8px", borderRadius: "5px" }}>{langLabel(selectedSubmission.language)}</span>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{ width: "28px", height: "28px", borderRadius: "6px", background: "var(--surface-3)", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >×</button>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "8px", padding: "12px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0, flexWrap: "wrap" }}>
              {[
                ["Runtime", `${selectedSubmission.runtime}s`],
                ["Memory", formatMemory(selectedSubmission.memory)],
                ["Cases", `${selectedSubmission.testCasesPassed}/${selectedSubmission.testCasesTotal}`],
                ["Submitted", formatDate(selectedSubmission.createdAt)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", flexDirection: "column", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "7px 14px", gap: "2px" }}>
                  <span className="mono" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{v}</span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{k}</span>
                </div>
              ))}
            </div>

            {/* Error */}
            {selectedSubmission.errorMessage && (
              <div style={{ margin: "12px 20px 0", padding: "12px 14px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", flexShrink: 0 }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--red)", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Error</div>
                <pre className="mono" style={{ fontSize: "12px", color: "#fca5a5", whiteSpace: "pre-wrap", lineHeight: 1.6, margin: 0 }}>{selectedSubmission.errorMessage}</pre>
              </div>
            )}

            {/* Code */}
            <div className="custom-scroll" style={{ flex: 1, overflowY: "auto", margin: "12px 20px 20px" }}>
              <div style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Source Code
                </div>
                <pre className="mono custom-scroll" style={{ padding: "16px", fontSize: "12.5px", color: "var(--text-secondary)", overflowX: "auto", margin: 0, lineHeight: 1.7 }}>
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmissionHistory;