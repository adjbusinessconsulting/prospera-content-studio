"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/studio");
    router.refresh();
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f7f7f5",
      fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 380, padding: "0 20px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          <Image src="/brand/mark-navy.svg" alt="Prospera" width={28} height={28} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.04em", color: "#0f1e3d" }}>PROSPERA</div>
            <div style={{ fontSize: 10, color: "#8a8a85", letterSpacing: "0.14em", fontWeight: 500 }}>CONTENT STUDIO</div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #ececea", borderRadius: 12, padding: "32px 28px" }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#0f1e3d", marginBottom: 6 }}>Sign in</h1>
          <p style={{ fontSize: 13, color: "#8a8a85", marginBottom: 24 }}>Enter your credentials to continue</p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#52524d" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ padding: "9px 12px", border: "1px solid #ececea", borderRadius: 7, fontSize: 13, outline: "none", color: "#0f1e3d", background: "#fafaf9", width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#52524d" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ padding: "9px 12px", border: "1px solid #ececea", borderRadius: 7, fontSize: 13, outline: "none", color: "#0f1e3d", background: "#fafaf9", width: "100%" }}
              />
            </div>

            {error && (
              <div style={{ fontSize: 12, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "8px 12px" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 4, padding: "10px", background: "#C9A567", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, letterSpacing: "0.02em" }}
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#8a8a85" }}>
          Prospera Business Consulting · Content Studio
        </p>
      </div>
    </div>
  );
}
