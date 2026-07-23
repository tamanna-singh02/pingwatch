import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  lastActive: string;
  initials: string;
}

const MEMBERS_DATA: TeamMember[] = [
  { id: "1", name: "Alex Kim", email: "alex@acme.com", role: "Owner", lastActive: "2m ago", initials: "AK" },
  { id: "2", name: "Jamie Doyle", email: "jamie@acme.com", role: "Admin", lastActive: "just now", initials: "JD" },
  { id: "3", name: "Priya Nair", email: "priya@acme.com", role: "Editor", lastActive: "14m ago", initials: "PN" },
  { id: "4", name: "Tom Ruiz", email: "tom@acme.com", role: "Editor", lastActive: "1h ago", initials: "TR" },
  { id: "5", name: "Sara Voss", email: "sara@acme.com", role: "Viewer", lastActive: "3h ago", initials: "SV" },
  { id: "6", name: "Devon Lee", email: "devon@acme.com", role: "Viewer", lastActive: "yesterday", initials: "DL" },
];

export function TeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const members = MEMBERS_DATA;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteEmail("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h1>Team</h1>
        </div>

        <form onSubmit={handleInvite} className="dashboard-actions">
          <div className="search-box">
            <span className="search-icon">✉</span>
            <input
              type="email"
              className="search-input"
              placeholder="Invite by email..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Send invite
          </button>
        </form>
      </div>

      {/* Members Table */}
      <div className="table-panel">
        <div className="table-wrapper">
          <table className="monitors-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div className="user-avatar" style={{ width: "30px", height: "30px" }}>
                        {m.initials}
                      </div>
                      <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace" }}>{m.email}</td>
                  <td>
                    <span className={`role-pill ${m.role.toLowerCase()}`}>{m.role}</span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{m.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Invites */}
      <div className="panel">
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem" }}>Pending invites</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="channel-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="user-avatar">N</div>
              <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>newhire@acme.com</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span className="role-pill editor">Editor</span>
              <span style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>2h ago</span>
              <button className="btn-secondary" style={{ padding: "0.3rem 0.65rem", fontSize: "0.775rem" }}>Resend</button>
            </div>
          </div>

          <div className="channel-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="user-avatar">C</div>
              <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>contractor@vendor.io</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span className="role-pill viewer">Viewer</span>
              <span style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>1d ago</span>
              <button className="btn-secondary" style={{ padding: "0.3rem 0.65rem", fontSize: "0.775rem" }}>Resend</button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="table-panel">
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Audit log</h3>
          <span style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>last 24h</span>
        </div>
        <div className="table-wrapper">
          <table className="monitors-table">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Jamie Doyle</td>
                <td>
                  <span className="audit-action-badge ack">ACK</span> acknowledged incident
                </td>
                <td style={{ fontFamily: "monospace" }}>INC-1842</td>
                <td style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>14:33:02</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>System</td>
                <td>
                  <span className="audit-action-badge auto">AUTO</span> opened incident
                </td>
                <td style={{ fontFamily: "monospace" }}>INC-1842</td>
                <td style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>14:32:08</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Priya Nair</td>
                <td>
                  <span className="audit-action-badge edit">EDIT</span> updated assertions
                </td>
                <td style={{ fontFamily: "monospace" }}>checkout-service</td>
                <td style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>13:58:41</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Alex Kim</td>
                <td>
                  <span className="audit-action-badge role">ROLE</span> changed role -&gt; Editor
                </td>
                <td style={{ fontFamily: "monospace" }}>tom@acme.com</td>
                <td style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>12:28:10</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Tom Ruiz</td>
                <td>
                  <span className="audit-action-badge create">CREATE</span> created monitor
                </td>
                <td style={{ fontFamily: "monospace" }}>search-api</td>
                <td style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>11:04:55</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>System</td>
                <td>
                  <span className="audit-action-badge auto">AUTO</span> resolved incident
                </td>
                <td style={{ fontFamily: "monospace" }}>INC-1835</td>
                <td style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>09:41:33</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
