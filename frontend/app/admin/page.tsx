"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomCursor from "@/components/sections/CustomCursor";
import { useAuth } from "@/lib/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "admin@plantb.com", password: "admin123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect inside useEffect — never during render
  useEffect(() => {
    if (!isLoading && user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    }
    setLoading(false);
  };

  if (isLoading || user?.role === "admin") return null;

  return (
    <div className="adm-login-page">
      <CustomCursor />
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <span className="logo-leaf" style={{ width: 40, height: 40, flexShrink: 0 }} />
          <div>
            <h1 className="adm-login-title">PlantSell Admin</h1>
            <p className="adm-login-sub">Manage your store</p>
          </div>
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="adm-email">Admin Email</label>
            <input id="adm-email" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="auth-field">
            <label htmlFor="adm-pass">Password</label>
            <input id="adm-pass" type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing in…" : "Enter Admin Panel →"}
          </button>
        </form>

        <div className="auth-footer-note">
          <p>Default: <code>admin@plantb.com</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
}
