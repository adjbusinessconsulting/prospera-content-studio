import type { Post, PlatformKey } from "./types";

export type ContentTypeId = "photo" | "video" | "reel" | "story" | "carousel";

export interface ContentTypeDef {
  id: ContentTypeId;
  label: string;
  /** null for photo/carousel types */
  maxVideo: string | null;
  ratio: string;
  captionLimit: number;
}

export const PLATFORM_CONTENT_TYPES: Record<PlatformKey, ContentTypeDef[]> = {
  fb: [
    { id: "photo",    label: "Photo",    maxVideo: null,   ratio: "1:1 or 4:5", captionLimit: 63206 },
    { id: "video",    label: "Video",    maxVideo: "240m", ratio: "1:1 or 4:5", captionLimit: 63206 },
    { id: "reel",     label: "Reel",     maxVideo: "90s",  ratio: "9:16",       captionLimit: 2200  },
    { id: "story",    label: "Story",    maxVideo: "20s",  ratio: "9:16",       captionLimit: 500   },
    { id: "carousel", label: "Carousel", maxVideo: null,   ratio: "1:1",        captionLimit: 63206 },
  ],
  ig: [
    { id: "photo",    label: "Photo",    maxVideo: null,   ratio: "1:1 or 4:5", captionLimit: 2200 },
    { id: "video",    label: "Video",    maxVideo: "60s",  ratio: "1:1 or 4:5", captionLimit: 2200 },
    { id: "reel",     label: "Reel",     maxVideo: "90s",  ratio: "9:16",       captionLimit: 2200 },
    { id: "story",    label: "Story",    maxVideo: "60s",  ratio: "9:16",       captionLimit: 2200 },
    { id: "carousel", label: "Carousel", maxVideo: null,   ratio: "1:1 or 4:5", captionLimit: 2200 },
  ],
  tt: [
    { id: "video",    label: "Video",    maxVideo: "10m",  ratio: "9:16",       captionLimit: 2200 },
    { id: "photo",    label: "Photo",    maxVideo: null,   ratio: "9:16",       captionLimit: 2200 },
    { id: "story",    label: "Story",    maxVideo: "15s",  ratio: "9:16",       captionLimit: 150  },
  ],
};

export const SEED_POSTS: Post[] = [
  { id: "p-jun02", day: 2, time: "09:30", platforms: ["fb", "ig"], status: "posted", thumb: "a", media: "photo", title: "Q2 client wins — 3 case snapshots", ratio: "1:1", caption: "Three founders. Three industries. One pattern.\n\nHere's what changed when each of them stopped being the bottleneck. ↓" },
  { id: "p-jun04", day: 4, time: "14:00", platforms: ["ig"], status: "posted", thumb: "b", media: "photo", title: "Founder mindset carousel", ratio: "4:5", caption: "The mindset shift that separates founders who scale from founders who stall." },
  { id: "p-jun05", day: 5, time: "11:00", platforms: ["fb", "ig", "tt"], status: "posted", thumb: "c", media: "video", duration: "1:28", title: "Podcast clip — hiring the wrong VP", ratio: "9:16", caption: "\"I hired a VP of Sales nine months too early.\" A 90-second confession from last week's pod." },
  { id: "p-jun08", day: 8, time: "09:30", platforms: ["ig"], status: "posted", thumb: "d", media: "photo", title: "Monday momentum quote", ratio: "1:1", caption: "Strategy without systems is just expensive ambition." },
  { id: "p-jun09", day: 9, time: "16:00", platforms: ["fb", "ig"], status: "posted", thumb: "e", media: "video", duration: "42:10", title: "Webinar replay — pricing pressure", ratio: "16:9", caption: "How 7 services firms re-priced in Q1 without losing a single client. Full replay inside." },
  { id: "p-jun10", day: 10, time: "13:00", platforms: ["fb", "ig"], status: "skipped", thumb: "f", media: "video", duration: "0:48", title: "Q&A intro — sales delegation", ratio: "4:5", caption: "Skipped — replaced by Wednesday's webinar invite." },
  { id: "p-jun11", day: 11, time: "12:00", platforms: ["tt"], status: "posted", thumb: "g", media: "video", duration: "0:36", title: "Hot take: hiring before $1M ARR", ratio: "9:16", caption: "Hot take: most founders hire 6–9 months too early. Here's the math." },
  { id: "p-jun15", day: 15, time: "09:30", platforms: ["fb", "ig"], status: "posted", thumb: "h", media: "photo", title: "Newsletter teaser — June issue", ratio: "1:1", caption: "This week in the Prospera memo: delegation traps, pricing pressure, and a Q2 retrospective." },
  { id: "p-jun16", day: 16, time: "14:00", platforms: ["ig", "tt"], status: "posted", thumb: "a", media: "video", duration: "1:04", title: "Office tour — where the work happens", ratio: "9:16", caption: "60-second walk through the studio. The wall of frameworks gets a cameo." },
  { id: "p-jun17", day: 17, time: "15:00", platforms: ["tt"], status: "skipped", thumb: "b", media: "video", duration: "0:52", title: "BTS — coffee & whiteboards", ratio: "9:16", caption: "Skipped — content didn't land in review." },
  { id: "p-jun18", day: 18, time: "11:00", platforms: ["ig"], status: "posted", thumb: "c", media: "photo", title: "Case study slides — 11-month turnaround", ratio: "4:5", caption: "A $2M services firm doubled revenue in 11 months by removing the founder from sales. Here's the playbook." },
  { id: "p-jun19", day: 19, time: "10:00", platforms: ["fb", "ig"], status: "posted", thumb: "d", media: "photo", title: "Friday recap — what we shipped", ratio: "1:1", caption: "Three frameworks, two case studies, one new advisory cohort. Friday wins." },
  { id: "p-jun22", day: 22, time: "09:30", platforms: ["fb", "ig", "tt"], status: "posted", thumb: "e", media: "video", duration: "2:14", title: "Delegation framework — full walkthrough", ratio: "9:16", caption: "The 3-question test we use with every founder before their next hire." },
  { id: "p-jun23", day: 23, time: "08:30", platforms: ["ig"], status: "posted", thumb: "f", media: "photo", title: "Tuesday hot take — \"founder mode\"", ratio: "4:5", caption: "\"Founder mode\" is great. \"Founder bottleneck\" is not. Knowing the difference is worth a lot." },
  { id: "p-jun24-09", day: 24, time: "09:30", platforms: ["fb", "ig"], status: "scheduled", thumb: "e", media: "video", duration: "0:54", title: "3 signs you're ready to scale beyond founder-led sales", ratio: "9:16", caption: "Most founders don't have a growth problem — they have a delegation problem.\n\nIf every deal still runs through you, you don't have a business yet. You have a job with extra steps.\n\nThree signs you're ready to scale beyond founder-led sales — and what to build first. ↓" },
  { id: "p-jun25", day: 25, time: "14:00", platforms: ["ig", "tt"], status: "scheduled", thumb: "h", media: "photo", title: "Carousel — 5 systems before your next hire", ratio: "4:5", caption: "The 5 systems most founders build in the wrong order. Slide 3 is the one they push back on." },
  { id: "p-jun27", day: 27, time: "11:00", platforms: ["ig"], status: "scheduled", thumb: "a", media: "photo", title: "Saturday founder reflection", ratio: "1:1", caption: "A quiet Saturday thought on what 'enough' looks like at year three." },
  { id: "p-jun30", day: 30, time: "09:30", platforms: ["fb", "ig", "tt"], status: "scheduled", thumb: "c", media: "video", duration: "1:12", title: "End-of-month recap — what worked", ratio: "9:16", caption: "Wrapping June with the three pieces that hit, the two that didn't, and what we're testing in July." },
];

export const THUMBS: Record<string, string> = {
  a: "linear-gradient(135deg,#e8d4c2,#c19a78)",
  b: "linear-gradient(135deg,#d6dde8,#a4b3c8)",
  c: "linear-gradient(135deg,#f5d0a0,#e89b6d)",
  d: "linear-gradient(135deg,#c4b8a8,#8a7c66)",
  e: "linear-gradient(135deg,#0f1e3d,#3a4d7a)",
  f: "linear-gradient(135deg,#d9c5a8,#a37e4e)",
  g: "linear-gradient(135deg,#cfd6d1,#8a958c)",
  h: "linear-gradient(135deg,#f2e4d2,#c9a36b)",
};

export const PLATFORM_DEFS = {
  fb: {
    name: "Facebook", color: "#1877f2", chipBg: "#eef4fc", chipText: "#1d4ed8", short: "FB",
    tagline: "Reach + community", iconLabel: "f",
    limit: 63206, video: "240m", ratio: "1:1 or 4:5",
    iconBg: "#1877f2",
  },
  ig: {
    name: "Instagram", color: "#e1306c", chipBg: "#fcecf2", chipText: "#be1d5b", short: "IG",
    tagline: "Feed, Reels, Stories", iconLabel: "ig",
    limit: 2200, video: "90s (Reels)", ratio: "9:16 or 1:1",
    iconBg: "linear-gradient(135deg,#feda75,#fa7e1e 30%,#d62976 60%,#962fbf 80%,#4f5bd5)",
  },
  tt: {
    name: "TikTok", color: "#18181b", chipBg: "#f0f0ee", chipText: "#18181b", short: "TT",
    tagline: "Short-form video", iconLabel: "tt",
    limit: 2200, video: "10m", ratio: "9:16",
    iconBg: "#18181b",
  },
} as const;

export const AI_IDEAS = [
  { tag: "Hook", text: "If every deal still runs through the founder, you don't have a business — you have a very demanding job." },
  { tag: "Framework", text: "The 3-question test: can a new hire close, deliver, and retain a client without you in the room?" },
  { tag: "Story", text: "Client case — how a $2M services firm doubled revenue in 11 months by removing the founder from sales." },
  { tag: "Carousel", text: "5 systems to build before your next hire, in the order most founders get wrong." },
];

export const UPCOMING_DAY_LABELS: Record<number, { label: string; date: string }> = {
  23: { label: "Today", date: "Jun 23" },
  24: { label: "Tomorrow", date: "Wed, Jun 24" },
  25: { label: "Thursday", date: "Jun 25" },
  26: { label: "Friday", date: "Jun 26" },
  27: { label: "Saturday", date: "Jun 27" },
  28: { label: "Sunday", date: "Jun 28" },
  29: { label: "Monday", date: "Jun 29" },
  30: { label: "Tuesday", date: "Jun 30" },
};
