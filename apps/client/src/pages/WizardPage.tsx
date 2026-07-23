import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function WizardPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);
  const [name, setName] = useState("api.acme.com");
  const [url, setUrl] = useState("https://api.acme.com/v1/health");
  const [method, setMethod] = useState("GET");
  const [expectedStatus, setExpectedStatus] = useState("200-299");
  const [keyword, setKeyword] = useState('"status":"ok"');

  const steps = [
    { num: 1, label: "Type" },
    { num: 2, label: "Target" },
    { num: 3, label: "Regions" },
    { num: 4, label: "Alerts" },
    { num: 5, label: "Review" },
  ];

  return (
    <div className="panel" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem" }}>
        Create a monitor
      </h1>

      {/* 5-Step Stepper Header */}
      <div className="wizard-stepper">
        {steps.map((s, idx) => {
          const isDone = s.num < currentStep;
          const isActive = s.num === currentStep;
          return (
            <div key={s.num} style={{ display: "flex", alignItems: "center", flex: idx < steps.length - 1 ? 1 : "none" }}>
              <div className={`wizard-step ${isDone ? "done" : isActive ? "active" : ""}`}>
                <div className="wizard-step-circle">
                  {isDone ? "✓" : s.num}
                </div>
                <span>{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`wizard-step-line ${isDone ? "done" : ""}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Target & configuration</h2>
          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Step 2 of 5 · HTTP monitor
          </p>
        </div>

        <div className="form-group">
          <label className="config-label">Monitor Name</label>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="config-label">URL to Monitor</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select
              className="form-select"
              style={{ width: "110px" }}
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="HEAD">HEAD</option>
            </select>
            <input
              className="form-input"
              style={{ flex: 1, fontFamily: "monospace" }}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label className="config-label">Expected Status</label>
            <input
              className="form-input"
              style={{ fontFamily: "monospace" }}
              type="text"
              value={expectedStatus}
              onChange={(e) => setExpectedStatus(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="config-label">Keyword Assertion</label>
            <input
              className="form-input"
              style={{ fontFamily: "monospace" }}
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* Live Test Check Result Card */}
        <div className="test-check-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.85rem" }}>
              <span className="status-dot green" />
              <span>Live test check</span>
            </div>
            <span className="status-badge operational">PASSED</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "0.25rem" }}>
            <div>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>STATUS</span>
              <strong style={{ color: "#34d399", fontSize: "1.1rem" }}>200</strong>
            </div>

            <div>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>LATENCY</span>
              <strong style={{ fontSize: "1.1rem" }}>84ms</strong>
            </div>

            <div>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>DNS</span>
              <strong style={{ fontSize: "1.1rem" }}>12ms</strong>
            </div>

            <div>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>TLS</span>
              <strong style={{ fontSize: "1.1rem" }}>31ms</strong>
            </div>
          </div>
        </div>

        {/* Wizard Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
          <button className="btn-secondary" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}>
            Back
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              if (currentStep < 5) setCurrentStep(currentStep + 1);
              else navigate("/");
            }}
          >
            {currentStep === 5 ? "Finish & Create Monitor" : "Continue — Regions"}
          </button>
        </div>
      </div>
    </div>
  );
}
