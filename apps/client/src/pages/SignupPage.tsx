import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupSchema } from "@pingwatch/shared-types";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api-client";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    organizationName: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = SignupSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await signup(parsed.data);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-brand-header">
          <div className="auth-brand-logo">
            <div className="auth-logo-icon">P</div>
            <span className="auth-logo-text">PingWatch</span>
          </div>
          <p className="auth-brand-tagline">
            Enterprise Uptime Monitoring & Incident Management
          </p>
        </div>

        <div className="auth-card-panel">
          <div className="auth-card-title">
            <h1>Create Organization</h1>
            <p>Start monitoring your infrastructure in under two minutes.</p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            <label className="auth-input-label">
              <span>Organization Name</span>
              <input
                className="auth-input"
                type="text"
                value={form.organizationName}
                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                placeholder="Acme Ops Inc."
                required
              />
            </label>

            <label className="auth-input-label">
              <span>Your Name</span>
              <input
                className="auth-input"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                required
              />
            </label>

            <label className="auth-input-label">
              <span>Work Email</span>
              <input
                className="auth-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@acme.com"
                required
              />
            </label>

            <label className="auth-input-label">
              <span>Password</span>
              <input
                className="auth-input"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 10 characters"
                required
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Creating Account..." : "Create Organization Account"}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
