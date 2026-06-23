"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useCallback } from "react";
import TopBar from "@/components/TopBar";
import { useStore } from "@/lib/store";
import { PLATFORM_DEFS, PLATFORM_CONTENT_TYPES, AI_IDEAS } from "@/lib/data";
import type { PlatformKey, AspectRatio } from "@/lib/types";
import type { ContentTypeId } from "@/lib/data";

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c87646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#52524d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a87209" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function PencilIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#52524d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RATIO_MAP: Record<AspectRatio, [number, number]> = {
  "1:1": [1, 1],
  "4:5": [4, 5],
  "9:16": [9, 16],
  "16:9": [16, 9],
};

const RATIO_DEFS: { value: AspectRatio; label: string; use: string; w: number; h: number }[] = [
  { value: "1:1", label: "1:1", use: "Square feed", w: 22, h: 22 },
  { value: "4:5", label: "4:5", use: "Portrait feed", w: 18, h: 22 },
  { value: "9:16", label: "9:16", use: "Reels / Stories", w: 14, h: 22 },
  { value: "16:9", label: "16:9", use: "Landscape", w: 24, h: 14 },
];

function platformIcon(key: PlatformKey, size: 28 | 22 = 28) {
  const p = PLATFORM_DEFS[key];
  const radius = size === 28 ? 7 : 5;
  const fontSize = size === 28 ? 12 : 10;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: p.iconBg,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize, fontWeight: 600, fontFamily: "var(--font-geist-mono, monospace)",
      textTransform: "lowercase", flexShrink: 0,
    }}>
      {p.iconLabel}
    </div>
  );
}

// ─── Section A: Claude AI Assistant ──────────────────────────────────────────

function AIAssistant() {
  const aiOpen = useStore((s) => s.aiOpen);
  const aiPrompt = useStore((s) => s.aiPrompt);
  const aiIdeasGenerated = useStore((s) => s.aiIdeasGenerated);
  const toggleAI = useStore((s) => s.toggleAI);
  const setAIPrompt = useStore((s) => s.setAIPrompt);
  const generateIdeas = useStore((s) => s.generateIdeas);
  const useIdea = useStore((s) => s.useIdea);

  return (
    <section style={{ border: "1px solid #ececea", borderRadius: 10, background: "#fff", overflow: "hidden" }}>
      <button
        onClick={toggleAI}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "#f4ede3", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SunIcon />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 550 }}>Need ideas? Ask Claude</div>
            <div style={{ fontSize: 12.5, color: "#8a8a85", marginTop: 1 }}>Brainstorm hooks, captions, and angles for your post</div>
          </div>
        </div>
        <div style={{ transform: aiOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .15s", color: "#8a8a85" }}>
          <ChevronDown size={14} />
        </div>
      </button>

      {aiOpen && (
        <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              placeholder="What do you want to post about?"
              style={{ flex: 1, border: "1px solid #ececea", background: "#fbfbfa", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none" }}
              onFocus={(e) => { e.target.style.borderColor = "#c7c7c4"; e.target.style.background = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#ececea"; e.target.style.background = "#fbfbfa"; }}
            />
            <button
              onClick={generateIdeas}
              style={{ background: "#18181b", color: "#fff", border: "none", borderRadius: 8, padding: "0 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#27272a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#18181b"; }}
            >
              <SparkIcon /> Generate ideas
            </button>
          </div>

          {aiIdeasGenerated && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 11, color: "#8a8a85", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {AI_IDEAS.length} ideas · click one to use
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {AI_IDEAS.map((idea) => (
                  <button
                    key={idea.tag}
                    onClick={() => useIdea(idea.text)}
                    style={{ textAlign: "left", padding: "12px 14px", background: "#fbfbfa", border: "1px solid #ececea", borderRadius: 8, cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#d6d6d2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fbfbfa"; e.currentTarget.style.borderColor = "#ececea"; }}
                  >
                    <div style={{ fontSize: 12, color: "#c87646", fontWeight: 500 }}>{idea.tag}</div>
                    <div style={{ fontSize: 13, color: "#27272a", lineHeight: 1.45 }}>{idea.text}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Content type icons ───────────────────────────────────────────────────────

function ContentTypeIcon({ id }: { id: ContentTypeId }) {
  const s = { width: 13, height: 13, display: "block" };
  if (id === "photo") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
  if (id === "video") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  );
  if (id === "reel") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2"/>
      <path d="M10 8l4 4-4 4"/>
    </svg>
  );
  if (id === "story") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
  // carousel
  return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="14" height="14" rx="1"/>
      <path d="M2 9h3M19 9h3M2 15h3M19 15h3"/>
    </svg>
  );
}

// ─── Section B: Platform Selector ────────────────────────────────────────────

function PlatformSelector() {
  const draftPlatforms = useStore((s) => s.draftPlatforms);
  const draftContentTypes = useStore((s) => s.draftContentTypes);
  const togglePlatform = useStore((s) => s.togglePlatform);
  const setContentType = useStore((s) => s.setContentType);

  const selectedPlatforms = (Object.keys(PLATFORM_DEFS) as PlatformKey[]).filter((k) => draftPlatforms[k]);
  const count = selectedPlatforms.length;
  const statusLabel = count > 0
    ? `${count} of 3 selected · post once, publish everywhere`
    : "Select at least one to continue";

  // Spec badges: reflect the chosen content type for each selected platform
  const specBadges: { label: string; value: string }[] = [];
  selectedPlatforms.forEach((key) => {
    const p = PLATFORM_DEFS[key];
    const types = PLATFORM_CONTENT_TYPES[key];
    const ct = types.find((t) => t.id === draftContentTypes[key]) ?? types[0];
    if (ct.maxVideo) specBadges.push({ label: `${p.name} · max ${ct.id === "reel" || ct.id === "story" ? ct.id : "video"}`, value: ct.maxVideo });
    specBadges.push({ label: `${p.name} · ratio`, value: ct.ratio });
    specBadges.push({ label: `${p.name} · caption`, value: ct.captionLimit.toLocaleString() });
  });

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: "-0.005em" }}>Platforms</h2>
        <div style={{ fontSize: 12, color: "#8a8a85" }}>{statusLabel}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {(Object.keys(PLATFORM_DEFS) as PlatformKey[]).map((key) => {
          const p = PLATFORM_DEFS[key];
          const selected = draftPlatforms[key];
          const types = PLATFORM_CONTENT_TYPES[key];
          const activeType = draftContentTypes[key];

          return (
            <div
              key={key}
              style={{
                border: `1px solid ${selected ? "#18181b" : "#ececea"}`,
                boxShadow: selected ? "0 0 0 1px #18181b inset" : "none",
                background: "#fff", borderRadius: 10, overflow: "hidden",
                transition: "border-color .1s",
              }}
            >
              {/* Card header — click to toggle platform */}
              <button
                onClick={() => togglePlatform(key)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: 14, background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {platformIcon(key, 28)}
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontSize: 14, fontWeight: 550, color: "#18181b" }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: "#8a8a85", marginTop: 2 }}>{p.tagline}</div>
                  </div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: 5,
                  border: `1.5px solid ${selected ? "#18181b" : "#d6d6d2"}`,
                  background: selected ? "#18181b" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {selected && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </button>

              {/* Content type picker — only when selected */}
              {selected && (
                <div style={{ borderTop: "1px solid #ececea", padding: "10px 14px", display: "flex", flexWrap: "wrap", gap: 6, background: "#fbfbfa" }}>
                  {types.map((ct) => {
                    const active = activeType === ct.id;
                    return (
                      <button
                        key={ct.id}
                        onClick={() => setContentType(key, ct.id)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "4px 10px", borderRadius: 6, border: `1px solid ${active ? "#18181b" : "#d6d6d2"}`,
                          background: active ? "#18181b" : "#fff",
                          color: active ? "#fff" : "#52524d",
                          fontSize: 12, fontWeight: active ? 500 : 400,
                          cursor: "pointer", whiteSpace: "nowrap",
                          transition: "background .1s, border-color .1s, color .1s",
                        }}
                        onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "#a8a8a3"; e.currentTarget.style.color = "#18181b"; } }}
                        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "#d6d6d2"; e.currentTarget.style.color = "#52524d"; } }}
                      >
                        <ContentTypeIcon id={ct.id} />
                        {ct.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {count > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", background: "#f7f7f5", borderRadius: 8 }}>
          {specBadges.map((b, i) => (
            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #ececea", borderRadius: 6, padding: "4px 9px", fontSize: 11.5 }}>
              <span style={{ color: "#8a8a85" }}>{b.label}</span>
              <span style={{ color: "#18181b", fontWeight: 500, fontFamily: "var(--font-geist-mono, monospace)" }}>{b.value}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Section C: Media Upload ──────────────────────────────────────────────────

type UploadedFile = { name: string; sizeMB: string; url: string; kind: "image" | "video" };

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

function MediaSection() {
  const ratio = useStore((s) => s.draftRatio);
  const setHasMedia = useStore((s) => s.setHasMedia);
  const setRatio = useStore((s) => s.setRatio);
  const draftPlatforms = useStore((s) => s.draftPlatforms);

  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasMedia = uploaded !== null;

  const [rw, rh] = RATIO_MAP[ratio];
  const maxH = 320;
  const previewH = Math.min(maxH, (360 / rw) * rh);
  const previewW = (previewH * rw) / rh;
  const currentRatioHeight = Math.round((1080 / rw) * rh);

  const handleFile = useCallback((file: File) => {
    const kind = file.type.startsWith("image/") ? "image" : "video";
    const url = URL.createObjectURL(file);
    setUploaded({ name: file.name, sizeMB: formatSize(file.size), url, kind });
    setHasMedia(true);
  }, [setHasMedia]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleReplace = () => {
    if (uploaded) URL.revokeObjectURL(uploaded.url);
    setUploaded(null);
    setHasMedia(false);
  };

  const warnings: { platform: string; message: string }[] = [];
  if (hasMedia) {
    if (ratio === "16:9" && (draftPlatforms.ig || draftPlatforms.tt)) {
      warnings.push({ platform: draftPlatforms.ig ? "Instagram" : "TikTok", message: "16:9 will letterbox in Reels. Try 9:16 for full-screen vertical." });
    }
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Media</h2>
        {hasMedia && (
          <button
            onClick={handleReplace}
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#8a8a85" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#18181b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#8a8a85"; }}
          >
            Replace media
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      {!hasMedia ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `1.5px dashed ${dragging ? "#18181b" : "#d6d6d2"}`,
            borderRadius: 10,
            background: dragging ? "#f0f0ee" : "#fbfbfa",
            padding: "48px 24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            cursor: "pointer",
            transition: "border-color .1s, background .1s",
          }}
          onMouseEnter={(e) => { if (!dragging) { (e.currentTarget as HTMLDivElement).style.borderColor = "#a8a8a3"; (e.currentTarget as HTMLDivElement).style.background = "#f7f7f5"; } }}
          onMouseLeave={(e) => { if (!dragging) { (e.currentTarget as HTMLDivElement).style.borderColor = "#d6d6d2"; (e.currentTarget as HTMLDivElement).style.background = "#fbfbfa"; } }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", border: "1px solid #ececea", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UploadIcon />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: "#18181b" }}>
              {dragging ? "Drop to upload" : "Upload photo or video"}
            </div>
            <div style={{ fontSize: 12, color: "#8a8a85", marginTop: 3 }}>Drag and drop, or click to browse · MP4, MOV, JPG, PNG up to 4 GB</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            style={{ marginTop: 4, padding: "7px 18px", background: "#18181b", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#2d2d30"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#18181b"; }}
          >
            Browse files
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16, alignItems: "start" }}>
            {/* Preview card */}
            <div style={{ border: "1px solid #ececea", borderRadius: 10, background: "#fff", padding: 14 }}>
              <div style={{ position: "relative", width: previewW, height: previewH, margin: "0 auto", background: "#f7f7f5", border: "1px solid #ececea", borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {uploaded.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={uploaded.url}
                    alt={uploaded.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, #ececea 0 2px, transparent 2px 14px)", opacity: 0.7 }} />
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#52524d" }}>
                      <VideoIcon />
                      <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.02em", maxWidth: previewW - 24, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>{uploaded.name}</div>
                    </div>
                  </>
                )}
                <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(24,24,27,.78)", color: "#fff", fontSize: 10.5, fontWeight: 500, padding: "3px 7px", borderRadius: 5, fontFamily: "var(--font-geist-mono, monospace)" }}>
                  {ratio}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "#8a8a85" }}>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{uploaded.name} · {uploaded.sizeMB}</div>
                <div style={{ flexShrink: 0 }}>1080 × {currentRatioHeight}</div>
              </div>
            </div>

            {/* Aspect ratio picker */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, color: "#8a8a85", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Aspect ratio</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {RATIO_DEFS.map((r) => {
                  const sel = r.value === ratio;
                  return (
                    <button
                      key={r.value}
                      onClick={() => setRatio(r.value)}
                      style={{
                        display: "flex", alignItems: "center", gap: 9, padding: "8px 10px",
                        border: `1px solid ${sel ? "#18181b" : "#ececea"}`,
                        boxShadow: sel ? "0 0 0 1px #18181b inset" : "none",
                        background: "#fff", borderRadius: 8, cursor: "pointer", textAlign: "left",
                      }}
                      onMouseEnter={(e) => { if (!sel) e.currentTarget.style.borderColor = "#c7c7c4"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = sel ? "#18181b" : "#ececea"; }}
                    >
                      <div style={{ width: r.w, height: r.h, border: `1.5px solid ${sel ? "#18181b" : "#a8a8a3"}`, borderRadius: 2, flexShrink: 0 }} />
                      <div style={{ lineHeight: 1.2 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, fontFamily: "var(--font-geist-mono, monospace)" }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: "#8a8a85", marginTop: 1 }}>{r.use}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {warnings.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {warnings.map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#fdf6e9", border: "1px solid #f1dfb8", borderRadius: 8, padding: "10px 12px" }}>
                  <WarnIcon />
                  <div style={{ fontSize: 13, color: "#6b4906", lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 550, color: "#5c3f04" }}>{w.platform}</span> · {w.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

// ─── Section D: Caption ───────────────────────────────────────────────────────

function CaptionSection() {
  const caption = useStore((s) => s.draftCaption);
  const setCaption = useStore((s) => s.setCaption);
  const draftPlatforms = useStore((s) => s.draftPlatforms);
  const customizePerPlatform = useStore((s) => s.draftCustomizePerPlatform);
  const toggleCustomizePerPlatform = useStore((s) => s.toggleCustomizePerPlatform);
  const captionPerPlatform = useStore((s) => s.draftCaptionPerPlatform);
  const setCaptionPerPlatform = useStore((s) => s.setCaptionPerPlatform);

  const selectedPlatforms = (Object.keys(PLATFORM_DEFS) as PlatformKey[]).filter((k) => draftPlatforms[k]);
  const hasSelected = selectedPlatforms.length > 0;

  let minLimit = Infinity;
  let minLimitPlatform = "—";
  if (hasSelected) {
    selectedPlatforms.forEach((key) => {
      const p = PLATFORM_DEFS[key];
      if (p.limit < minLimit) { minLimit = p.limit; minLimitPlatform = p.name; }
    });
  } else {
    minLimit = 2200;
    minLimitPlatform = "—";
  }

  const captionCount = caption.length;
  const wordCount = caption.trim().split(/\s+/).filter(Boolean).length;
  const ratio = hasSelected ? captionCount / minLimit : 0;
  let counterColor = "#8a8a85";
  if (ratio > 1) counterColor = "#c2410c";
  else if (ratio > 0.85) counterColor = "#a87209";
  else if (captionCount > 0) counterColor = "#52524d";

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Caption</h2>
        <div style={{ fontSize: 12, color: counterColor, fontFamily: "var(--font-geist-mono, monospace)" }}>
          {captionCount.toLocaleString()} / {hasSelected ? minLimit.toLocaleString() : "—"}{" "}
          <span style={{ color: "#8a8a85" }}>({minLimitPlatform})</span>
        </div>
      </div>

      {/* Main caption card */}
      <div style={{ border: "1px solid #ececea", borderRadius: 10, background: "#fff" }}>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your caption…"
          style={{ width: "100%", minHeight: 160, resize: "vertical", border: "none", outline: "none", padding: "14px 16px", fontSize: 14, lineHeight: 1.55, background: "transparent", borderRadius: "10px 10px 0 0", fontFamily: "inherit" }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderTop: "1px solid #ececea", background: "#fbfbfa", borderRadius: "0 0 10px 10px" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { label: "Emoji", icon: <EmojiIcon /> },
              { label: "# Hashtags", icon: null },
              { label: "@ Mention", icon: null },
            ].map(({ label, icon }) => (
              <button key={label} style={{ background: "transparent", border: "none", padding: "5px 8px", borderRadius: 5, cursor: "pointer", fontSize: 12, color: "#52524d", display: "inline-flex", alignItems: "center", gap: 5 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ececea"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {icon}{label}
              </button>
            ))}
          </div>
          <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "#8a8a85" }}>{wordCount} words</div>
        </div>
      </div>

      {/* Per-platform customize */}
      <div style={{ border: "1px solid #ececea", borderRadius: 10, background: "#fff", overflow: "hidden" }}>
        <button
          onClick={toggleCustomizePerPlatform}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PencilIcon />
            <div style={{ fontSize: 13, fontWeight: 500 }}>Customize per platform</div>
            <div style={{ fontSize: 12, color: "#8a8a85" }}>Override the caption for individual platforms</div>
          </div>
          <div style={{ transform: customizePerPlatform ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .15s", color: "#8a8a85" }}>
            <ChevronDown size={13} />
          </div>
        </button>

        {customizePerPlatform && hasSelected && (
          <div style={{ padding: "0 14px 14px", paddingTop: 14, display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid #ececea" }}>
            {selectedPlatforms.map((key) => {
              const p = PLATFORM_DEFS[key];
              const perCount = (captionPerPlatform[key] || "").length;
              return (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {platformIcon(key, 22)}
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{p.name}</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "#8a8a85" }}>
                      {perCount} / {p.limit.toLocaleString()}
                    </div>
                  </div>
                  <textarea
                    value={captionPerPlatform[key]}
                    onChange={(e) => setCaptionPerPlatform(key, e.target.value)}
                    placeholder={`Override caption for ${p.name}…`}
                    style={{ width: "100%", minHeight: 72, resize: "vertical", border: "1px solid #ececea", outline: "none", padding: "9px 11px", fontSize: 13, lineHeight: 1.5, background: "#fbfbfa", borderRadius: 7, fontFamily: "inherit" }}
                    onFocus={(e) => { e.target.style.borderColor = "#c7c7c4"; e.target.style.background = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#ececea"; e.target.style.background = "#fbfbfa"; }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function EmojiIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  );
}

// ─── Section E: Action Bar ────────────────────────────────────────────────────

function ActionBar() {
  const router = useRouter();
  return (
    <div style={{ flexShrink: 0, borderTop: "1px solid #ececea", background: "rgba(251,251,250,.92)", backdropFilter: "blur(8px)", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 20 }}>
      <button
        style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", border: "1px solid #ececea", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13, color: "#52524d", fontWeight: 500 }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c7c7c4"; e.currentTarget.style.color = "#18181b"; e.currentTarget.style.background = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ececea"; e.currentTarget.style.color = "#52524d"; e.currentTarget.style.background = "transparent"; }}
        onClick={() => console.log("Save draft")}
      >
        <SaveIcon /> Save draft
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #ececea", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13, color: "#18181b", fontWeight: 500 }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c7c7c4"; e.currentTarget.style.background = "#fbfbfa"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ececea"; e.currentTarget.style.background = "#fff"; }}
          onClick={() => console.log("Download ZIP")}
        >
          <DownloadIcon /> Download as ZIP
        </button>
        <button
          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#18181b", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 500 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#27272a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#18181b"; }}
          onClick={() => router.push("/schedule")}
        >
          Schedule this post <ArrowRight />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudioPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      <TopBar showAccountDropdown />

      <div style={{ flex: 1, overflowY: "auto", padding: "32px 48px 40px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Page heading */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: "#8a8a85", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>New post</div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>Content Studio</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8a8a85" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10a37f", display: "inline-block" }} />
              Autosaved · 2 min ago
            </div>
          </div>

          <AIAssistant />
          <PlatformSelector />
          <MediaSection />
          <CaptionSection />
        </div>
      </div>

      <ActionBar />
    </div>
  );
}
