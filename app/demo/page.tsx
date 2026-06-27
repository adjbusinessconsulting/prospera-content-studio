"use client";
import Sidebar from "@/components/Sidebar";
import PostsLoader from "@/components/PostsLoader";
import StudioPage from "@/app/(app)/studio/page";

export default function DemoPage() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#fbfbfa", overflow: "hidden" }}>
      <PostsLoader />
      <Sidebar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <StudioPage />
      </main>
    </div>
  );
}
