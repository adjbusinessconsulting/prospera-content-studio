"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export default function TopBar({ showAccountDropdown = true }: { showAccountDropdown?: boolean }) {
  const accountMenuOpen = useStore((s) => s.accountMenuOpen);
  const toggleAccountMenu = useStore((s) => s.toggleAccountMenu);
  const closeAccountMenu = useStore((s) => s.closeAccountMenu);
  const chipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!accountMenuOpen) return;
    function onDoc(e: MouseEvent) {
      if (chipRef.current && !chipRef.current.contains(e.target as Node)) {
        closeAccountMenu();
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [accountMenuOpen, closeAccountMenu]);

  return (
    <header style={{
      height: 56, flexShrink: 0,
      borderBottom: "1px solid #ececea", background: "#fbfbfa",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#52524d" }}>
        <span>Hi <strong style={{ color: "#18181b", fontWeight: 500 }}>Anthony</strong>,</span>
        <span>creating content for</span>
        {showAccountDropdown ? (
          <div style={{ position: "relative" }}>
            <button
              ref={chipRef}
              onClick={toggleAccountMenu}
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "#fff", border: "1px solid #ececea", borderRadius: 7,
                padding: "4px 10px 4px 5px", cursor: "pointer", fontSize: 13, color: "#18181b", fontWeight: 500,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d6d6d2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ececea"; }}
            >
              <Image src="/brand/app-icon-gold.png" alt="" width={22} height={22} style={{ borderRadius: 5, display: "block" }} />
              <span>Prospera Business Consulting</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a8a85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {accountMenuOpen && <AccountDropdown onClose={closeAccountMenu} />}
          </div>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", border: "1px solid #ececea", borderRadius: 7, padding: "4px 10px 4px 5px", fontSize: 13, color: "#18181b", fontWeight: 500 }}>
            <Image src="/brand/app-icon-gold.png" alt="" width={22} height={22} style={{ borderRadius: 5 }} />
            Prospera Business Consulting
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <GhostBtn label="Help" icon={<HelpIcon />} />
        <IconBtn icon={<BellIcon />} />
      </div>
    </header>
  );
}

function AccountDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 6px)", left: 0, width: 280,
      background: "#fff", border: "1px solid #ececea", borderRadius: 10, padding: 6,
      zIndex: 50, boxShadow: "0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)",
    }}>
      <div style={{ fontSize: 11, color: "#8a8a85", padding: "6px 8px 4px", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
        Switch account
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 7, background: "#f7f7f5", cursor: "pointer" }}>
        <Image src="/brand/app-icon-gold.png" alt="" width={28} height={28} style={{ borderRadius: 6 }} />
        <div style={{ flex: 1, lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Prospera Business Consulting</div>
          <div style={{ fontSize: 11.5, color: "#8a8a85" }}>3 platforms connected</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div style={{ height: 1, background: "#ececea", margin: "4px 0" }} />
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, borderRadius: 7, cursor: "pointer", color: "#52524d", fontSize: 13 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#f7f7f5"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
        onClick={() => { onClose(); console.log("Add account"); }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add another account
      </div>
    </div>
  );
}

function GhostBtn({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid transparent", borderRadius: 7, padding: "6px 10px", cursor: "pointer", fontSize: 13, color: "#52524d" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#ececea"; e.currentTarget.style.color = "#18181b"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#52524d"; }}
    >
      {icon}{label}
    </button>
  );
}

function IconBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "transparent", border: "none", borderRadius: 7, cursor: "pointer", color: "#52524d" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#ececea"; e.currentTarget.style.color = "#18181b"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#52524d"; }}
    >
      {icon}
    </button>
  );
}

function HelpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  );
}
