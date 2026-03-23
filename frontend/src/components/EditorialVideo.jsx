const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const formatDuration = (secs) => {
    if (!secs) return null;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  if (!secureUrl) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "12px", padding: "56px 20px",
        background: "var(--surface-1)", border: "1px solid var(--border)",
        borderRadius: "12px", color: "var(--text-muted)",
      }}>
        <span style={{ fontSize: "32px", opacity: 0.35 }}>▶</span>
        <p style={{ fontSize: "13.5px" }}>No editorial video available for this problem.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            color: "var(--accent)", background: "var(--accent-glow)",
            border: "1px solid rgba(59,130,246,0.2)",
            padding: "2px 10px", borderRadius: "99px",
          }}>
            ▶ Video Solution
          </span>
        </div>
        {duration && (
          <span className="mono" style={{
            fontSize: "12px", color: "var(--text-muted)",
            background: "var(--surface-2)", border: "1px solid var(--border)",
            padding: "3px 10px", borderRadius: "99px",
          }}>
            {formatDuration(duration)}
          </span>
        )}
      </div>

      {/* Video */}
      <div style={{
        position: "relative", width: "100%", paddingBottom: "56.25%",  /* 16:9 */
        background: "#000",
        borderRadius: "12px", overflow: "hidden",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
      }}>
        <video
          controls
          preload="metadata"
          poster={thumbnailUrl}
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "contain",
          }}
        >
          <source src={secureUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Footer hint */}
      <p style={{ fontSize: "11.5px", color: "var(--text-muted)", lineHeight: 1.5 }}>
        Watch the editorial walkthrough to understand the optimal approach and time complexity.
      </p>
    </div>
  );
};

export default Editorial;