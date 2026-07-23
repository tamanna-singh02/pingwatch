import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginSchema } from "@pingwatch/shared-types";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api-client";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@acme.com", password: "password123" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = LoginSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your login details");
      return;
    }

    setSubmitting(true);
    try {
      await login(parsed.data);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please check your credentials.");
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
            <h1>Welcome Back</h1>
            <p>Enter your credentials to access the ops dashboard.</p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
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
              <div className="auth-row-between">
                <span>Password</span>
                <a href="#" className="auth-link">Forgot password?</a>
              </div>
              <input
                className="auth-input"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
                required
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Logging in..." : "Log In to Dashboard"}
            </button>
          </form>

          <div className="auth-demo-box">
            <span><strong>Demo Access:</strong> Prefilled with demo credentials.</span>
            <span>Click <em>"Log In to Dashboard"</em> to enter.</span>
          </div>

          <p className="auth-footer-text">
            Don't have an organization yet?{" "}
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
