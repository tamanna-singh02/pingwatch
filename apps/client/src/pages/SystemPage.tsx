import { Link } from "react-router-dom";

export function SystemPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h1>Component System &amp; Empty States</h1>
        </div>
      </div>

      {/* Section 1: Status System */}
      <div className="panel">
        <h3 style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
          Status System · Badge + Dot
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span className="status-badge operational">
            <span className="status-dot green" />
            <span>OPERATIONAL</span>
          </span>

          <span className="status-badge degraded">
            <span className="status-dot teal" />
            <span>DEGRADED</span>
          </span>

          <span className="status-badge down">
            <span className="status-dot red" />
            <span>DOWN</span>
          </span>

          <span className="status-badge" style={{ background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.3)" }}>
            <span className="status-dot" style={{ background: "#94a3b8" }} />
            <span>PAUSED</span>
          </span>

          <span className="status-badge" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
            <span className="status-dot blue" />
            <span>INVESTIGATING</span>
          </span>
        </div>
      </div>

      {/* Section 2: Empty States */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Empty State Card 1: No monitors */}
        <div className="empty-state-card">
          <div className="empty-state-icon">⚙</div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>No monitors yet</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", maxWidth: "300px" }}>
            Add your first endpoint and we&apos;ll start checking it from 7 regions in seconds.
          </p>
          <Link to="/wizard" className="btn-primary" style={{ textDecoration: "none", marginTop: "0.5rem" }}>
            + Create monitor
          </Link>
        </div>

        {/* Empty State Card 2: No incidents */}
        <div className="empty-state-card">
          <div className="empty-state-icon" style={{ color: "#34d399", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            ✓
          </div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>No active incidents</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", maxWidth: "300px" }}>
            Everything&apos;s green. We&apos;ll page on-call the moment quorum detects a problem.
          </p>
          <div style={{ color: "#34d399", fontWeight: 700, fontSize: "0.85rem", marginTop: "0.5rem" }}>
            ● 47 days since last incident
          </div>
        </div>
      </div>
    </div>
  );
}
