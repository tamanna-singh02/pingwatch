import { useState, FormEvent } from "react";

interface NewMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (monitor: {
    name: string;
    url: string;
    type: "HTTP" | "TCP" | "DNS" | "SSL" | "Cron";
    regions: string[];
  }) => void;
}

export function NewMonitorModal({ isOpen, onClose, onAdd }: NewMonitorModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"HTTP" | "TCP" | "DNS" | "SSL" | "Cron">("HTTP");
  const [regions, setRegions] = useState("IAD, SJC");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    
    const parsedRegions = regions
      .split(",")
      .map((r) => r.trim().toUpperCase())
      .filter(Boolean);

    onAdd({
      name,
      url,
      type,
      regions: parsedRegions.length > 0 ? parsedRegions : ["IAD"],
    });

    setName("");
    setUrl("");
    setType("HTTP");
    setRegions("IAD, SJC");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Monitor</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div className="form-group">
            <label>Monitor Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. auth-service-prod"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>URL or Host target</label>
            <input
              className="form-input"
              type="text"
              placeholder="https://auth.acme.io/status"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Monitor Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="HTTP">HTTP / HTTPS</option>
              <option value="TCP">TCP Port</option>
              <option value="DNS">DNS Lookup</option>
              <option value="SSL">SSL Certificate</option>
              <option value="Cron">Heartbeat / Cron</option>
            </select>
          </div>

          <div className="form-group">
            <label>Check Regions (comma separated)</label>
            <input
              className="form-input"
              type="text"
              placeholder="IAD, SJC, DUB"
              value={regions}
              onChange={(e) => setRegions(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Monitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
