// app/dashboard/page.tsx
"use client";
export const dynamic = "force-dynamic";

import Feed from "@/components/posts";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import CreatePostModal from "@/components/posts/create";


export default function Main() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* Left Sidebar */}
      <aside className="p-4 md:w-1/4 bg-[#10141b]">
        <div className="sticky top-20">
          <h2 className="text-lg font-bold mb-4">Categories</h2>
          <ul className="space-y-2">
            <li><a href="#" className="text-blue-600 hover:underline">Technology</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Science</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Art & Culture</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Sports</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Politics</a></li>
          </ul>
        </div>
      </aside>

      {/* Feed Section (Takes most space) */}
      <div className="flex-1 p-4 md:p-6">
        <Feed />
      </div>

      {/* Right Sidebar */}
      <section className="p-4 md:w-1/4 bg-[#10141b]">
        <div className="sticky top-20">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          {isAuthenticated ? (
            <div className="space-y-3">
              <CreatePostModal 
              isOpen={isCreatePostOpen} 
           onClose={() => setIsCreatePostOpen(false)} 
/>
              <Link href="/profile">
                <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition">
                  View Profile
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/auth/signin">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition">
                  Register
                </button>
              </Link>
            </div>
          )}
          
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Trending Topics</h2>
            <div className="space-y-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#technology</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#webdev</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#ai</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#programming</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}