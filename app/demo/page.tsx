"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PostsLoader from "@/components/PostsLoader";
import StudioPage from "@/app/(app)/studio/page";

export default function DemoPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fbfbfa", overflow: "hidden", position: "relative" }}>
      <PostsLoader />

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 39 }}
        />
      )}

      <div style={{
        position: isMobile ? "fixed" : "relative",
        top: 0, bottom: 0, left: 0,
        transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.24s ease",
        zIndex: 40,
        flexShrink: 0,
      }}>
        <Sidebar />
      </div>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #ececea", background: "#f7f7f5", flexShrink: 0 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "#52524d" }}
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0f1e3d", letterSpacing: "0.01em" }}>Content Studio</span>
          </div>
        )}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <StudioPage />
        </div>
      </main>
    </div>
  );
}
