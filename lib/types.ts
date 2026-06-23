export type PlatformKey = "fb" | "ig" | "tt";
export type MediaType = "photo" | "video";
export type PostStatus = "draft" | "scheduled" | "posted" | "skipped";
export type AspectRatio = "1:1" | "4:5" | "9:16" | "16:9";
export type ThumbKey = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export interface Post {
  id: string;
  day: number;
  time: string;
  platforms: PlatformKey[];
  status: PostStatus;
  media: MediaType;
  duration?: string;
  thumb: ThumbKey;
  title: string;
  ratio: AspectRatio;
  caption: string;
}
