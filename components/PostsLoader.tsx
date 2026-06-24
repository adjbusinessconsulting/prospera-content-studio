"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function PostsLoader() {
  const loadPosts = useStore((s) => s.loadPosts);
  const postsLoaded = useStore((s) => s.postsLoaded);

  useEffect(() => {
    if (!postsLoaded) loadPosts();
  }, [loadPosts, postsLoaded]);

  return null;
}
