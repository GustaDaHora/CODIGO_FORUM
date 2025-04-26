"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Feed from "@/components/posts";
import CreatePostModal from "@/components/posts/create";

export const dynamic = "force-dynamic";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
  }, []);

  // Function to open the modal
  const openCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  // Function to close the modal
  const closeCreatePost = () => {
    setIsCreatePostOpen(false);
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen">
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

        {/* Feed Section */}
        <div className="flex-1 p-4 md:p-6">
          <Feed onCreateClick={openCreatePost} />
        </div>

        {/* Right Sidebar */}
        <section className="p-4 md:w-1/4 bg-[#10141b]">
          <div className="sticky top-20">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            {isAuthenticated ? (
              <div className="space-y-3">
                <button
                  onClick={openCreatePost}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Create Post
                </button>
                <a href="/profile">
                  <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition">
                    View Profile
                  </button>
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <a href="/auth/login">
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                    Log In
                  </button>
                </a>
                <a href="/auth/register">
                  <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition">
                    Register
                  </button>
                </a>
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
      </div>
      <Footer />

      {/* Add the modal at the bottom of the component */}
      <CreatePostModal isOpen={isCreatePostOpen} onClose={closeCreatePost} />
    </main>
  );
}