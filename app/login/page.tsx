"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const STRINGS = {
  en: {
    heading: "Sign in to your studio",
    sub: "Enter your credentials to continue.",
    emailLabel: "EMAIL",
    pwLabel: "PASSWORD",
    forgot: "Forgot?",
    cta: "SIGN IN TO STUDIO",
    ctaLoading: "Signing in…",
    noAccess: "Don't have access?",
    requestAccess: "Request access",
  },
  id: {
    heading: "Masuk ke studio Anda",
    sub: "Masukkan kredensial untuk melanjutkan.",
    emailLabel: "EMAIL",
    pwLabel: "KATA SANDI",
    forgot: "Lupa?",
    cta: "MASUK KE STUDIO",
    ctaLoading: "Masuk…",
    noAccess: "Belum punya akses?",
    requestAccess: "Minta akses",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "id">("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = STRINGS[lang];

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
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE7DA", fontFamily: "'Inter', system-ui, sans-serif", padding: "0 20px", WebkitFontSmoothing: "antialiased", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .cs-card { animation: fadeUp 0.35s cubic-bezier(.2,.7,.2,1) both; }
        .cs-input:focus-within { border-color: #0B1129 !important; box-shadow: 0 0 0 3px rgba(11,17,41,0.06) !important; }
        .cs-link:hover { color: #0B1129 !important; }
        .cs-cta:hover { background: #1A2240 !important; }
        .cs-lang:hover { background: #f0ebe2 !important; }
        button, input { font-family: inherit; }
        input:focus { outline: none; }
      `}</style>

      <div className="cs-card" style={{ width: "100%", maxWidth: 460, background: "#FAFAF7", border: "1px solid #ECE7DD", borderRadius: 16, padding: "28px 36px 22px", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px -20px rgba(11,17,41,0.18), 0 4px 16px rgba(11,17,41,0.06)" }}>

        {/* Mini chrome */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5C9E7E", boxShadow: "0 0 0 3px rgba(92,158,126,0.18)", display: "inline-block" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.18em", color: "#7A776F", textTransform: "uppercase" }}>SYSTEM READY</span>
          </div>
          <button
            onClick={() => setLang(l => l === "en" ? "id" : "en")}
            className="cs-lang"
            style={{ background: "#fff", border: "1px solid #ECE7DD", borderRadius: 7, padding: "4px 9px", fontSize: 10.5, color: "#0B1129", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", fontWeight: 500, transition: "background 0.15s" }}>
            {lang.toUpperCase()}
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>

        {/* Brand block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 18 }}>
          <img src="/brand/horizontal-light.png" alt="Prospera" style={{ height: 52, width: "auto", objectFit: "contain", marginBottom: 12 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ flex: "0 0 24px", height: 1, background: "linear-gradient(to right, rgba(201,165,95,0), rgba(201,165,95,0.6))", display: "inline-block" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.32em", color: "#C9A55F", textTransform: "uppercase", fontWeight: 500 }}>CONTENT STUDIO</span>
            <span style={{ flex: "0 0 24px", height: 1, background: "linear-gradient(to left, rgba(201,165,95,0), rgba(201,165,95,0.6))", display: "inline-block" }} />
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 18, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, margin: "0 0 5px", letterSpacing: "-0.01em", lineHeight: 1.1, color: "#0B1129" }}>{t.heading}</h2>
          <div style={{ fontSize: 12.5, color: "#7A776F" }}>{t.sub}</div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          <div>
            <label style={{ display: "block", marginBottom: 6 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.22em", color: "#7A776F", textTransform: "uppercase" }}>{t.emailLabel}</span>
            </label>
            <div className="cs-input" style={{ background: "#fff", border: "1px solid #ECE7DD", borderRadius: 10, padding: "0 13px", display: "flex", alignItems: "center", gap: 10, height: 44, transition: "border-color 0.15s, box-shadow 0.15s" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A776F" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@prospera.id" required style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: "#0B1129", padding: 0 }} />
            </div>
          </div>

          <div>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.22em", color: "#7A776F", textTransform: "uppercase" }}>{t.pwLabel}</span>
              <button type="button" className="cs-link" style={{ background: "transparent", border: "none", padding: 0, fontSize: 10.5, color: "#7A776F", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: "rgba(122,119,111,0.3)", transition: "color 0.15s" }}>{t.forgot}</button>
            </label>
            <div className="cs-input" style={{ background: "#fff", border: "1px solid #ECE7DD", borderRadius: 10, padding: "0 13px", display: "flex", alignItems: "center", gap: 10, height: 44, transition: "border-color 0.15s, box-shadow 0.15s" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A776F" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: "#0B1129", letterSpacing: showPw ? 0 : "0.1em", padding: 0 }} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#7A776F", padding: 4 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          {error && <div style={{ fontSize: 11.5, color: "#dc2626", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, padding: "7px 12px" }}>{error}</div>}

          <button type="submit" disabled={loading} className="cs-cta" style={{ marginTop: 4, background: "#0B1129", border: "none", borderRadius: 10, padding: "0 18px", height: 46, cursor: loading ? "not-allowed" : "pointer", color: "#F2EDE3", fontSize: 13.5, fontWeight: 600, letterSpacing: "0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.15s", opacity: loading ? 0.75 : 1 }}>
            <span>{loading ? t.ctaLoading : t.cta}</span>
            {!loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A55F" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>}
          </button>
        </form>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 14, borderTop: "1px solid #ECE7DD" }}>
          <div style={{ fontSize: 11, color: "#7A776F" }}>
            {t.noAccess}{" "}
            <button type="button" className="cs-link" style={{ background: "transparent", border: "none", padding: "0 0 0 3px", fontSize: 11, color: "#0B1129", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: "#C9A55F", transition: "color 0.15s" }}>{t.requestAccess}</button>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.18em", color: "#7A776F", textTransform: "uppercase" }}>© 2026 PROSPERA</div>
        </div>
      </div>
    </div>
  );
}
