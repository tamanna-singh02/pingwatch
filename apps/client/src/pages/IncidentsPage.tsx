import { useState } from "react";

interface Incident {
  id: string;
  code: string;
  title: string;
  sev: "SEV-1" | "SEV-2" | "SEV-3";
  status: "investigating" | "identified" | "monitoring" | "resolved";
  duration: string;
}

const INCIDENTS_DATA: Incident[] = [
  {
    id: "1",
    code: "INC-1042",
    title: "payments-webhook not responding across 4 regions",
    sev: "SEV-1",
    status: "investigating",
    duration: "25m 44s",
  },
  {
    id: "2",
    code: "INC-1039",
    title: "grpc-gateway TLS handshake failures",
    sev: "SEV-1",
    status: "identified",
    duration: "43m 36s",
  },
  {
    id: "3",
    code: "INC-1041",
    title: "Elevated checkout latency in EU",
    sev: "SEV-2",
    status: "monitoring",
    duration: "1h 19m 36s",
  },
  {
    id: "4",
    code: "INC-1038",
    title: "Nightly worker missed 2 heartbeats",
    sev: "SEV-3",
    status: "monitoring",
    duration: "1h 46m 36s",
  },
  {
    id: "5",
    code: "INC-1035",
    title: "Search indexing lag caused 5xx spike",
    sev: "SEV-2",
    status: "resolved",
    duration: "1h 12m",
  },
  {
    id: "6",
    code: "INC-1030",
    title: "CDN edge cache purge delay",
    sev: "SEV-3",
    status: "resolved",
    duration: "22m",
  },
];

export function IncidentsPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  const columns = [
    { key: "investigating", label: "Investigating", dotClass: "blue" },
    { key: "identified", label: "Identified", dotClass: "blue" },
    { key: "monitoring", label: "Monitoring", dotClass: "teal" },
    { key: "resolved", label: "Resolved", dotClass: "green" },
  ] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header Bar */}
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h1>Incidents</h1>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${viewMode === "kanban" ? "active" : ""}`}
            onClick={() => setViewMode("kanban")}
          >
            Kanban
          </button>
          <button
            className={`filter-tab ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            Table
          </button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        /* 4-Column Kanban Board */
        <div className="kanban-board">
          {columns.map((col) => {
            const items = INCIDENTS_DATA.filter((i) => i.status === col.key);
            return (
              <div key={col.key} className="kanban-column">
                <div className="kanban-col-header">
                  <span className={`status-dot ${col.dotClass}`} />
                  <span>{col.label}</span>
                  <span className="nav-count-badge">{items.length}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {items.map((inc) => (
                    <div key={inc.id} className="incident-card">
                      <div className="incident-card-top">
                        <span
                          className={`sev-badge ${
                            inc.sev === "SEV-1"
                              ? "sev-1"
                              : inc.sev === "SEV-2"
                              ? "sev-2"
                              : "sev-3"
                          }`}
                        >
                          {inc.sev}
                        </span>
                        <span className="inc-id">{inc.code}</span>
                      </div>

                      <div className="incident-card-title">{inc.title}</div>

                      <div className="incident-card-bottom">
                        <span>●●</span>
                        <span
                          className={`incident-time ${
                            inc.status === "resolved" ? "resolved" : ""
                          }`}
                        >
                          {inc.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="table-panel">
          <table className="monitors-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {INCIDENTS_DATA.map((inc) => (
                <tr key={inc.id}>
                  <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{inc.code}</td>
                  <td style={{ fontWeight: 600 }}>{inc.title}</td>
                  <td>
                    <span
                      className={`sev-badge ${
                        inc.sev === "SEV-1" ? "sev-1" : inc.sev === "SEV-2" ? "sev-2" : "sev-3"
                      }`}
                    >
                      {inc.sev}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge operational">{inc.status}</span>
                  </td>
                  <td style={{ fontFamily: "monospace" }}>{inc.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
