"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/studio");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE7DA", fontFamily: "'Inter', system-ui, sans-serif", padding: "32px 20px", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .cs-card { animation: fadeUp 0.4s cubic-bezier(.2,.7,.2,1) both; }
        .cs-input:focus-within { border-color: #0B1129 !important; box-shadow: 0 0 0 4px rgba(11,17,41,0.06) !important; }
        .cs-link:hover { color: #0B1129 !important; }
        .cs-cta:hover { background: #1A2240 !important; }
        button, input { font-family: inherit; }
        input:focus { outline: none; }
      `}</style>

      <div className="cs-card" style={{ width: "100%", maxWidth: 480, background: "#FAFAF7", border: "1px solid #ECE7DD", borderRadius: 18, padding: "44px 44px 36px", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px -24px rgba(11,17,41,0.18), 0 4px 16px rgba(11,17,41,0.06)" }}>

        {/* Mini chrome */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5C9E7E", boxShadow: "0 0 0 3px rgba(92,158,126,0.18)", display: "inline-block" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", color: "#7A776F", textTransform: "uppercase" }}>SYSTEM READY</span>
          </div>
          <button style={{ background: "#fff", border: "1px solid #ECE7DD", borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "#0B1129", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span>EN</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>

        {/* Brand block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <img src="/brand/horizontal-light.png" alt="Prospera Business Consulting" style={{ height: 96, width: "auto", objectFit: "contain", marginBottom: 18 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ flex: "0 0 28px", height: 1, background: "linear-gradient(to right, rgba(201,165,95,0), rgba(201,165,95,0.6))", display: "inline-block" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.32em", color: "#C9A55F", textTransform: "uppercase", fontWeight: 500 }}>CONTENT STUDIO</span>
            <span style={{ flex: "0 0 28px", height: 1, background: "linear-gradient(to left, rgba(201,165,95,0), rgba(201,165,95,0.6))", display: "inline-block" }} />
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 500, margin: "0 0 8px", letterSpacing: "-0.015em", lineHeight: 1.05, color: "#0B1129" }}>Sign in to your studio</h2>
          <div style={{ fontSize: 13.5, color: "#7A776F" }}>Enter your credentials to continue.</div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Email */}
          <div>
            <label style={{ display: "block", marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: "#7A776F", textTransform: "uppercase" }}>EMAIL</span>
            </label>
            <div className="cs-input" style={{ background: "#fff", border: "1px solid #ECE7DD", borderRadius: 11, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, height: 50, transition: "border-color 0.15s, box-shadow 0.15s" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A776F" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@prospera.id" required style={{ flex: 1, border: "none", background: "transparent", fontSize: 14.5, color: "#0B1129", padding: 0 }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: "#7A776F", textTransform: "uppercase" }}>PASSWORD</span>
              <button type="button" className="cs-link" style={{ background: "transparent", border: "none", padding: 0, fontSize: 11, color: "#7A776F", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: "rgba(122,119,111,0.3)", transition: "color 0.15s" }}>Forgot?</button>
            </label>
            <div className="cs-input" style={{ background: "#fff", border: "1px solid #ECE7DD", borderRadius: 11, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, height: 50, transition: "border-color 0.15s, box-shadow 0.15s" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A776F" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ flex: 1, border: "none", background: "transparent", fontSize: 14.5, color: "#0B1129", letterSpacing: showPw ? 0 : "0.1em", padding: 0 }} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#7A776F", padding: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          {/* Remember */}
          <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", userSelect: "none", marginTop: 4 }}>
            <span style={{ width: 16, height: 16, borderRadius: 5, border: "1.5px solid #0B1129", background: "#0B1129", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#C9A55F" strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>
            </span>
            <span style={{ fontSize: 12.5, color: "#0B1129" }}>Stay signed in for 30 days</span>
          </label>

          {error && <div style={{ fontSize: 12, color: "#dc2626", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

          {/* CTA */}
          <button type="submit" disabled={loading} className="cs-cta" style={{ marginTop: 8, background: "#0B1129", border: "none", borderRadius: 12, padding: "0 22px", height: 54, cursor: loading ? "not-allowed" : "pointer", color: "#F2EDE3", fontSize: 14, fontWeight: 600, letterSpacing: "0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "background 0.15s", opacity: loading ? 0.75 : 1 }}>
            <span>{loading ? "Signing in…" : "SIGN IN TO STUDIO"}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A55F" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        </form>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 22, borderTop: "1px solid #ECE7DD" }}>
          <div style={{ fontSize: 11.5, color: "#7A776F" }}>
            Don't have an account?{" "}
            <button type="button" className="cs-link" style={{ background: "transparent", border: "none", padding: "0 0 0 4px", fontSize: 11.5, color: "#0B1129", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: "#C9A55F", transition: "color 0.15s" }}>Request access</button>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.18em", color: "#7A776F", textTransform: "uppercase" }}>© 2026 PROSPERA</div>
        </div>
      </div>
    </div>
  );
}
