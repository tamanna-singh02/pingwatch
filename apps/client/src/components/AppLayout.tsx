import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function AppLayout() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const chips = [
    { label: "01 Dashboard", path: "/" },
    { label: "02 Detail", path: "/monitors/checkout-service" },
    { label: "03 Incident", path: "/incidents/INC-1842" },
    { label: "04 Incidents", path: "/incidents" },
    { label: "05 Status", path: "/status" },
    { label: "06 Alerts", path: "/alerts" },
    { label: "07 Team", path: "/team" },
    { label: "08 Wizard", path: "/wizard" },
    { label: "09 System", path: "/system" },
  ];

  const userInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "AK";
  const orgName = user?.orgSlug ? `${user.orgSlug} Ops` : "Acme Ops";

  const getScreenTitle = () => {
    if (location.pathname.startsWith("/monitors/")) return "02 Detail — Monitor Detail";
    if (location.pathname.startsWith("/incidents/")) return "03 Incident — Incident Detail & AI Postmortem";
    if (location.pathname === "/incidents") return "04 Incidents — Incidents Kanban List";
    if (location.pathname === "/status") return "05 Status — Public Status Page";
    if (location.pathname === "/alerts") return "06 Alerts — Alert Channels & Escalation Policy";
    if (location.pathname === "/team") return "07 Team — Team & RBAC Settings";
    if (location.pathname === "/wizard") return "08 Wizard — New Monitor Creation Wizard";
    if (location.pathname === "/system") return "09 System — Component System & Empty States";
    return "01 Dashboard — Monitor Overview";
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="app-container">
      {/* Top UI Kit Navigation Header */}
      <header className="kit-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

          <span className="brand-title" style={{ fontSize: "1.05rem" }}>
            <span style={{ color: "#38bdf8", fontWeight: 800 }}>P</span> PingWatch
          </span>
          <span className="kit-badge">UI KIT</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
          <div className="kit-nav-chips">
            {chips.map((chip) => {
              const isActive =
                (chip.path === "/" && location.pathname === "/") ||
                (chip.path !== "/" && location.pathname === chip.path);
              return (
                <Link
                  key={chip.label}
                  to={chip.path}
                  className={`kit-chip ${isActive ? "active" : ""}`}
                  onClick={closeMobileMenu}
                >
                  {chip.label}
                </Link>
              );
            })}
          </div>

          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
            <span>{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
        </div>
      </header>

      {/* Screen Overview Banner */}
      <div className="screen-overview-banner">
        <span className="screen-number">{getScreenTitle().slice(0, 2)}</span>
        <span>{getScreenTitle()}</span>
      </div>

      <div className="app-body">
        {/* Mobile Backdrop Overlay */}
        <div
          className={`sidebar-overlay ${isMobileMenuOpen ? "open" : ""}`}
          onClick={closeMobileMenu}
        />

        {/* Left Sidebar (Mobile Slide-out Drawer & Desktop Fixed Sidebar) */}
        <aside className={`app-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="sidebar-top">
            <div className="sidebar-brand">
              <div className="brand-icon">P</div>
              <span className="brand-title">PingWatch</span>
            </div>

            <nav className="sidebar-nav">
              <Link
                to="/"
                className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <div className="nav-item-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span>Monitors</span>
                </div>
                <span className="nav-count-badge">14</span>
              </Link>

              <Link
                to="/incidents"
                className={`nav-item ${location.pathname.startsWith("/incidents") ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <div className="nav-item-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>Incidents</span>
                </div>
                <span className="nav-count-badge highlight">2</span>
              </Link>

              <Link
                to="/status"
                className={`nav-item ${location.pathname === "/status" ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <div className="nav-item-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>Status Pages</span>
                </div>
              </Link>

              <Link
                to="/alerts"
                className={`nav-item ${location.pathname === "/alerts" ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <div className="nav-item-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>Alerts</span>
                </div>
              </Link>

              <Link
                to="/team"
                className={`nav-item ${location.pathname === "/team" ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <div className="nav-item-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Team</span>
                </div>
              </Link>

              <Link
                to="/system"
                className={`nav-item ${location.pathname === "/system" ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <div className="nav-item-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Settings</span>
                </div>
              </Link>
            </nav>
          </div>

          <div className="sidebar-user">
            <div className="user-avatar">{userInitials}</div>
            <div className="user-info">
              <span className="user-name">{orgName}</span>
              <span className="user-org">Pro · 14 seats</span>
            </div>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
