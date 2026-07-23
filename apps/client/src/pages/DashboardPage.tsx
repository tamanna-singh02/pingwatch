import { useState } from "react";
import { Sparkline } from "../components/Sparkline";
import { NewMonitorModal } from "../components/NewMonitorModal";

interface MonitorItem {
  id: string;
  name: string;
  endpoint: string;
  type: "HTTP" | "TCP" | "DNS" | "SSL" | "Cron";
  status: "OPERATIONAL" | "heartbeat" | "DEGRADED" | "DOWN";
  latency: string;
  sparklineData: number[];
  sla: string;
  regions: string[];
}

const INITIAL_MONITORS: MonitorItem[] = [
  {
    id: "1",
    name: "db-primary-tcp",
    endpoint: "db-primary.acme.internal:5432",
    type: "TCP",
    status: "OPERATIONAL",
    latency: "12ms",
    sparklineData: [15, 12, 14, 11, 13, 12, 11, 12, 10, 12],
    sla: "99.99%",
    regions: ["IAD", "SJC"],
  },
  {
    id: "2",
    name: "auth.acme.io",
    endpoint: "https://auth.acme.io/status",
    type: "HTTP",
    status: "OPERATIONAL",
    latency: "96ms",
    sparklineData: [110, 95, 120, 96, 94, 98, 92, 96, 96],
    sla: "99.95%",
    regions: ["IAD", "DUB", "SIN"],
  },
  {
    id: "3",
    name: "cdn-edge",
    endpoint: "https://cdn.acme.com/ping",
    type: "HTTP",
    status: "OPERATIONAL",
    latency: "41ms",
    sparklineData: [45, 42, 50, 48, 41, 40, 39, 41, 42],
    sla: "100.00%",
    regions: ["IAD", "SJC", "DUB", "BOM"],
  },
  {
    id: "4",
    name: "dns.acme.com",
    endpoint: "dns.acme.com",
    type: "DNS",
    status: "OPERATIONAL",
    latency: "28ms",
    sparklineData: [30, 29, 28, 31, 28, 27, 28, 29, 28],
    sla: "99.97%",
    regions: ["IAD", "DUB"],
  },
  {
    id: "5",
    name: "ssl-cert-acme",
    endpoint: "acme.com:443",
    type: "SSL",
    status: "OPERATIONAL",
    latency: "120ms",
    sparklineData: [125, 120, 130, 118, 122, 120, 120, 119],
    sla: "100.00%",
    regions: ["IAD", "FRA"],
  },
  {
    id: "6",
    name: "cron-nightly-backup",
    endpoint: "heartbeat/backup",
    type: "Cron",
    status: "heartbeat",
    latency: "heartbeat",
    sparklineData: [90, 92, 88, 94, 91, 95, 93, 90, 92],
    sla: "99.90%",
    regions: ["IAD"],
  },
  {
    id: "7",
    name: "search-api",
    endpoint: "https://search.acme.com/health",
    type: "HTTP",
    status: "OPERATIONAL",
    latency: "143ms",
    sparklineData: [150, 142, 160, 140, 145, 143, 141, 143],
    sla: "99.99%",
    regions: ["IAD", "SJC"],
  },
  {
    id: "8",
    name: "checkout-service",
    endpoint: "https://checkout.acme.com/health",
    type: "HTTP",
    status: "DEGRADED",
    latency: "214ms",
    sparklineData: [120, 130, 140, 180, 210, 214, 214, 214],
    sla: "98.40%",
    regions: ["IAD", "DUB"],
  },
];

type FilterTab = "All" | "Down" | "Degraded" | "Operational" | "Paused";

export function DashboardPage() {
  const [monitors, setMonitors] = useState<MonitorItem[]>(INITIAL_MONITORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlertToast, setShowAlertToast] = useState(true);

  const handleAddMonitor = (newMon: {
    name: string;
    url: string;
    type: "HTTP" | "TCP" | "DNS" | "SSL" | "Cron";
    regions: string[];
  }) => {
    const item: MonitorItem = {
      id: Date.now().toString(),
      name: newMon.name,
      endpoint: newMon.url,
      type: newMon.type,
      status: "OPERATIONAL",
      latency: "45ms",
      sparklineData: [50, 48, 45, 46, 44, 45, 45],
      sla: "100.00%",
      regions: newMon.regions,
    };
    setMonitors([item, ...monitors]);
  };

  const filteredMonitors = monitors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.endpoint.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "Operational") return m.status === "OPERATIONAL";
    if (activeFilter === "Degraded") return m.status === "DEGRADED";
    if (activeFilter === "Down") return m.status === "DOWN" || m.status === "heartbeat";
    if (activeFilter === "Paused") return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Dashboard Top Control Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h1>Monitors</h1>
          <div className="dashboard-subtitle">
            <span>Last check 3s ago</span>
            <span>·</span>
            <span>auto-refresh on</span>
          </div>
        </div>

        <div className="dashboard-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search monitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <span>+</span>
            <span>New Monitor</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="status-dot green" />
            <span>Overall Uptime</span>
          </div>
          <div className="metric-value green">99.94%</div>
          <div className="metric-subtext">last 30 days</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="status-dot blue" />
            <span>Active Incidents</span>
          </div>
          <div className="metric-value blue">4</div>
          <div className="metric-subtext">2 investigating · 2 monitoring</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="status-dot teal" />
            <span>Monitors Up</span>
          </div>
          <div className="metric-value">10 / 14</div>
          <div className="metric-subtext">2 degraded</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="status-dot red" />
            <span>Monitors Down</span>
          </div>
          <div className="metric-value red">2</div>
          <div className="metric-subtext">requires attention</div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {(["All", "Down", "Degraded", "Operational", "Paused"] as FilterTab[]).map(
            (tab) => (
              <button
                key={tab}
                className={`filter-tab ${activeFilter === tab ? "active" : ""}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>
        <div className="total-monitors-count">
          {monitors.length} monitors
        </div>
      </div>

      {/* Monitors Data Table */}
      <div className="table-panel">
        <div className="table-wrapper">
          <table className="monitors-table">
            <thead>
              <tr>
                <th>Monitor</th>
                <th>Type</th>
                <th>Status ↑</th>
                <th>Latency</th>
                <th>Last 100</th>
                <th>300</th>
                <th>Regions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMonitors.map((mon) => (
                <tr key={mon.id}>
                  <td>
                    <div className="monitor-cell">
                      <span
                        className={`status-dot ${
                          mon.status === "OPERATIONAL"
                            ? "green"
                            : mon.status === "DEGRADED"
                            ? "teal"
                            : "red"
                        }`}
                      />
                      <div className="monitor-details">
                        <span className="monitor-title">{mon.name}</span>
                        <span className="monitor-endpoint">{mon.endpoint}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="type-badge">{mon.type}</span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        mon.status === "OPERATIONAL"
                          ? "operational"
                          : mon.status === "DEGRADED"
                          ? "degraded"
                          : mon.status === "heartbeat"
                          ? "heartbeat"
                          : "down"
                      }`}
                    >
                      {mon.status}
                    </span>
                  </td>

                  <td
                    style={{
                      fontFamily: "monospace",
                      color: mon.status === "heartbeat" ? "#f87171" : "inherit",
                    }}
                  >
                    {mon.latency}
                  </td>

                  <td>
                    <Sparkline
                      data={mon.sparklineData}
                      color={
                        mon.status === "OPERATIONAL"
                          ? "#34d399"
                          : mon.status === "DEGRADED"
                          ? "#f59e0b"
                          : "#f87171"
                      }
                    />
                  </td>

                  <td style={{ fontFamily: "monospace", fontWeight: 600 }}>
                    {mon.sla}
                  </td>

                  <td>
                    <div className="regions-group">
                      {mon.regions.map((r) => (
                        <span key={r} className="region-chip">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMonitors.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                    No monitors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Alert Toast */}
      {showAlertToast && (
        <div className="floating-alert">
          <div className="alert-dot" />
          <div className="alert-content">
            <div className="alert-title">checkout-service degraded</div>
            <div className="alert-subtitle">p95 latency 214ms · +180% baseline</div>
          </div>
          <button
            onClick={() => setShowAlertToast(false)}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              marginLeft: "0.5rem",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* New Monitor Modal Dialog */}
      <NewMonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMonitor}
      />
    </div>
  );
}
