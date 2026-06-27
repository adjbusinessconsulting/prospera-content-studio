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

function BrandLockup({ variant = "light" }: { variant?: "light" | "dark" }) {
  const wordmarkColor = variant === "dark" ? "#F2EDE3" : "#0B1129";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <svg width="44" height="44" viewBox="0 0 100 100">
        <rect x="10" y="62" width="14" height="26" rx="3" fill="#A6843F"/>
        <rect x="30" y="50" width="14" height="38" rx="3" fill="#C9A55F"/>
        <rect x="50" y="34" width="14" height="54" rx="3" fill="#D4B36C"/>
        <rect x="70" y="22" width="14" height="66" rx="3" fill="#E5C778"/>
        <polygon points="63,22 91,22 77,4" fill="#E5C778"/>
      </svg>
      <div style={{ width: 80, height: 1, background: "linear-gradient(to right, rgba(201,165,95,0), rgba(201,165,95,0.6), rgba(201,165,95,0))", margin: "7px 0 9px" }} />
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 32, letterSpacing: "0.06em", lineHeight: 1, color: wordmarkColor }}>PROSPERA</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, letterSpacing: "0.36em", color: "#C9A55F", marginTop: 5, lineHeight: 1 }}>BUSINESS&nbsp;CONSULTING</div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "id">("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = STRINGS[lang];

  async function handleLogin(e: React.SyntheticEvent) {
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

      <div className="cs-card" style={{ width: "100%", maxWidth: 460, background: "#FAFAF7", border: "1px solid #ECE7DD", borderRadius: 18, padding: "24px 36px 20px", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px -24px rgba(11,17,41,0.18), 0 4px 16px rgba(11,17,41,0.06)" }}>

        {/* Mini chrome */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5C9E7E", boxShadow: "0 0 0 3px rgba(92,158,126,0.18)", display: "inline-block" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.18em", color: "#7A776F", textTransform: "uppercase" }}>SYSTEM READY</span>
          </div>
          <button
            onClick={() => setLang(l => l === "en" ? "id" : "en")}
            className="cs-lang"
            style={{ background: "#fff", border: "1px solid #ECE7DD", borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "#0B1129", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontWeight: 500, transition: "background 0.15s" }}>
            {lang.toUpperCase()}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>

        {/* Brand block */}
        <div style={{ marginBottom: 14 }}>
          <BrandLockup variant="light" />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <span style={{ flex: "0 0 28px", height: 1, background: "linear-gradient(to right, rgba(201,165,95,0), rgba(201,165,95,0.6))", display: "inline-block" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.32em", color: "#C9A55F", textTransform: "uppercase", fontWeight: 500 }}>CONTENT STUDIO</span>
            <span style={{ flex: "0 0 28px", height: 1, background: "linear-gradient(to left, rgba(201,165,95,0), rgba(201,165,95,0.6))", display: "inline-block" }} />
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, margin: "0 0 5px", letterSpacing: "-0.015em", lineHeight: 1.05, color: "#0B1129" }}>{t.heading}</h2>
          <div style={{ fontSize: 13, color: "#7A776F" }}>{t.sub}</div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div>
            <label style={{ display: "block", marginBottom: 7 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: "#7A776F", textTransform: "uppercase" }}>{t.emailLabel}</span>
            </label>
            <div className="cs-input" style={{ background: "#fff", border: "1px solid #ECE7DD", borderRadius: 11, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, height: 46, transition: "border-color 0.15s, box-shadow 0.15s" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A776F" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@prospera.id" required style={{ flex: 1, border: "none", background: "transparent", fontSize: 14.5, color: "#0B1129", padding: 0 }} />
            </div>
          </div>

          <div>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: "#7A776F", textTransform: "uppercase" }}>{t.pwLabel}</span>
              <button type="button" className="cs-link" style={{ background: "transparent", border: "none", padding: 0, fontSize: 11, color: "#7A776F", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: "rgba(122,119,111,0.3)", transition: "color 0.15s" }}>{t.forgot}</button>
            </label>
            <div className="cs-input" style={{ background: "#fff", border: "1px solid #ECE7DD", borderRadius: 11, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, height: 46, transition: "border-color 0.15s, box-shadow 0.15s" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A776F" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ flex: 1, border: "none", background: "transparent", fontSize: 14.5, color: "#0B1129", letterSpacing: showPw ? 0 : "0.1em", padding: 0 }} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#7A776F", padding: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          {error && <div style={{ fontSize: 11.5, color: "#dc2626", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, padding: "7px 12px" }}>{error}</div>}

          <button type="submit" disabled={loading} className="cs-cta" style={{ marginTop: 3, background: "#0B1129", border: "none", borderRadius: 12, padding: "0 22px", height: 50, cursor: loading ? "not-allowed" : "pointer", color: "#F2EDE3", fontSize: 14, fontWeight: 600, letterSpacing: "0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "background 0.15s", opacity: loading ? 0.75 : 1 }}>
            <span>{loading ? t.ctaLoading : t.cta}</span>
            {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A55F" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>}
          </button>
        </form>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 13, borderTop: "1px solid #ECE7DD" }}>
          <div style={{ fontSize: 11.5, color: "#7A776F" }}>
            {t.noAccess}{" "}
            <button type="button" className="cs-link" style={{ background: "transparent", border: "none", padding: "0 0 0 3px", fontSize: 11.5, color: "#0B1129", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: "#C9A55F", transition: "color 0.15s" }}>{t.requestAccess}</button>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.18em", color: "#7A776F", textTransform: "uppercase" }}>© 2026 PROSPERA</div>
        </div>
      </div>
    </div>
  );
}
