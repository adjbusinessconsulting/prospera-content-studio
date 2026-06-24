import Sidebar from "@/components/Sidebar";
import PostsLoader from "@/components/PostsLoader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100%", background: "#fbfbfa", overflow: "hidden" }}>
      <PostsLoader />
      <Sidebar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
