import { useState } from "react";

export function IncidentDetailPage() {
  const [status, setStatus] = useState<"INVESTIGATING" | "RESOLVED">("INVESTIGATING");
  const [acknowledged, setAcknowledged] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Incident Header */}
      <div className="dashboard-header" style={{ alignItems: "flex-start" }}>
        <div className="dashboard-title-area" style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <span className="sev-badge sev-1">SEV-1 · MAJOR</span>
            <span
              className={`status-badge ${
                status === "INVESTIGATING" ? "down" : "operational"
              }`}
            >
              ● {status}
            </span>
            <span style={{ color: "var(--text-muted)", fontFamily: "monospace", fontSize: "0.8rem" }}>
              INC-1842
            </span>
          </div>

          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
            payments-webhook not responding across 4 regions
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginTop: "0.75rem",
              fontSize: "0.825rem",
              color: "var(--text-muted)",
              fontFamily: "monospace",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span style={{ color: "var(--text-dim)", textTransform: "uppercase", fontSize: "0.7rem", display: "block" }}>
                Started
              </span>
              <strong style={{ color: "var(--text-main)" }}>14:32:08 UTC</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", textTransform: "uppercase", fontSize: "0.7rem", display: "block" }}>
                Duration
              </span>
              <strong style={{ color: "#ef4444" }}>25m 39s</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", textTransform: "uppercase", fontSize: "0.7rem", display: "block" }}>
                Affected
              </span>
              <strong style={{ color: "var(--text-main)" }}>payments-webhook</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", textTransform: "uppercase", fontSize: "0.7rem", display: "block" }}>
                Regions
              </span>
              <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.1rem" }}>
                {["IAD", "SJC", "DUB", "FRA"].map((r) => (
                  <span key={r} className="region-chip">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button className="ai-postmortem-btn">
          <span>✨</span>
          <span>Generate AI Postmortem</span>
        </button>
      </div>

      {/* Action Buttons Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          className={acknowledged ? "btn-secondary" : "btn-primary"}
          onClick={() => setAcknowledged(!acknowledged)}
        >
          {acknowledged ? "✓ Acknowledged" : "Acknowledge"}
        </button>
        <button
          className="btn-secondary"
          style={{ borderColor: "#10b981", color: "#34d399" }}
          onClick={() => setStatus("RESOLVED")}
        >
          Resolve
        </button>
        <button className="btn-secondary">Add update</button>
      </div>

      {/* Main Grid */}
      <div className="incident-detail-grid">
        {/* Left Column: Timeline */}
        <div className="panel">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Incident timeline
          </h3>

          <div className="incident-timeline">
            <div className="timeline-event">
              <span className="timeline-dot blue" />
              <div className="timeline-event-header">
                <span>System auto-detected outage</span>
                <span className="tag-badge system">SYSTEM</span>
              </div>
              <div className="timeline-event-desc">
                payments-webhook failed multi-region quorum (4/4 regions returning connection refused).
              </div>
              <div className="timeline-event-time">14:32:08 UTC</div>
            </div>

            <div className="timeline-event">
              <span className="timeline-dot blue" />
              <div className="timeline-event-header">
                <span>Alert fanned out</span>
                <span className="tag-badge system">SYSTEM</span>
              </div>
              <div className="timeline-event-desc">
                Slack #incidents notified · SMS sent to primary on-call Jamie Doyle.
              </div>
              <div className="timeline-event-time">14:32:11 UTC</div>
            </div>

            <div className="timeline-event">
              <span className="timeline-dot green" />
              <div className="timeline-event-header">
                <span>Acknowledged</span>
                <span className="tag-badge author">Jamie Doyle</span>
              </div>
              <div className="timeline-event-desc">
                On it — checking the payment gateway connection pool metrics.
              </div>
              <div className="timeline-event-time">14:33:02 UTC</div>
            </div>

            <div className="timeline-event">
              <span className="timeline-dot green" />
              <div className="timeline-event-header">
                <span>Status — Investigating</span>
                <span className="tag-badge author">Jamie Doyle</span>
              </div>
              <div className="timeline-event-desc">
                Confirmed pool exhaustion after v2.14.0 deploy raised concurrency limits.
              </div>
              <div className="timeline-event-time">14:38:40 UTC</div>
            </div>

            <div className="timeline-event">
              <span className="timeline-dot blue" />
              <div className="timeline-event-header">
                <span>Escalated to Step 2</span>
                <span className="tag-badge system">SYSTEM</span>
              </div>
              <div className="timeline-event-desc">
                No resolution in 5m · paging secondary on-call + #eng-payments.
              </div>
              <div className="timeline-event-time">14:37:11 UTC</div>
            </div>

            <div className="timeline-event">
              <span className="timeline-dot green" />
              <div className="timeline-event-header">
                <span>Update posted to status page</span>
                <span className="tag-badge author">Priya Nair</span>
              </div>
              <div className="timeline-event-desc">
                Customers notified of degraded payment webhooks; fix in progress.
              </div>
              <div className="timeline-event-time">14:41:22 UTC</div>
            </div>
          </div>
        </div>

        {/* Right Column: Escalation Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="panel">
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>
              Escalation status
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="escalation-step-card">
                <div className="step-num done">✓</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                    Step 1 · Primary on-call
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                    Jamie Doyle · Slack + SMS
                  </div>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    notified 14:32:11
                  </div>
                </div>
              </div>

              <div className="escalation-step-card">
                <div className="step-num active">2</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#60a5fa" }}>
                    Step 2 · Secondary + #eng-payments
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                    Priya Nair, Tom Ruiz
                  </div>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    paging now · 14:37:11
                  </div>
                </div>
              </div>

              <div className="escalation-step-card">
                <div className="step-num">3</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Step 3 · Engineering manager
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                    Alex Kim
                  </div>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    waits 10m
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* On-Call Now Box */}
          <div className="panel" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
            <div style={{ fontSize: "0.725rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              On-Call Now
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="user-avatar">JD</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Jamie Doyle</span>
                <span style={{ fontSize: "0.775rem", color: "#34d399", fontWeight: 600 }}>
                  ● acknowledged
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
