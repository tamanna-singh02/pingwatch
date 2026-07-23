import { useState } from "react";
import { Link } from "react-router-dom";

export function MonitorDetailPage() {
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">("24h");

  const recentChecks = [
    { time: "18:16:09 UTC", region: "IAD", code: 200, latency: "101ms", passed: true, status: "all passed" },
    { time: "18:15:39 UTC", region: "SJC", code: 200, latency: "87ms", passed: true, status: "all passed" },
    { time: "18:15:09 UTC", region: "DUB", code: 200, latency: "297ms", passed: false, status: "p95 threshold breached" },
    { time: "18:14:39 UTC", region: "FRA", code: 200, latency: "296ms", passed: false, status: "p95 threshold breached" },
    { time: "18:14:09 UTC", region: "BOM", code: 200, latency: "98ms", passed: true, status: "all passed" },
    { time: "18:13:39 UTC", region: "IAD", code: 200, latency: "109ms", passed: true, status: "all passed" },
    { time: "18:13:09 UTC", region: "SJC", code: 200, latency: "82ms", passed: true, status: "all passed" },
    { time: "18:12:39 UTC", region: "DUB", code: 200, latency: "87ms", passed: true, status: "all passed" },
  ];

  return (
    <div className="detail-main">
      {/* Detail Top Header */}
      <div className="detail-header">
        <div className="detail-title-group">
          <div className="detail-breadcrumbs">
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Monitors
            </Link>
            <span>/</span>
            <span>checkout-service</span>
          </div>
          <div className="detail-title-row">
            <span className="status-dot teal" />
            <h1>checkout-service</h1>
            <span className="status-badge degraded">DEGRADED</span>
          </div>
          <div className="detail-meta-text">
            GET https://checkout.acme.com/health · every 30s · 6 regions
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn-secondary">Edit</button>
          <button className="btn-secondary">Pause</button>
          <button className="btn-danger">Delete</button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>Current P95</span>
          </div>
          <div className="metric-value amber" style={{ color: "#f59e0b" }}>
            214ms
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Uptime 30D</span>
          </div>
          <div className="metric-value green">99.62%</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Avg P50</span>
          </div>
          <div className="metric-value">96ms</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Incidents 30D</span>
          </div>
          <div className="metric-value">3</div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="monitor-detail-layout">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Interactive Latency Response Chart */}
          <div className="chart-panel">
            <div className="chart-header">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Response time</h3>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-line p50" />
                    <span>p50</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-line p95" />
                    <span>p95</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-line p99" />
                    <span>p99</span>
                  </div>
                </div>
              </div>

              <div className="filter-tabs">
                {(["1h", "24h", "7d", "30d"] as const).map((r) => (
                  <button
                    key={r}
                    className={`filter-tab ${timeRange === r ? "active" : ""}`}
                    onClick={() => setTimeRange(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Latency Graph */}
            <div style={{ width: "100%", height: "220px", position: "relative" }}>
              <svg width="100%" height="100%" viewBox="0 0 700 200" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="var(--border-color)" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="700" y2="90" stroke="var(--border-color)" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="var(--border-color)" strokeDasharray="3 3" />

                {/* Y Axis Labels */}
                <text x="5" y="45" fill="var(--text-muted)" fontSize="10">300ms</text>
                <text x="5" y="95" fill="var(--text-muted)" fontSize="10">200ms</text>
                <text x="5" y="145" fill="var(--text-muted)" fontSize="10">100ms</text>

                {/* p50 Line (Blue) */}
                <path
                  d="M 50 140 Q 150 160, 250 170 T 450 130 T 650 110 L 690 100"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* p95 Line (Amber) */}
                <path
                  d="M 50 120 Q 150 135, 250 150 T 450 90 T 650 70 L 690 60"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />

                {/* p99 Line (Red Dotted) */}
                <path
                  d="M 50 90 Q 150 100, 250 130 T 450 50 T 650 30 L 690 20"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
            <div style={{ fontSize: "0.775rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
              Time: -- ■ p50: -- ■ p95: -- ■ p99: --
            </div>
          </div>

          {/* 6 Regions Grid */}
          <div className="regions-grid">
            <div className="region-card">
              <div className="region-card-top">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="status-dot green" />
                  <span>US East</span>
                </div>
                <span className="region-chip">IAD</span>
              </div>
              <div className="region-card-val">88ms</div>
              <div className="region-card-sub" style={{ color: "#34d399" }}>healthy</div>
            </div>

            <div className="region-card">
              <div className="region-card-top">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="status-dot green" />
                  <span>US West</span>
                </div>
                <span className="region-chip">SJC</span>
              </div>
              <div className="region-card-val">102ms</div>
              <div className="region-card-sub" style={{ color: "#34d399" }}>healthy</div>
            </div>

            <div className="region-card">
              <div className="region-card-top">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="status-dot teal" />
                  <span>EU West</span>
                </div>
                <span className="region-chip">DUB</span>
              </div>
              <div className="region-card-val" style={{ color: "#f59e0b" }}>241ms</div>
              <div className="region-card-sub" style={{ color: "#f59e0b" }}>above p95</div>
            </div>

            <div className="region-card">
              <div className="region-card-top">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="status-dot teal" />
                  <span>EU Central</span>
                </div>
                <span className="region-chip">FRA</span>
              </div>
              <div className="region-card-val" style={{ color: "#f59e0b" }}>268ms</div>
              <div className="region-card-sub" style={{ color: "#f59e0b" }}>above p95</div>
            </div>

            <div className="region-card">
              <div className="region-card-top">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="status-dot green" />
                  <span>AP South</span>
                </div>
                <span className="region-chip">BOM</span>
              </div>
              <div className="region-card-val">176ms</div>
              <div className="region-card-sub" style={{ color: "#34d399" }}>healthy</div>
            </div>

            <div className="region-card">
              <div className="region-card-top">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="status-dot red" />
                  <span>SA East</span>
                </div>
                <span className="region-chip">GRU</span>
              </div>
              <div className="region-card-val" style={{ color: "#f87171" }}>—</div>
              <div className="region-card-sub" style={{ color: "#f87171" }}>unreachable</div>
            </div>
          </div>

          {/* Recent Checks Table */}
          <div className="table-panel">
            <h4 style={{ padding: "1rem", fontSize: "0.9rem", borderBottom: "1px solid var(--border-color)" }}>
              Recent checks
            </h4>
            <div className="table-wrapper">
              <table className="monitors-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Region</th>
                    <th>Code</th>
                    <th>Latency</th>
                    <th>Assertions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentChecks.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: "monospace" }}>{item.time}</td>
                      <td>
                        <span className="region-chip">{item.region}</span>
                      </td>
                      <td>
                        <span className="status-badge operational">{item.code}</span>
                      </td>
                      <td style={{ fontFamily: "monospace", color: !item.passed ? "#f59e0b" : "inherit" }}>
                        {item.latency}
                      </td>
                      <td style={{ fontSize: "0.825rem", color: item.passed ? "#34d399" : "#f59e0b" }}>
                        ● {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Configuration Sidebar */}
        <aside className="config-sidebar">
          <h3>Configuration</h3>

          <div className="config-item">
            <span className="config-label">Check Interval</span>
            <div className="config-val">Every 30 seconds</div>
          </div>

          <div className="config-item">
            <span className="config-label">HTTP Method</span>
            <div className="config-val">GET</div>
          </div>

          <div className="config-item">
            <span className="config-label">Regions</span>
            <div className="config-val">6 regions - IAD SJC DUB FRA BOM GRU</div>
          </div>

          <div className="config-item">
            <span className="config-label">Timeout</span>
            <div className="config-val">10s</div>
          </div>

          <div className="config-item">
            <span className="config-label">Follow Redirects</span>
            <div className="config-val">Yes (max 3)</div>
          </div>

          <div className="config-item">
            <span className="config-label">Confirmation</span>
            <div className="config-val">2-region quorum</div>
          </div>

          <div className="config-item">
            <span className="config-label">Assertions</span>
            <div className="assertion-list">
              <div className="assertion-item">
                <span style={{ color: "#34d399" }}>● status in 200-299</span>
                <span className="type-badge">STATUS</span>
              </div>
              <div className="assertion-item">
                <span style={{ color: "#34d399" }}>● body contains "ok"</span>
                <span className="type-badge">KEYWORD</span>
              </div>
              <div className="assertion-item">
                <span style={{ color: "#34d399" }}>● $.db.latency &lt; 50</span>
                <span className="type-badge">JSONPATH</span>
              </div>
            </div>
          </div>

          <button className="btn-secondary" style={{ marginTop: "0.5rem" }}>
            Edit configuration
          </button>
        </aside>
      </div>
    </div>
  );
}
