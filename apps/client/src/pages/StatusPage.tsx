import { useTheme } from "../context/ThemeContext";

export function StatusPage() {
  const { theme, toggleTheme } = useTheme();

  const renderUptimeBars = (degradedIndexes: number[] = [], downIndexes: number[] = []) => {
    const bars = [];
    for (let i = 0; i < 60; i++) {
      let statusClass = "";
      if (degradedIndexes.includes(i)) statusClass = "degraded";
      else if (downIndexes.includes(i)) statusClass = "down";

      bars.push(
        <div
          key={i}
          className={`uptime-bar ${statusClass}`}
          title={`Day ${i + 1}`}
        />
      );
    }
    return bars;
  };

  return (
    <div className="status-page-wrapper">
      <header className="status-page-header">
        <div className="status-brand">
          <div className="status-brand-icon">A</div>
          <h2>Acme Cloud Status</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            <span>{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
          </button>
          <button className="btn-secondary">Subscribe to updates</button>
        </div>
      </header>

      <div className="status-banner-degraded">
        <div className="status-banner-degraded-header">
          <span className="status-dot teal" />
          <span>Degraded Performance · Monitoring</span>
        </div>
        <h4>Elevated checkout latency in EU regions</h4>
        <p>
          We have identified elevated response times affecting checkout in eu-west and eu-central.
          A fix has been deployed and we are monitoring recovery. — 14:58 UTC
        </p>
      </div>

      <div className="status-banner-ok">
        <div className="status-dot green" style={{ width: "16px", height: "16px" }} />
        <div>
          <h3>All core systems operational</h3>
          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: 0 }}>
            1 service reporting degraded performance · updated 12s ago
          </p>
        </div>
      </div>

      <div className="status-services-list">
        <div className="service-item">
          <div className="service-item-top">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-dot green" />
              <span className="service-name">API</span>
            </div>
            <span className="service-status op">Operational</span>
          </div>
          <div className="uptime-bars-row">{renderUptimeBars()}</div>
          <div className="uptime-bars-sub">
            <span>90 days ago</span>
            <span>99.99% uptime</span>
            <span>Today</span>
          </div>
        </div>

        <div className="service-item">
          <div className="service-item-top">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-dot green" />
              <span className="service-name">Web App</span>
            </div>
            <span className="service-status op">Operational</span>
          </div>
          <div className="uptime-bars-row">{renderUptimeBars()}</div>
          <div className="uptime-bars-sub">
            <span>90 days ago</span>
            <span>99.97% uptime</span>
            <span>Today</span>
          </div>
        </div>

        <div className="service-item">
          <div className="service-item-top">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-dot teal" />
              <span className="service-name">Checkout</span>
            </div>
            <span className="service-status deg">Degraded</span>
          </div>
          <div className="uptime-bars-row">{renderUptimeBars([32, 58])}</div>
          <div className="uptime-bars-sub">
            <span>90 days ago</span>
            <span>99.62% uptime</span>
            <span>Today</span>
          </div>
        </div>

        <div className="service-item">
          <div className="service-item-top">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-dot green" />
              <span className="service-name">Payments Webhook</span>
            </div>
            <span className="service-status op">Operational</span>
          </div>
          <div className="uptime-bars-row">{renderUptimeBars([], [59])}</div>
          <div className="uptime-bars-sub">
            <span>90 days ago</span>
            <span>99.90% uptime</span>
            <span>Today</span>
          </div>
        </div>

        <div className="service-item">
          <div className="service-item-top">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-dot green" />
              <span className="service-name">CDN</span>
            </div>
            <span className="service-status op">Operational</span>
          </div>
          <div className="uptime-bars-row">{renderUptimeBars([41])}</div>
          <div className="uptime-bars-sub">
            <span>90 days ago</span>
            <span>100.00% uptime</span>
            <span>Today</span>
          </div>
        </div>

        <div className="service-item">
          <div className="service-item-top">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-dot green" />
              <span className="service-name">Database</span>
            </div>
            <span className="service-status op">Operational</span>
          </div>
          <div className="uptime-bars-row">{renderUptimeBars()}</div>
          <div className="uptime-bars-sub">
            <span>90 days ago</span>
            <span>99.99% uptime</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      <div className="past-incidents-section">
        <h3>Past incidents</h3>

        <div className="past-incident-card">
          <div className="past-incident-date">Jul 12, 2026</div>
          <div className="past-incident-title">Search indexing lag caused elevated 5xx</div>
          <div className="past-incident-desc">
            Reindex job backed up after scheme migration; drained queue and added backpressure.
          </div>
          <div className="past-incident-meta">RESOLVED · 1h 12m</div>
        </div>

        <div className="past-incident-card">
          <div className="past-incident-date">Jul 04, 2026</div>
          <div className="past-incident-title">CDN edge cache purge delay</div>
          <div className="past-incident-desc">
            Purge propagation delayed in DUB; forced global invalidation.
          </div>
          <div className="past-incident-meta">RESOLVED · 22m</div>
        </div>

        <div className="past-incident-card">
          <div className="past-incident-date">Jun 28, 2026</div>
          <div className="past-incident-title">Scheduled maintenance — DB failover test</div>
          <div className="past-incident-desc">
            Planned failover drill completed with no customer impact.
          </div>
          <div className="past-incident-meta">RESOLVED · 8m</div>
        </div>
      </div>

      <footer className="status-footer">
        <div>
          Powered by <strong>PingWatch</strong> · status.acme.com
        </div>
        <div className="footer-links">
          <a href="#">RSS</a>
          <a href="#">Webhook</a>
          <a href="#">History</a>
        </div>
      </footer>
    </div>
  );
}
