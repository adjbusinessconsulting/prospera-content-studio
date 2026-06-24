"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DRAFTS = ["Q3 client case study", "Delegation framework carousel", "Friday founder reflections"];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isStudio = pathname === "/studio";
  const isSchedule = pathname === "/schedule";
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initial = email ? email[0].toUpperCase() : "?";

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      borderRight: "1px solid #ececea", background: "#f7f7f5",
      padding: "20px 14px", display: "flex", flexDirection: "column", gap: 24,
    }}>
      {/* Brand block */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 8px" }}>
        <Image src="/brand/mark-navy.svg" alt="Prospera" width={24} height={24} />
        <div style={{ lineHeight: 1.05 }}>
          <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: "0.02em", color: "#0f1e3d" }}>PROSPERA</div>
          <div style={{ fontSize: 9, color: "#8a8a85", letterSpacing: "0.14em", fontWeight: 500 }}>CONTENT STUDIO</div>
        </div>
      </div>

      {/* Workspace nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#8a8a85", padding: "4px 8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Workspace
        </div>
        <NavLink href="/studio" active={isStudio} label="Content Studio" icon={<GridIcon />} />
        <NavLink href="/schedule" active={isSchedule} label="Scheduler" icon={<CalIcon />} />
      </nav>

      {/* Recent drafts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#8a8a85", padding: "4px 8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Recent drafts
        </div>
        {DRAFTS.map((d) => (
          <HoverDiv key={d} style={{ padding: "6px 8px", fontSize: 13, color: "#52524d", cursor: "pointer", borderRadius: 6 }}>
            {d}
          </HoverDiv>
        ))}
      </div>

      {/* User chip */}
      <div style={{ marginTop: "auto", padding: "10px 8px", display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #ececea" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#d6d6d2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#52524d", flexShrink: 0 }}>{initial}</div>
        <div style={{ lineHeight: 1.2, flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email || "Loading…"}</div>
          <div style={{ fontSize: 11, color: "#8a8a85" }}>Personal plan</div>
        </div>
        <button onClick={handleSignOut} title="Sign out" style={{ background: "none", border: "none", cursor: "pointer", color: "#8a8a85", padding: 4, borderRadius: 4, display: "flex", alignItems: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}

function NavLink({ href, active, label, icon }: { href: string; active: boolean; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "7px 8px", borderRadius: 6,
      background: active ? "#ececea" : "transparent",
      color: active ? "#18181b" : "#52524d",
      fontSize: 13.5, fontWeight: active ? 500 : 400,
      textDecoration: "none",
    }}>
      {icon}
      {label}
    </Link>
  );
}

function HoverDiv({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div
      style={style}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#ececea"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
    >
      {children}
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}

function CalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}
