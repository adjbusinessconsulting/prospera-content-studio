import { create } from "zustand";
import type { Post, PlatformKey, AspectRatio } from "./types";
import { SEED_POSTS } from "./data";
import type { ContentTypeId } from "./data";

interface AppStore {
  posts: Post[];

  // Draft (studio)
  draftPlatforms: Record<PlatformKey, boolean>;
  draftContentTypes: Record<PlatformKey, ContentTypeId>;
  draftHasMedia: boolean;
  draftRatio: AspectRatio;
  draftCaption: string;
  draftCaptionPerPlatform: Record<PlatformKey, string>;
  draftCustomizePerPlatform: boolean;

  // AI assistant
  aiOpen: boolean;
  aiPrompt: string;
  aiIdeasGenerated: boolean;

  // UI
  accountMenuOpen: boolean;
  selectedPostId: string | null;
  googleCalendarSync: boolean;

  // Actions
  toggleAI: () => void;
  setAIPrompt: (p: string) => void;
  generateIdeas: () => void;
  useIdea: (text: string) => void;
  toggleAccountMenu: () => void;
  closeAccountMenu: () => void;
  togglePlatform: (key: PlatformKey) => void;
  setContentType: (key: PlatformKey, type: ContentTypeId) => void;
  setRatio: (ratio: AspectRatio) => void;
  setHasMedia: (has: boolean) => void;
  setCaption: (caption: string) => void;
  setCaptionPerPlatform: (key: PlatformKey, caption: string) => void;
  toggleCustomizePerPlatform: () => void;
  setSelectedPost: (id: string | null) => void;
  toggleGoogleSync: () => void;
  markAsPosted: (id: string) => void;
  pausePost: (id: string) => void;
  deletePost: (id: string) => void;
}

export const useStore = create<AppStore>((set) => ({
  posts: SEED_POSTS,

  draftPlatforms: { fb: true, ig: true, tt: false },
  draftContentTypes: { fb: "video", ig: "reel", tt: "video" },
  draftHasMedia: true,
  draftRatio: "9:16",
  draftCaption:
    "Most founders don't have a growth problem — they have a delegation problem.\n\nIf every deal still runs through you, you don't have a business yet. You have a job with extra steps.\n\nThree signs you're ready to scale beyond founder-led sales — and what to build first. ↓",
  draftCaptionPerPlatform: { fb: "", ig: "", tt: "" },
  draftCustomizePerPlatform: false,

  aiOpen: true,
  aiPrompt: "Three signs your business is ready to scale beyond founder-led sales",
  aiIdeasGenerated: true,

  accountMenuOpen: false,
  selectedPostId: "p-jun24-09",
  googleCalendarSync: false,

  toggleAI: () => set((s) => ({ aiOpen: !s.aiOpen })),
  setAIPrompt: (p) => set({ aiPrompt: p }),
  generateIdeas: () => set({ aiIdeasGenerated: true }),
  useIdea: (text) => set({ draftCaption: text, aiOpen: false }),
  toggleAccountMenu: () => set((s) => ({ accountMenuOpen: !s.accountMenuOpen })),
  closeAccountMenu: () => set({ accountMenuOpen: false }),
  togglePlatform: (key) =>
    set((s) => ({ draftPlatforms: { ...s.draftPlatforms, [key]: !s.draftPlatforms[key] } })),
  setContentType: (key, type) =>
    set((s) => ({ draftContentTypes: { ...s.draftContentTypes, [key]: type } })),
  setRatio: (ratio) => set({ draftRatio: ratio }),
  setHasMedia: (has) => set({ draftHasMedia: has }),
  setCaption: (caption) => set({ draftCaption: caption }),
  setCaptionPerPlatform: (key, caption) =>
    set((s) => ({ draftCaptionPerPlatform: { ...s.draftCaptionPerPlatform, [key]: caption } })),
  toggleCustomizePerPlatform: () =>
    set((s) => ({ draftCustomizePerPlatform: !s.draftCustomizePerPlatform })),
  setSelectedPost: (id) => set({ selectedPostId: id }),
  toggleGoogleSync: () => set((s) => ({ googleCalendarSync: !s.googleCalendarSync })),
  markAsPosted: (id) =>
    set((s) => ({
      posts: s.posts.map((p) => (p.id === id ? { ...p, status: "posted" } : p)),
      selectedPostId: null,
    })),
  pausePost: (id) =>
    set((s) => ({
      posts: s.posts.map((p) => (p.id === id ? { ...p, status: "draft" } : p)),
    })),
  deletePost: (id) =>
    set((s) => ({
      posts: s.posts.filter((p) => p.id !== id),
      selectedPostId: null,
    })),
}));
