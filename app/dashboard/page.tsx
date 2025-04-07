"use client";
export const dynamic = "force-dynamic";

import Post from "@/components/posts";

export default function Main() {
  return (
    <main className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="p-[1vw] w-1/4 min-w-[20%] bg-gray-100">
        Left Sidebar Content
      </aside>

      {/* Feed Section (Takes most space) */}
      <div className="flex-1 p-[1vw] bg-white">
        <Post />
      </div>

      {/* Right Sidebar */}
      <section className="p-[1vw] w-1/4 min-w-[20%] bg-gray-100">
        Right Sidebar Content
      </section>
    </main>
  );
}
