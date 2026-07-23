export function AlertsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h1>Alerting</h1>
        </div>
      </div>

      <div className="alerting-grid">
        {/* Left Column: Connected Channels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Connected channels</h3>

          <div className="channel-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="channel-icon slack">S</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Slack</div>
                <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>#incidents - acme...</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-badge operational">Connected</span>
              <button className="btn-secondary" style={{ padding: "0.3rem 0.6rem" }}>Test</button>
            </div>
          </div>

          <div className="channel-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="channel-icon email">✉</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Email</div>
                <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>oncall@acme.com</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-badge operational">Connected</span>
              <button className="btn-secondary" style={{ padding: "0.3rem 0.6rem" }}>Test</button>
            </div>
          </div>

          <div className="channel-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="channel-icon sms">📱</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>SMS</div>
                <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>+1 (415) *** 4820</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-badge operational">Connected</span>
              <button className="btn-secondary" style={{ padding: "0.3rem 0.6rem" }}>Test</button>
            </div>
          </div>

          <div className="channel-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="channel-icon webhook">⚙</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Webhook</div>
                <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>Not configured</div>
              </div>
            </div>
            <button className="btn-primary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
              Connect
            </button>
          </div>
        </div>

        {/* Right Column: Escalation Policy */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Escalation policy — Production</h3>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
              Drag steps to reorder · triggers on any SEV-1/SEV-2
            </p>
          </div>

          <div className="policy-tree">
            {/* Step 1 */}
            <div className="policy-step-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: "var(--text-muted)", cursor: "grab" }}>≡</span>
                <span className="step-num active">1</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Notify primary on-call</div>
                  <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.25rem" }}>
                    <span className="type-badge">Slack</span>
                    <span className="type-badge">SMS</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.775rem", color: "var(--text-muted)" }}>
                <div>SCHEDULE</div>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>Primary rotation</div>
              </div>
            </div>

            <div className="wait-connector">│ wait 5 min │</div>

            {/* Step 2 */}
            <div className="policy-step-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: "var(--text-muted)", cursor: "grab" }}>≡</span>
                <span className="step-num active">2</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Escalate to secondary + team</div>
                  <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.25rem" }}>
                    <span className="type-badge">Slack</span>
                    <span className="type-badge">Email</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.775rem", color: "var(--text-muted)" }}>
                <div>SCHEDULE</div>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>Payments squad</div>
              </div>
            </div>

            <div className="wait-connector">│ wait 10 min │</div>

            {/* Step 3 */}
            <div className="policy-step-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: "var(--text-muted)", cursor: "grab" }}>≡</span>
                <span className="step-num active">3</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Page engineering manager</div>
                  <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.25rem" }}>
                    <span className="type-badge">SMS</span>
                    <span className="type-badge">Phone</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.775rem", color: "var(--text-muted)" }}>
                <div>SCHEDULE</div>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>Leadership</div>
              </div>
            </div>

            <button className="btn-secondary" style={{ marginTop: "0.5rem", borderStyle: "dashed" }}>
              + Add escalation step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
