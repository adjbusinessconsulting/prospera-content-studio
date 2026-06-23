"use client";

import Link from "next/link";
import TopBar from "@/components/TopBar";
import { useStore } from "@/lib/store";
import { THUMBS, PLATFORM_DEFS, UPCOMING_DAY_LABELS } from "@/lib/data";
import type { Post, PlatformKey } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = 23;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Calendar cells for June 2026 (starts Monday June 1, so May 31 fills the Sunday slot)
function buildCells(): { day: number; isCurrentMonth: boolean; monthLabel?: string }[] {
  const out: { day: number; isCurrentMonth: boolean; monthLabel?: string }[] = [];
  out.push({ day: 31, isCurrentMonth: false, monthLabel: "May" });
  for (let d = 1; d <= 6; d++) out.push({ day: d, isCurrentMonth: true });
  for (let d = 7; d <= 13; d++) out.push({ day: d, isCurrentMonth: true });
  for (let d = 14; d <= 20; d++) out.push({ day: d, isCurrentMonth: true });
  for (let d = 21; d <= 27; d++) out.push({ day: d, isCurrentMonth: true });
  for (let d = 28; d <= 30; d++) out.push({ day: d, isCurrentMonth: true });
  for (let d = 1; d <= 4; d++) out.push({ day: d, isCurrentMonth: false, monthLabel: "Jul" });
  return out;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function ChevLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

function ChevRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52524d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function PlayTriangle({ size = 8, color = "#18181b" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" style={{ marginLeft: size < 10 ? 1 : 3 }}>
      <polygon points="6 4 20 12 6 20 6 4"/>
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripeGradient(platforms: PlatformKey[]): string {
  if (platforms.length === 1) return PLATFORM_DEFS[platforms[0]].color;
  const stops = platforms.map((k, i) => {
    const c = PLATFORM_DEFS[k].color;
    const start = (i / platforms.length) * 100;
    const end = ((i + 1) / platforms.length) * 100;
    return `${c} ${start}%, ${c} ${end}%`;
  }).join(", ");
  return `linear-gradient(180deg, ${stops})`;
}

function statusMeta(status: string) {
  const map: Record<string, { label: string; bg: string; fg: string; dot: string }> = {
    posted:    { label: "Posted",    bg: "#e7f5ef", fg: "#10663f", dot: "#10a37f" },
    scheduled: { label: "Scheduled", bg: "#eef0f7", fg: "#0f1e3d", dot: "#0f1e3d" },
    skipped:   { label: "Skipped",   bg: "#f4f1eb", fg: "#6b5e44", dot: "#c0b8aa" },
    draft:     { label: "Draft",     bg: "#f0f0ee", fg: "#52524d", dot: "#a8a8a3" },
  };
  return map[status] || map.draft;
}

// ─── Calendar chip ────────────────────────────────────────────────────────────

function CalChip({ post, onSelect }: { post: Post; onSelect: () => void }) {
  const isSkipped = post.status === "skipped";
  const isPosted = post.status === "posted";
  const stripe = stripeGradient(post.platforms);
  const thumbBg = isSkipped ? "#e4e4e2" : THUMBS[post.thumb];
  const filter = isSkipped ? "grayscale(70%) opacity(.65)" : undefined;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 5px 2px 0", background: "#fff", border: "1px solid #ececea", borderRadius: 4, cursor: "pointer", overflow: "hidden", filter }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#fbfbfa"; (e.currentTarget as HTMLDivElement).style.borderColor = "#c7c7c4"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#fff"; (e.currentTarget as HTMLDivElement).style.borderColor = "#ececea"; }}
    >
      <span style={{ width: 2.5, height: 18, background: stripe, borderRadius: 1, flexShrink: 0, marginRight: 1 }} />
      <span style={{ width: 14, height: 14, borderRadius: 2.5, background: thumbBg, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10.5, color: isSkipped ? "#a8a8a3" : "#27272a", fontWeight: 500 }}>{post.time}</span>
      <span style={{ flex: 1, fontSize: 11, color: isSkipped ? "#a8a8a3" : "#52524d", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{post.title}</span>
      {isPosted && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10a37f" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {isSkipped && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a8a8a3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      )}
    </div>
  );
}

// ─── Calendar Grid ────────────────────────────────────────────────────────────

function CalendarGrid({ posts, onSelect }: { posts: Post[]; onSelect: (id: string) => void }) {
  const byDay: Record<number, Post[]> = {};
  posts.forEach((p) => {
    if (!byDay[p.day]) byDay[p.day] = [];
    byDay[p.day].push(p);
  });

  const cells = buildCells();

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", border: "1px solid #ececea", borderRadius: 10, background: "#fff", overflow: "hidden" }}>
      {/* Weekday header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #ececea", background: "#fbfbfa", flexShrink: 0 }}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ padding: "9px 10px", fontSize: 10.5, color: "#8a8a85", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRight: "1px solid #ececea" }}>{w}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(5, 1fr)" }}>
        {cells.map((c, i) => {
          const isToday = c.isCurrentMonth && c.day === TODAY;
          const dayPosts = c.isCurrentMonth ? (byDay[c.day] || []) : [];
          const visible = dayPosts.slice(0, 2);
          const more = Math.max(0, dayPosts.length - 2);
          const dayLabel = c.isCurrentMonth ? String(c.day) : `${c.day} ${c.monthLabel}`;
          let cellBg = "#fff";
          if (!c.isCurrentMonth) cellBg = "#fbfbfa";
          if (isToday) cellBg = "#f6f4ef";

          return (
            <div key={i} style={{ padding: "8px 9px", borderRight: "1px solid #ececea", borderBottom: "1px solid #ececea", background: cellBg, display: "flex", flexDirection: "column", overflow: "hidden", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{
                  fontSize: 11.5, fontWeight: isToday ? 600 : 500,
                  color: !c.isCurrentMonth ? "#c0bdb6" : isToday ? "#0f1e3d" : "#18181b",
                  fontFamily: "var(--font-geist-mono, monospace)",
                }}>{dayLabel}</span>
                {isToday && <span style={{ fontSize: 9, color: "#0f1e3d", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Today</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {visible.map((p) => (
                  <CalChip key={p.id} post={p} onSelect={() => onSelect(p.id)} />
                ))}
                {more > 0 && <div style={{ fontSize: 10.5, color: "#8a8a85", padding: "2px 4px" }}>+{more} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Upcoming Panel ───────────────────────────────────────────────────────────

function UpcomingPanel({ posts, onSelect }: { posts: Post[]; onSelect: (id: string) => void }) {
  const upcoming = posts
    .filter((p) => (p.status === "scheduled" || (p.day === TODAY && p.status !== "posted")) && p.day >= TODAY && p.day <= TODAY + 7)
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));

  const groupMap: Record<number, Post[]> = {};
  upcoming.forEach((p) => { if (!groupMap[p.day]) groupMap[p.day] = []; groupMap[p.day].push(p); });

  const groups = Object.keys(groupMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((d) => ({ day: d, posts: groupMap[d], meta: UPCOMING_DAY_LABELS[d] || { label: `Jun ${d}`, date: `Jun ${d}` } }));

  return (
    <aside style={{ width: 300, flexShrink: 0, borderLeft: "1px solid #ececea", background: "#f7f7f5", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 20px 14px" }}>
        <div>
          <div style={{ fontSize: 11, color: "#8a8a85", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>Upcoming</div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.005em" }}>Next 7 days</h2>
        </div>
        <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: "#8a8a85", borderRadius: 5 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#ececea"; e.currentTarget.style.color = "#18181b"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8a8a85"; }}
        >
          <MenuIcon />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {groups.map(({ day, posts: dayPosts, meta }) => (
          <div key={day} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 6px" }}>
              <div style={{ fontSize: 11.5, color: "#18181b", fontWeight: 600 }}>{meta.label}</div>
              <div style={{ fontSize: 11, color: "#8a8a85" }}>{meta.date}</div>
              <div style={{ flex: 1, height: 1, background: "#ececea" }} />
            </div>
            {dayPosts.map((p) => {
              const isVideo = p.media === "video";
              return (
                <div
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: 9, background: "#fbfbfa", border: "1px solid #ececea", borderRadius: 8, cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#c7c7c4"; (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#ececea"; (e.currentTarget as HTMLDivElement).style.background = "#fbfbfa"; }}
                >
                  <div style={{ position: "relative", width: 38, height: 38, borderRadius: 6, background: THUMBS[p.thumb], flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isVideo && (
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <PlayTriangle size={8} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "#18181b", fontWeight: 500 }}>{p.time}</span>
                      {p.platforms.map((k) => (
                        <span key={k} style={{ width: 6, height: 6, borderRadius: "50%", background: PLATFORM_DEFS[k].color, flexShrink: 0 }} />
                      ))}
                      <span style={{ fontSize: 10.5, color: "#8a8a85" }}>{p.platforms.map((k) => PLATFORM_DEFS[k].short).join(" · ")}</span>
                      {isVideo && p.duration && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "#52524d", background: "#ececea", padding: "1px 5px", borderRadius: 3, fontFamily: "var(--font-geist-mono, monospace)" }}>
                          <PlayTriangle size={7} /> {p.duration}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#27272a", lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid #ececea", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#f0f5fd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <InfoIcon />
          </div>
          <div style={{ fontSize: 11.5, color: "#52524d", lineHeight: 1.4 }}>Posts are exported as ZIPs. You publish them manually at the scheduled time.</div>
        </div>
      </div>
    </aside>
  );
}

// ─── Post Drawer ──────────────────────────────────────────────────────────────

function PostDrawer({ post, onClose, onMarkPosted, onPause, onDelete }: {
  post: Post;
  onClose: () => void;
  onMarkPosted: () => void;
  onPause: () => void;
  onDelete: () => void;
}) {
  const st = statusMeta(post.status);
  const isVideo = post.media === "video";
  const dayMeta = UPCOMING_DAY_LABELS[post.day] || { label: `Jun ${post.day}`, date: `Jun ${post.day}` };
  const scheduledLabel = `${dayMeta.label}, ${dayMeta.date} · ${post.time}`;
  const fullScheduled = `${dayMeta.label}, ${dayMeta.date} at ${post.time}`;

  const ratioSizes: Record<string, [number, number]> = {
    "1:1": [220, 220], "4:5": [200, 250], "9:16": [156, 278], "16:9": [278, 156],
  };
  const [pw, ph] = ratioSizes[post.ratio] || [220, 220];

  const exportLabel = post.status === "posted" ? "Downloaded · 1 day ago" : post.status === "scheduled" ? "Ready to export" : "Not exported";
  const exportDot = post.status === "posted" ? "#10a37f" : post.status === "scheduled" ? "#0f1e3d" : "#c0b8aa";

  const handleDelete = () => {
    if (confirm("Delete this post? This cannot be undone.")) onDelete();
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(24,24,27,.18)", zIndex: 30 }} />
      {/* Panel */}
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 380, background: "#fff", borderLeft: "1px solid #ececea", zIndex: 31, display: "flex", flexDirection: "column", boxShadow: "-12px 0 28px rgba(24,24,27,.06)", animation: "slideIn .2s ease" }}>
        {/* Header */}
        <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #ececea" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", background: st.bg, color: st.fg, borderRadius: 5, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", alignSelf: "flex-start" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: st.dot }} />
              {st.label}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.005em", lineHeight: 1.3 }}>{post.title}</div>
            <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11.5, color: "#8a8a85" }}>{scheduledLabel}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: "#8a8a85", borderRadius: 5, flexShrink: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ececea"; e.currentTarget.style.color = "#18181b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8a8a85"; }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Preview */}
          <div style={{ position: "relative", width: pw, height: ph, margin: "0 auto", background: THUMBS[post.thumb], borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: isVideo ? "pointer" : "default" }}>
            {isVideo && (
              <>
                <div
                  style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,.94)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,.18)", transition: "transform .15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
                >
                  <PlayTriangle size={22} />
                </div>
                {post.duration && (
                  <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(24,24,27,.82)", color: "#fff", fontSize: 11, fontWeight: 500, padding: "3px 7px", borderRadius: 5, fontFamily: "var(--font-geist-mono, monospace)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <PlayTriangle size={10} color="#fff" /> {post.duration}
                  </div>
                )}
              </>
            )}
            <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(24,24,27,.82)", color: "#fff", fontSize: 10.5, fontWeight: 500, padding: "3px 7px", borderRadius: 5, fontFamily: "var(--font-geist-mono, monospace)" }}>
              {post.ratio}
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 11.5, color: "#8a8a85", marginTop: -6 }}>
            {isVideo ? `Video · ${post.duration}` : "Photo"}{isVideo && <span style={{ color: "#0f1e3d" }}> · click to preview</span>}
          </div>

          {/* Meta rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#ececea", border: "1px solid #ececea", borderRadius: 8, overflow: "hidden" }}>
            {/* Platforms */}
            <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: "#fff" }}>
              <div style={{ fontSize: 11.5, color: "#8a8a85", width: 90 }}>Platforms</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {post.platforms.map((k) => {
                  const pf = PLATFORM_DEFS[k];
                  return (
                    <div key={k} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px 3px 6px", background: pf.chipBg, color: pf.chipText, borderRadius: 5, fontSize: 11.5, fontWeight: 500 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: pf.color, flexShrink: 0 }} />
                      {pf.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: "#fff" }}>
              <div style={{ fontSize: 11.5, color: "#8a8a85", width: 90 }}>Scheduled</div>
              <div style={{ fontSize: 12.5, color: "#18181b" }}>{fullScheduled}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: "#fff" }}>
              <div style={{ fontSize: 11.5, color: "#8a8a85", width: 90 }}>Aspect ratio</div>
              <div style={{ fontSize: 12.5, color: "#18181b", fontFamily: "var(--font-geist-mono, monospace)" }}>{post.ratio}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: "#fff" }}>
              <div style={{ fontSize: 11.5, color: "#8a8a85", width: 90 }}>ZIP export</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: exportDot }} />
                <span style={{ fontSize: 12.5, color: "#18181b" }}>{exportLabel}</span>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 11, color: "#8a8a85", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Caption</div>
            <div style={{ fontSize: 13, color: "#27272a", lineHeight: 1.55, background: "#fbfbfa", border: "1px solid #ececea", padding: "11px 13px", borderRadius: 8, whiteSpace: "pre-line" }}>
              {post.caption}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid #ececea", display: "flex", flexDirection: "column", gap: 8, background: "#fbfbfa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/studio" style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#18181b", color: "#fff", border: "none", borderRadius: 8, padding: "9px 12px", cursor: "pointer", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
              <PencilIcon /> Edit post
            </Link>
            <button
              onClick={onMarkPosted}
              style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#fff", color: "#18181b", border: "1px solid #ececea", borderRadius: 8, padding: "9px 12px", cursor: "pointer", fontSize: 13, fontWeight: 500 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c7c7c4"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ececea"; }}
            >
              <CheckIcon /> Mark as posted
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onPause}
              style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#fff", color: "#52524d", border: "1px solid #ececea", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12.5 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c7c7c4"; e.currentTarget.style.color = "#18181b"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ececea"; e.currentTarget.style.color = "#52524d"; }}
            >
              <PauseIcon /> Pause
            </button>
            <button
              onClick={handleDelete}
              style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#fff", color: "#52524d", border: "1px solid #ececea", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12.5 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8c4c4"; e.currentTarget.style.color = "#b91c1c"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ececea"; e.currentTarget.style.color = "#52524d"; }}
            >
              <TrashIcon /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Google Calendar Toggle ───────────────────────────────────────────────────

function GoogleSyncToggle() {
  const sync = useStore((s) => s.googleCalendarSync);
  const toggle = useStore((s) => s.toggleGoogleSync);
  return (
    <button
      onClick={toggle}
      style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", border: "1px solid #ececea", borderRadius: 8, padding: "7px 12px 7px 10px", cursor: "pointer", fontSize: 12.5, color: "#52524d" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c7c7c4"; e.currentTarget.style.color = "#18181b"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ececea"; e.currentTarget.style.color = "#52524d"; }}
    >
      <CalIcon />
      Sync to Google Calendar
      <span style={{ display: "inline-block", width: 26, height: 14, borderRadius: 99, background: sync ? "#0f1e3d" : "#d6d6d2", position: "relative", transition: "background .15s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 1.5, left: sync ? 13.5 : 1.5, width: 11, height: 11, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
      </span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const posts = useStore((s) => s.posts);
  const selectedPostId = useStore((s) => s.selectedPostId);
  const setSelectedPost = useStore((s) => s.setSelectedPost);
  const markAsPosted = useStore((s) => s.markAsPosted);
  const pausePost = useStore((s) => s.pausePost);
  const deletePost = useStore((s) => s.deletePost);

  const selectedPost = posts.find((p) => p.id === selectedPostId) ?? null;

  const postedCount = posts.filter((p) => p.status === "posted").length;
  const scheduledCount = posts.filter((p) => p.status === "scheduled").length;
  const skippedCount = posts.filter((p) => p.status === "skipped").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      <TopBar showAccountDropdown={false} />

      <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
        {/* Calendar column */}
        <section style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", padding: "28px 32px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, color: "#8a8a85", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>Schedule</div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>June 2026</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <GoogleSyncToggle />
              <div style={{ height: 24, width: 1, background: "#ececea" }} />
              <SmallBtn icon={<ChevLeft />} />
              <button style={{ fontSize: 12.5, color: "#52524d", background: "#fff", border: "1px solid #ececea", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontWeight: 500 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c7c7c4"; e.currentTarget.style.color = "#18181b"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ececea"; e.currentTarget.style.color = "#52524d"; }}
              >Today</button>
              <SmallBtn icon={<ChevRight />} />
              <Link href="/studio" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#18181b", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 500, textDecoration: "none" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#27272a"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#18181b"; }}
              >
                <PlusIcon /> New post
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 16px", background: "#fff", border: "1px solid #ececea", borderRadius: 9, marginBottom: 14, flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: "#8a8a85", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>This month</div>
            <StatItem dot="#10a37f" value={postedCount} label="posted" />
            <StatItem dot="#0f1e3d" value={scheduledCount} label="scheduled" />
            <StatItem dot="#c0b8aa" value={skippedCount} label="skipped" />
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 12, color: "#8a8a85" }}>Posting cadence: <strong style={{ color: "#18181b", fontWeight: 500 }}>3.4×/week</strong></div>
          </div>

          <CalendarGrid posts={posts} onSelect={setSelectedPost} />
        </section>

        {/* Upcoming panel */}
        <UpcomingPanel posts={posts} onSelect={setSelectedPost} />

        {/* Drawer */}
        {selectedPost && (
          <PostDrawer
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onMarkPosted={() => markAsPosted(selectedPost.id)}
            onPause={() => pausePost(selectedPost.id)}
            onDelete={() => deletePost(selectedPost.id)}
          />
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function StatItem({ dot, value, label }: { dot: string; value: number; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot }} />
      <span style={{ fontSize: 13.5 }}>
        <span style={{ fontWeight: 600, fontFamily: "var(--font-geist-mono, monospace)" }}>{value}</span>{" "}
        <span style={{ color: "#52524d" }}>{label}</span>
      </span>
    </div>
  );
}

function SmallBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, background: "#fff", border: "1px solid #ececea", borderRadius: 7, cursor: "pointer", color: "#52524d" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c7c7c4"; e.currentTarget.style.color = "#18181b"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ececea"; e.currentTarget.style.color = "#52524d"; }}
    >
      {icon}
    </button>
  );
}
